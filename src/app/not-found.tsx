import Link from 'next/link';
import ar from '../../messages/ar.json';
import en from '../../messages/en.json';

/** Only reached for paths the locale middleware can't map — shows both languages. */
export default function RootNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#101418', color: '#fff', fontFamily: "'Times New Roman', Times, Tinos, serif", textAlign: 'center' }}>
        <main>
          <p style={{ fontSize: '5rem', fontWeight: 800, color: '#C99A2E', margin: 0 }}>{ar.errors.notFound.code}</p>
          <h1 style={{ margin: '1rem 0 0.5rem' }}>{ar.errors.notFound.title}</h1>
          <p lang="en" dir="ltr" style={{ margin: 0, opacity: 0.7 }}>
            {en.errors.notFound.title}
          </p>
          <p style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/ar" style={{ color: '#DFB95C' }}>
              {ar.errors.notFound.home}
            </Link>
            <Link href="/en" lang="en" style={{ color: '#DFB95C' }}>
              {en.errors.notFound.home}
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
