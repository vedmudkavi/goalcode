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
  title: 'GoalCode — Football Match Intelligence',
  description: 'Search real football matches and explore lineups, animated goals, territory, team stats and tactical evolution.',
  openGraph: {
    title: 'GoalCode — Football Match Intelligence',
    description: 'Search real football matches and explore lineups, animated goals, territory, team stats and tactical evolution.',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'GoalCode Football Match Intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoalCode — Football Match Intelligence',
    description: 'Search real football matches and explore lineups, animated goals, territory, team stats and tactical evolution.',
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
