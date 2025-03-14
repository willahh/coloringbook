import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs'; // FIXME: use fs/promises
import * as fsPromises from 'fs/promises';
import * as path from 'path';

@Injectable()
export class SvgConversionService {
  private readonly svgDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'assets',
    'svg',
  );
  private readonly svgConvertedDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'svg-converted',
  );
  private readonly thumbDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    '2png',
  );

  constructor() {
    // Créer les dossiers s'ils n'existent pas
    if (!fs.existsSync(this.svgDir)) {
      fs.mkdirSync(this.svgDir, { recursive: true });
    }
    if (!fs.existsSync(this.svgConvertedDir)) {
      fs.mkdirSync(this.svgConvertedDir, { recursive: true });
    }
    if (!fs.existsSync(this.thumbDir)) {
      fs.mkdirSync(this.thumbDir, { recursive: true });
    }
  }

  async convertSvgToPng(svgPath: string): Promise<Buffer> {
    // Déterminer si svgPath est un chemin absolu ou relatif
    const svgFullPath = path.isAbsolute(svgPath)
      ? svgPath
      : path.join(this.svgDir, svgPath);

    const pngFileName = `${path.basename(svgPath, '.svg')}.png`;
    const pngFullPath = path.join(this.thumbDir, pngFileName);

    // Vérifier si le PNG existe déjà dans le cache
    if (fs.existsSync(pngFullPath)) {
      return fs.readFileSync(pngFullPath);
    }

    // Vérifier si le SVG existe
    if (!fs.existsSync(svgFullPath)) {
      throw new Error(`SVG file not found: ${svgFullPath}`);
    }

    // Convertir SVG en PNG avec sharp
    const pngBuffer = await sharp(svgFullPath).png({ quality: 80 }).toBuffer();

    // Écrire le fichier dans le cache
    fs.writeFileSync(pngFullPath, pngBuffer);

    return pngBuffer;
  }

  async getSvgContent(svgPath: string): Promise<string> {
    const svgFullPath = path.isAbsolute(svgPath)
      ? svgPath
      : path.join(this.svgDir, svgPath);

    if (!fs.existsSync(svgFullPath)) {
      throw new Error(`SVG file not found: ${svgFullPath}`);
    }

    return fs.readFileSync(svgFullPath, 'utf-8');
  }

  async saveSvgAndConvert(svgContent: string) {
    try {
      // Vérifier si svgContent est valide
      if (!svgContent || typeof svgContent !== 'string') {
        throw new Error('Invalid SVG content provided');
      }

      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const svgFileName = `converted-${timestamp}.svg`;

      const svgPath = path.join(this.svgConvertedDir, svgFileName);

      // Sauvegarder le fichier SVG
      await fsPromises.writeFile(svgPath, svgContent);

      // Convertir en PNG
      await this.convertSvgToPng(svgPath);

      return svgPath;
    } catch (error) {
      console.error('Error in saveSvgAndConvert:', error.message, error.stack);
      throw new Error(`Failed to save and convert SVG: ${error.message}`);
    }
  }

  async getSvgConvertedList(): Promise<{ file: string; thumb: string }[]> {
    try {
      console.log(
        'Reading SVG converted directory:',
        path.resolve(this.svgConvertedDir),
      );

      const files = await fsPromises.readdir(this.svgConvertedDir);
      const svgFiles = files.filter((file) => file.endsWith('.svg'));

      const result = await Promise.all(
        svgFiles.map(async (svgFile) => {
          const svgPath = `${this.svgConvertedDir}/${svgFile}`;
          const pngFile = `${path.basename(svgFile, '.svg')}.png`;
          const pngPath = `${this.thumbDir}/${pngFile}`;
          const name = svgFile;

          return { name: name, file: svgPath, thumb: pngPath };
        }),
      );

      console.log('SVG converted list:', result);
      return result;
    } catch (error) {
      console.error(
        'Error in getSvgConvertedList:',
        error.message,
        error.stack,
      );
      throw new Error(`Failed to list SVG files: ${error.message}`);
    }
  }

  async getSvgContentFromPath(relativePath: string): Promise<string> {
    try {
      // Normaliser le chemin pour gérer les différences de format
      const normalizedPath = relativePath.startsWith('/')
        ? relativePath.slice(1)
        : relativePath;

      // Construire le chemin complet
      const svgFullPath = path.join(__dirname, '../../../', normalizedPath);

      console.log('Attempting to read SVG from:', svgFullPath);

      // Vérifier si le fichier existe
      if (
        !(await fsPromises
          .access(svgFullPath)
          .then(() => true)
          .catch(() => false))
      ) {
        throw new Error(`SVG file not found: ${svgFullPath}`);
      }

      // Lire et retourner le contenu
      const content = await fsPromises.readFile(svgFullPath, 'utf-8');
      return content;
    } catch (error) {
      console.error(
        'Error in getSvgContentFromPath:',
        error.message,
        error.stack,
      );
      throw new Error(`Failed to get SVG content: ${error.message}`);
    }
  }
}
