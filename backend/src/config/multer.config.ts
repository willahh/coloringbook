import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

export const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads', // Dossier où les fichiers seront stockés
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split('.').pop();
      cb(null, `${uniqueSuffix}.${ext}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 10, // Par exemple, 10 MB (ajustez selon vos besoins)
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Seuls les fichiers images sont autorisés'), false);
    }
    cb(null, true);
  },
};
