import fs from 'fs';
import path from 'path';
import HomeClient from './HomeClient';

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