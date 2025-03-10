import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
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
  private readonly pngCacheDir = path.join(
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
    if (!fs.existsSync(this.pngCacheDir)) {
      fs.mkdirSync(this.pngCacheDir, { recursive: true });
    }
  }

  async convertSvgToPng(svgPath: string): Promise<Buffer> {
    // Déterminer si svgPath est un chemin absolu ou relatif
    const svgFullPath = path.isAbsolute(svgPath)
      ? svgPath
      : path.join(this.svgDir, svgPath);

    const pngFileName = `${path.basename(svgPath, '.svg')}.png`;
    const pngFullPath = path.join(this.pngCacheDir, pngFileName);

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
}
