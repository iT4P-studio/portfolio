import fs from "fs";
import path from "path";
import xPhotosData from "./xPhotosData"; // ↑で作成したファイルをimport
import PhotoGrid from "./PhotoGrid";

export default function PhotoPage() {
  // ① public/photos ディレクトリからローカル画像を取得
  const photosDir = path.join(process.cwd(), "public", "photos");
  const allFiles = fs.readdirSync(photosDir);
  // jpg/pngなどをフィルタ
  const imageFiles = allFiles.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  });
  // /photos/xxxx のパスとして取得
  const localImages = imageFiles.map((file) => ({
    src: `/photos/${file}`,
    isLocal: true,
  }));

  // ② xPhotosDataから取得したX画像一覧を、同じ形式に合わせる
  const xImages = xPhotosData.map((item) => ({
    src: item.imageUrl,  // 直リンク画像
    isLocal: false,      // ローカルでないとわかるフラグ
    postUrl: item.postUrl, // クリック時に飛びたいポストURL
  }));

  // ③ 2つのリストを合体
  // ここでは X画像を後ろに結合する例
  const allImages = [...localImages, ...xImages];

  return (
    <div>
      <PhotoGrid images={allImages} />
    </div>
  );
}
