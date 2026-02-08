import fs from 'fs';
import path from 'path';
import HomeClient from './HomeClient';

export const metadata = {
  title: '板原豪士（GOSHI ITAHARA）',
  description: '板原豪士（GOSHI ITAHARA）が運営するiT4P studioのフォト・ムービーワークスを紹介するポートフォリオサイト。',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '板原豪士（GOSHI ITAHARA）｜iT4P studio',
    description: '板原豪士（GOSHI ITAHARA）が運営するiT4P studioのフォト・ムービーワークスを紹介するポートフォリオサイト。',
    url: '/',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'iT4P studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '板原豪士（GOSHI ITAHARA）｜iT4P studio',
    description: '板原豪士（GOSHI ITAHARA）が運営するiT4P studioのフォト・ムービーワークスを紹介するポートフォリオサイト。',
    images: ['/og.jpg'],
  },
};

export default function Page() {
  const slidesDir = path.join(process.cwd(), 'public', 'slides');
  let files = [];
  try {
    files = fs.readdirSync(slidesDir);
  } catch (err) {
    console.error('Slides directory not found:', err);
  }
  const slides = files
    .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .map((f) => `/slides/${f}`);

  return <HomeClient slides={slides} />;
}
