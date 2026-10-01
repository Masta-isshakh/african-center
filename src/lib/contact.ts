import { brand, whatsappNumber } from './brand';

/** `wa.me` deep link with a pre-filled message, or `null` while `brand.whatsapp` is a placeholder. */
export function whatsappHref(message: string): string | null {
  const n = whatsappNumber();
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(message)}` : null;
}

export const telHref = (phone: string = brand.phones[0]) => `tel:${phone}`;
export const mailHref = (email: string = brand.email) => `mailto:${email}`;

export function mapsHref() {
  return `https://www.google.com/maps/search/?api=1&query=${brand.geo.lat},${brand.geo.lng}`;
}
