import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.147316ca21f1469aafe1e4de27a2760d',
  appName: 'Avargo',
  webDir: 'dist',
  server: {
    url: 'https://147316ca-21f1-469a-afe1-e4de27a2760d.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0f0f0f',
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f0f0f',
      showSpinner: false,
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f0f0f',
    },
  },
};

export default config;
