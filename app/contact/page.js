"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvgapaag"; // ← Formspree ID
const EMAILJS_SERVICE   = "service_m9l5wfd";
const EMAILJS_TEMPLATE  = "auto_reply";
const EMAILJS_PUBLICKEY = "D-fVqiL5jGJXfMtlI";

export default function ContactPage() {
  const [status, setStatus] = useState({ ok: false, error: false, sent: false });

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // ---------- ① Formspree へ送信（運営者宛） ----------
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    // ---------- ② EmailJS で自動返信 ----------
    if (res.ok) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE,
          EMAILJS_TEMPLATE,
          {
            name   : form.name.value,
            email  : form.email.value,
            message: form.message.value,
          },
          EMAILJS_PUBLICKEY
        );
        setStatus({ ok: true, sent: true });
        form.reset();
      } catch {
        setStatus({ error: true, sent: true });
      }
    } else {
      setStatus({ error: true, sent: true });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>

      {status.sent && status.ok && (
        <p className="mb-4 text-green-400">送信しました。ありがとうございました！</p>
      )}
      {status.sent && status.error && (
        <p className="mb-4 text-red-400">送信に失敗しました。時間をおいて再度お試しください。</p>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 text-white">
        {/* honeypot */}
        <input type="text" name="company" className="hidden" tabIndex="-1" autoComplete="off" />

        <div>
          <label className="block text-sm mb-1">お名前</label>
          <input name="name" required className="w-full bg-gray-800 border border-gray-600 p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm mb-1">メールアドレス</label>
          <input type="email" name="email" required className="w-full bg-gray-800 border border-gray-600 p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm mb-1">お問い合わせ内容</label>
          <textarea rows={6} name="message" required className="w-full bg-gray-800 border border-gray-600 p-2 rounded" />
        </div>

        <button className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200">送信</button>
      </form>
    </div>
  );
}
