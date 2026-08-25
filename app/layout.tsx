import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3000'),
  title: 'PitchIQ — Football Match Intelligence',
  description: 'Turn match events into clear shot maps, expected goals, and tactical insights.',
  openGraph: {
    title: 'PitchIQ — Football Match Intelligence',
    description: 'Turn match events into clear shot maps, expected goals, and tactical insights.',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'PitchIQ Football Match Intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PitchIQ — Football Match Intelligence',
    description: 'Turn match events into clear shot maps, expected goals, and tactical insights.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
