import { Filesystem, Directory } from '@capacitor/filesystem';

export class BookUtils {
  static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  static checkDirectoryExists(directory: Directory): Promise<boolean> {
    return Filesystem.readdir({ path: '', directory })
      .then((result) => result.files.some((file) => file.name === 'Documents'))
      .catch((error) => {
        console.error('Erreur vérification dossier :', error);
        return false;
      });
  }
}
