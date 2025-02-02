import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as potrace from 'potrace';
import * as fs from 'fs';
import { CreateGraphicAssetDto } from '@/graphic-assets/dto/create-graphic-asset.dto';
import { GraphicAssetType } from '@/graphic-assets/entities/graphic-asset-type.enum';
import { GraphicAssetsService } from '@/graphic-assets/graphic-assets.service';
import * as sharp from 'sharp';
import { SupabaseService } from '@/supabase.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly graphicAssetsService: GraphicAssetsService,
    private readonly supabaseService: SupabaseService,
  ) {}

  private async uploadToSupabase(
    bucketName: string,
    folder: string,
    filePath: string,
  ): Promise<string> {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(`${folder}/${fileName}`, fileContent);

    if (error) {
      throw new Error(`Failed to upload file to Supabase: ${error.message}`);
    }

    // Get public URL for the uploaded file
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`${folder}/${fileName}`);

    return data.publicUrl;
  }

  async convertToVector(file: Express.Multer.File): Promise<string> {
    const pathToImage = file.path;
    const filenameWithoutExtension = path.parse(file.filename).name;

    // Define paths
    const fullDir = path.join(file.destination, '/..', 'full');
    const convertedDir = path.join(file.destination, '/..', 'vect');
    const thumbnailDir = path.join(file.destination, '/..', 'thumbnails');

    const pathToFullImage = path.join(
      fullDir,
      `${filenameWithoutExtension}.jpg`,
    );
    const pathToConvertedImage = path.join(
      convertedDir,
      `${filenameWithoutExtension}.svg`,
    );
    const pathToThumbnail = path.join(
      thumbnailDir,
      `${filenameWithoutExtension}.jpg`,
    );

    // Create directories if they do not exist
    try {
      [fullDir, convertedDir, thumbnailDir].forEach((dir) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });
    } catch (error) {
      console.error('Error creating directories:', error);
      throw error;
    }

    const options = {
      color: 'black',
      threshold: 180,
      turdSize: 2,
      turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
      optTolerance: 0.2,
      optCurve: true,
      alphaMax: 1,
    };

    try {
      // Convert bitmap image to svg
      const svg = await new Promise<string>((resolve, reject) => {
        potrace.trace(pathToImage, options, (err, svg) => {
          if (err) {
            reject(err);
          } else {
            resolve(svg);
          }
        });
      });

      // Write the image svg into a file
      fs.writeFileSync(pathToConvertedImage, svg);

      // Create thumbnail
      await sharp(pathToImage)
        .jpeg({ quality: 80 })
        .resize(150, 150)
        .toFile(pathToThumbnail);

      // Upload files to Supabase Storage
      const bucketName = 'uploads/graphic_asset'; // Replace with your bucket name
      await Promise.all([
        this.uploadToSupabase(bucketName, 'full', pathToFullImage),
        this.uploadToSupabase(bucketName, 'vect', pathToConvertedImage),
        this.uploadToSupabase(bucketName, 'thumbnails', pathToThumbnail),
      ]);

      // Create a new GraphicAsset with the svg file
      const graphicAssetDTO = new CreateGraphicAssetDto();
      graphicAssetDTO.type = GraphicAssetType.SVG;
      graphicAssetDTO.name = filenameWithoutExtension;
      graphicAssetDTO.path = pathToThumbnail;
      graphicAssetDTO.fullPath = pathToFullImage;
      graphicAssetDTO.vectPath = pathToConvertedImage;

      await this.graphicAssetsService.create(graphicAssetDTO);

      return pathToConvertedImage;
    } catch (error) {
      console.error('Conversion error:', error);
      throw error;
    }
  }
}
