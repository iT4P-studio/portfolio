export const metadata = {
  title: "Apps",
  description: "iT4P studioのツール一覧ページ。",
  alternates: {
    canonical: "/apps",
  },
  openGraph: {
    title: "Apps",
    description: "iT4P studioのツール一覧ページ。",
    url: "/apps",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "iT4P studio Apps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apps",
    description: "iT4P studioのツール一覧ページ。",
    images: ["/og.jpg"],
  },
};

const apps = [
  {
    name: "Z9 Settings Visualizer",
    description: "Z9の設定ファイルを読み込み、iメニューやカスタムボタンを可視化。",
    href: "/z9",
  },
];

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Apps</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">ツール一覧</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-300">
            このサイトで利用できるWebアプリを一覧で掲載しています。
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {apps.map((app) => (
            <a
              key={app.href}
              href={app.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30 hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{app.name}</h2>
                <span className="text-xs text-gray-500 transition group-hover:text-gray-300">Open →</span>
              </div>
              <p className="mt-3 text-sm text-gray-300">{app.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
