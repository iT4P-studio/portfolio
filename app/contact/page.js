import React from "react";
import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact",
  description: "撮影や映像制作のご相談・お問い合わせはこちらから。",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact",
    description: "撮影や映像制作のご相談・お問い合わせはこちらから。",
    url: "/contact",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "iT4P studio Contact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    description: "撮影や映像制作のご相談・お問い合わせはこちらから。",
    images: ["/og.jpg"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
