import React from "react";
import AboutClient from "./AboutClient";

export const metadata = {
  title: "About",
  description: "iT4P studioの経歴・撮影歴・所有機材・Linksをまとめたページです。",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About",
    description: "iT4P studioの経歴・撮影歴・所有機材・Linksをまとめたページです。",
    url: "/about",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "iT4P studio About",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About",
    description: "iT4P studioの経歴・撮影歴・所有機材・Linksをまとめたページです。",
    images: ["/og.jpg"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
