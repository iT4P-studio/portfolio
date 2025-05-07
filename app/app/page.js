// app/app/page.js
import React from 'react';
import Link from 'next/link';

const apps = [
  {
    slug: 'track-and-best',
    title: 'Track & Best',
    description: '走行ログを記録し、ベストタイムを一覧できるアプリです。',
  },
  {
    slug: 'rcz-analyzer',
    title: 'rcz Analyzer',
    description: 'RCZフォーマットのデータを解析し、可視化するツールです。',
  },
];

export default function AppListPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <Link
            key={app.slug}
            href={`/app/${app.slug}`}
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            <h2 className="text-xl font-semibold mb-2">{app.title}</h2>
            <p className="text-gray-300">{app.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
