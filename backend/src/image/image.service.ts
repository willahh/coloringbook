import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as potrace from 'potrace';
import * as fs from 'fs';
import { CreateGraphicAssetDto } from '@/graphic-assets/dto/create-graphic-asset.dto';
import { GraphicAssetType } from '@/graphic-assets/entities/graphic-asset-type.enum';
import { GraphicAssetsService } from '@/graphic-assets/graphic-assets.service';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  constructor(private readonly graphicAssetsService: GraphicAssetsService) {}

  async convertToVector(file: Express.Multer.File): Promise<string> {
    const pathToImage = file.path;
    const filenameWithoutExtension = path.parse(file.filename).name;

    // Define paths
    const convertedDir = path.join(file.destination, '/..', 'vect');
    const thumbnailDir = path.join(file.destination, '/..', 'thumbnails');

    const pathToConvertedImage = path.join(
      convertedDir,
      filenameWithoutExtension + '.svg',
    );
    const pathToThumbnail = path.join(
      thumbnailDir,
      filenameWithoutExtension + '.jpg',
    );

    // Create directories if they do not exist
    try {
      if (!fs.existsSync(convertedDir)) {
        fs.mkdirSync(convertedDir, { recursive: true });
      }
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }
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

      // Create a new GraphicAsset with the svg file
      const graphicAssetDTO = new CreateGraphicAssetDto();
      graphicAssetDTO.type = GraphicAssetType.SVG;
      graphicAssetDTO.name = filenameWithoutExtension;
      graphicAssetDTO.path = pathToConvertedImage;

      await this.graphicAssetsService.create(graphicAssetDTO);

      return pathToConvertedImage;
    } catch (error) {
      console.error('Conversion error:', error);
      throw error;
    }
  }
}
