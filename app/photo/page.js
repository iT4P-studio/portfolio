// app/photo/page.js
import fs from "fs";
import path from "path";
import exifr from "exifr";
import { EXIF_PICK_FIELDS, buildExifInfo, formatDate, getShotTimestamp } from "./exifFormat";
import xPhotosData from "./xPhotosData";
import PhotoGrid from "./PhotoGrid";

export const runtime = "nodejs";
export const metadata = {
  title: "Photo Works",
  description: "撮影実績・フォトギャラリー。スポーツ・イベント・ステージ撮影を中心に掲載。",
  alternates: {
    canonical: "/photo",
  },
  openGraph: {
    title: "Photo Works",
    description: "撮影実績・フォトギャラリー。スポーツ・イベント・ステージ撮影を中心に掲載。",
    url: "/photo",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "iT4P studio Photo Works",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Works",
    description: "撮影実績・フォトギャラリー。スポーツ・イベント・ステージ撮影を中心に掲載。",
    images: ["/og.jpg"],
  },
};

const getExifrParser = async () => {
  if (exifr?.parse) return exifr.parse;
  if (exifr?.default?.parse) return exifr.default.parse;
  try {
    const mod = await import("exifr");
    if (mod?.parse) return mod.parse;
    if (mod?.default?.parse) return mod.default.parse;
  } catch {
    return null;
  }
  return null;
};

const TWITTER_EPOCH_MS = 1288834974657n;

const extractStatusId = (postUrl) => {
  if (typeof postUrl !== "string") return null;
  const match = postUrl.match(/status\/(\d+)/);
  return match ? match[1] : null;
};

const getTweetDateFromId = (id) => {
  try {
    const snowflake = BigInt(id);
    const timestamp = Number((snowflake >> 22n) + TWITTER_EPOCH_MS);
    return Number.isFinite(timestamp) ? new Date(timestamp) : null;
  } catch {
    return null;
  }
};

export default async function PhotoPage() {
  // 1) public/photos からローカル画像を取得し、撮影日(EXIF)で新しい順に並べ替え
  const photosDir = path.join(process.cwd(), "public", "photos");
  const allFiles = fs.existsSync(photosDir) ? fs.readdirSync(photosDir) : [];
  const exifrParse = await getExifrParser();

  const imageFiles = allFiles.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  });

  // birthtimeMs が無い環境もあるので ctimeMs / mtimeMs をフォールバック
  const localWithTime = await Promise.all(
    imageFiles.map(async (file) => {
      const full = path.join(photosDir, file);
      let shotTs = 0;
      let exifInfo = null;
      try {
        if (exifrParse) {
          const exif = await exifrParse(full, {
            pick: EXIF_PICK_FIELDS,
          });
          shotTs = getShotTimestamp(exif);
          exifInfo = buildExifInfo(exif);
        }
      } catch {
        shotTs = 0;
        exifInfo = null;
      }

      const ts = Number.isFinite(shotTs) && shotTs > 0 ? shotTs : 0;

      return {
        src: `/photos/${file}`,
        isLocal: true,
        _ts: ts,
        exif: exifInfo,
      };
    })
  );

  const stripTimestamp = (item) => {
    const base = { src: item.src, isLocal: item.isLocal };
    if (item.postUrl) base.postUrl = item.postUrl;
    if (item.exif) base.exif = item.exif;
    if (item.publishedDate) base.publishedDate = item.publishedDate;
    if (Number.isFinite(item._ts) && item._ts > 0) base.sortTs = item._ts;
    return base;
  };

  // 2) X画像（投稿日は投稿IDから算出）
  const xWithTime = await Promise.all(
    xPhotosData.map(async (item) => {
      let postedDate = item.postedAt ? new Date(item.postedAt) : null;
      if (!postedDate || Number.isNaN(postedDate.getTime())) {
        const statusId = extractStatusId(item.postUrl);
        postedDate = statusId ? getTweetDateFromId(statusId) : null;
      }

      const ts =
        postedDate && Number.isFinite(postedDate.getTime())
          ? postedDate.getTime()
          : 0;

      return {
        src: item.imageUrl,
        isLocal: false,
        postUrl: item.postUrl,
        publishedDate: postedDate ? formatDate(postedDate) : null,
        _ts: ts,
      };
    })
  );

  // 3) 撮影日 / 投稿日の新しい順へ
  const allImages = [...localWithTime, ...xWithTime]
    .sort((a, b) => b._ts - a._ts)
    .map(stripTimestamp);

  return (
    <div>
      <PhotoGrid images={allImages} />
    </div>
  );
}
