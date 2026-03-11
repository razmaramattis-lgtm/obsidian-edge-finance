// Native SMS sending via Capacitor plugin bridge
// On Android, this calls the custom NativeSms plugin that uses SmsManager

import { Capacitor } from '@capacitor/core';

interface NativeSmsPlugin {
  sendSms(options: { phone: string; message: string }): Promise<{ success: boolean; error?: string }>;
}

// Register the plugin - available when running as native Android app
const getNativeSmsPlugin = (): NativeSmsPlugin | null => {
  if (Capacitor.isNativePlatform()) {
    return (Capacitor as any).Plugins?.NativeSms || null;
  }
  return null;
};

export const isNativePlatform = () => Capacitor.isNativePlatform();

export const sendNativeSms = async (phone: string, message: string): Promise<{ success: boolean; error?: string }> => {
  const plugin = getNativeSmsPlugin();
  if (!plugin) {
    return { success: false, error: 'Native SMS plugin not available' };
  }
  try {
    return await plugin.sendSms({ phone, message });
  } catch (e: any) {
    return { success: false, error: e.message || String(e) };
  }
};
