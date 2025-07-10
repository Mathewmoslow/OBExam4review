import type { Metadata } from 'next';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: 'OB Exam Review - Interactive Learning Platform',
  description: 'Master Labor & Postpartum Complications with gamified learning, 3D simulations, and interactive case studies.',
  keywords: 'obstetrics, nursing, exam preparation, medical education, interactive learning',
  authors: [{ name: 'OB Exam Review Team' }],
  openGraph: {
    title: 'OB Exam Review - Interactive Learning Platform',
    description: 'Master Labor & Postpartum Complications with award-winning educational technology',
    type: 'website',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
