import Z9Visualizer from "./Z9Visualizer";

export const metadata = {
  title: "Z9 Settings Visualizer",
  description: "Nikon Z9の設定ファイルから、iメニューとカスタムボタン設定を可視化。",
  alternates: {
    canonical: "/z9",
  },
  openGraph: {
    title: "Z9 Settings Visualizer",
    description: "Nikon Z9の設定ファイルから、iメニューとカスタムボタン設定を可視化。",
    url: "/z9",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Z9 Settings Visualizer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Z9 Settings Visualizer",
    description: "Nikon Z9の設定ファイルから、iメニューとカスタムボタン設定を可視化。",
    images: ["/og.jpg"],
  },
};

export default function Z9Page() {
  return <Z9Visualizer />;
}
