import { renderIcon } from '@/lib/og';

// Favicon stays tiny; the 512px install icon is served from /pwa-icon via the manifest.
export const size = { width: 48, height: 48 };
export const contentType = 'image/png';

export default function Icon() {
  return renderIcon(48);
}
