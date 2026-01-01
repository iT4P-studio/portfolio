import React from "react";
import MovieClient from "./MovieClient";

export const metadata = {
  title: "Movie Works",
  description: "映像撮影・配信・編集の実績一覧。",
  alternates: {
    canonical: "/movie",
  },
  openGraph: {
    title: "Movie Works",
    description: "映像撮影・配信・編集の実績一覧。",
    url: "/movie",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "iT4P studio Movie Works",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Works",
    description: "映像撮影・配信・編集の実績一覧。",
    images: ["/og.jpg"],
  },
};

export default function MoviePage() {
  return <MovieClient />;
}
