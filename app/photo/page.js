// app/photo/page.js
import fs from "fs";
import path from "path";
import xPhotosData from "./xPhotosData";
import PhotoGrid from "./PhotoGrid";

export default function PhotoPage() {
  // 1) public/photos からローカル画像を取得し、作成日時(>変更日時)で新しい順に並べ替え
  const photosDir = path.join(process.cwd(), "public", "photos");
  const allFiles = fs.existsSync(photosDir) ? fs.readdirSync(photosDir) : [];

  const imageFiles = allFiles.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  });

  // birthtimeMs が無い環境もあるので ctimeMs / mtimeMs をフォールバック
  const localWithTime = imageFiles.map((file) => {
    const full = path.join(photosDir, file);
    const stat = fs.statSync(full);
    const ts =
      Number(stat.birthtimeMs) ||
      Number(stat.ctimeMs) ||
      Number(stat.mtimeMs) ||
      0;

    return {
      src: `/photos/${file}`,
      isLocal: true,
      _ts: ts,
    };
  });

  const stripTimestamp = (item) => {
    const base = { src: item.src, isLocal: item.isLocal };
    return item.postUrl ? { ...base, postUrl: item.postUrl } : base;
  };

  // 作成(更新)日時が新しい順へ
  const localSorted = localWithTime
    .sort((a, b) => b._ts - a._ts)
    .map(stripTimestamp);

  // 2) X画像（任意で postedAt があればそれも使って並べ替え可能）
  const xWithTime = xPhotosData.map((item) => ({
    src: item.imageUrl,
    isLocal: false,
    postUrl: item.postUrl,
    _ts: item.postedAt ? new Date(item.postedAt).getTime() : Number.NEGATIVE_INFINITY,
  }));

  // 3) 結合。postedAt が全件にあるならまとめて日付ソート、無ければ従来どおりローカル→Xの順
  let allImages = [];
  const canMergeByTime = xWithTime.every((x) => Number.isFinite(x._ts));

  if (canMergeByTime) {
    // ローカル側にも _ts を持たせて混ぜてソート
    const localWithTsAgain = localWithTime; // すでに _ts を保持済み
    allImages = [...localWithTsAgain, ...xWithTime]
      .sort((a, b) => b._ts - a._ts)
      .map(stripTimestamp);
  } else {
    // X 側の日時情報が無いので、ローカルだけ時系列、X は元の順で後ろに付与
    allImages = [
      ...localSorted,
      ...xWithTime.map(stripTimestamp),
    ];
  }

  return (
    <div>
      <PhotoGrid images={allImages} />
    </div>
  );
}
