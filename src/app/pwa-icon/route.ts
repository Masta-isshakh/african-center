import { renderIcon } from '@/lib/og';

export const dynamic = 'force-static';

/** 512×512 install icon referenced by the web app manifest. */
export function GET() {
  return renderIcon(512);
}
