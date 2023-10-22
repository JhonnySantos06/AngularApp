import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gestiontareas.app',
  appName: 'gestion-tareas',
  webDir: 'dist/gestion-tareas',
  server: {
    androidScheme: 'https'
  }
};

export default config;
