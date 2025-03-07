import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'fr.onywave.coloringbook',
  appName: 'ColoringBook',
  webDir: '../frontend/dist',
  server: {
    url: 'http://192.168.1.67:5173', // URL dev locale
    cleartext: true, // Permet HTTP en dev (HTTPS requis en prod)
    allowInsecureRequests: true // Permet d’ignorer les erreurs de certificat (dev uniquement)
  }
};

export default config;