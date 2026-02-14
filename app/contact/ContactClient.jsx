"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLanguage } from "../components/LanguageProvider";

// Formspree のエンドポイント
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvgapaag";

const createVariants = (reduceMotion) => {
  const baseEase = [0.16, 1, 0.3, 1];
  return {
    container: {
      animate: {
        transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: reduceMotion ? 0 : 0.1 },
      },
    },
    title: {
      initial: { opacity: 0, y: reduceMotion ? 0 : 16 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0 : 0.6, ease: baseEase },
      },
    },
    rule: {
      initial: { scaleX: 0 },
      animate: {
        scaleX: 1,
        transition: { duration: reduceMotion ? 0 : 0.6, ease: baseEase, delay: reduceMotion ? 0 : 0.1 },
      },
    },
    panel: {
      initial: { opacity: 0, y: reduceMotion ? 0 : 20 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0 : 0.6, ease: baseEase },
      },
      exit: { opacity: 0, y: reduceMotion ? 0 : -16, transition: { duration: reduceMotion ? 0 : 0.3 } },
    },
  };
};

function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />
      <motion.div
        className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function ContactClient() {
  const reduceMotion = useReducedMotion();
  const variants = useMemo(() => createVariants(reduceMotion), [reduceMotion]);
  const { isEn } = useLanguage();
  // フォームプレビュー状態
  const [preview, setPreview] = useState(false);
  // 入力値を管理
  const [formValues, setFormValues] = useState({ name: "", email: "", message: "" });
  // 送信ステータス
  const [status, setStatus] = useState({ ok: false, error: false, sent: false });

  // 入力変更ハンドラ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  // 確認ボタン
  const handlePreview = (e) => {
    e.preventDefault();
    setPreview(true);
  };

  // 送信処理
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("email", formValues.email);
    formData.append("message", formValues.message);
    formData.append("company", ""); // honeypot

    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      setStatus({ ok: true, error: false, sent: true });
      setFormValues({ name: "", email: "", message: "" });
    } else {
      setStatus({ ok: false, error: true, sent: true });
    }
    setPreview(false);
  };

  // 戻る
  const handleBack = () => setPreview(false);

  return (
    <main className="relative min-h-[calc(100vh-60px)] bg-black text-white">
      <AmbientBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        <motion.div variants={variants.container} initial="initial" animate="animate" className="grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          <motion.div variants={variants.title} className="max-w-lg">
            <div className="flex items-center gap-4 text-gray-500">
              <span className="text-[11px] tracking-[0.45em]">CONTACT</span>
              <motion.span variants={variants.rule} className="h-px w-16 origin-left bg-white/40" />
            </div>
            <h1 className="mt-4 text-4xl font-semibold md:text-5xl">{isEn ? "Contact" : "お問い合わせ"}</h1>
            <p className="mt-4 text-sm text-gray-300 md:text-base">
              {isEn
                ? "For bookings, editing, and schedule inquiries, feel free to contact me."
                : "撮影や編集のご相談、スケジュールの確認など、お気軽にご連絡ください。"}
            </p>

            <AnimatePresence mode="wait">
              {status.sent && status.ok && (
                <motion.p
                  key="success"
                  variants={variants.panel}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="mt-6 text-sm text-emerald-300"
                >
                  {isEn ? "Sent successfully. Thank you!" : "送信しました。ありがとうございました！"}
                </motion.p>
              )}
              {status.sent && status.error && (
                <motion.p
                  key="error"
                  variants={variants.panel}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="mt-6 text-sm text-rose-300"
                >
                  {isEn ? "Failed to send. Please try again later." : "送信に失敗しました。時間をおいて再度お試しください。"}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={variants.panel} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div
                  key="preview"
                  variants={variants.panel}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-4 text-sm text-gray-100"
                >
                  <div className="text-xs tracking-[0.35em] text-gray-400">PREVIEW</div>
                  <h2 className="text-xl font-semibold text-white">{isEn ? "Review" : "内容確認"}</h2>
                  <div><span className="text-gray-400">{isEn ? "Name: " : "お名前："}</span>{formValues.name}</div>
                  <div><span className="text-gray-400">{isEn ? "Email: " : "メールアドレス："}</span>{formValues.email}</div>
                  <div className="text-gray-400">{isEn ? "Message:" : "お問い合わせ内容："}</div>
                  <p className="whitespace-pre-wrap text-gray-100">{formValues.message}</p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleBack}
                      className="rounded-full border border-white/20 px-5 py-2 text-sm text-white transition-colors hover:border-white/60 hover:bg-white/10"
                    >
                      {isEn ? "Back" : "戻る"}
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="rounded-full bg-white px-5 py-2 text-sm text-black transition-colors hover:bg-gray-200"
                      disabled={status.sent && status.ok}
                    >
                      {isEn ? "Send" : "送信"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  variants={variants.panel}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-4 text-sm text-white"
                >
                  <div className="text-xs tracking-[0.35em] text-gray-400">FORM</div>
                  {/* honeypot */}
                  <input type="text" name="company" className="hidden" tabIndex="-1" autoComplete="off" />

                  <label className="block">
                    <span className="mb-2 block text-xs tracking-[0.25em] text-gray-400">{isEn ? "NAME" : "お名前"}</span>
                    <input
                      name="name"
                      value={formValues.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-white outline-none transition-colors focus:border-white/60 focus:ring-1 focus:ring-white/30"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs tracking-[0.25em] text-gray-400">{isEn ? "EMAIL" : "メールアドレス"}</span>
                    <input
                      type="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-white outline-none transition-colors focus:border-white/60 focus:ring-1 focus:ring-white/30"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs tracking-[0.25em] text-gray-400">{isEn ? "MESSAGE" : "お問い合わせ内容"}</span>
                    <textarea
                      rows={6}
                      name="message"
                      value={formValues.message}
                      onChange={handleChange}
                      required
                      className="w-full resize-none rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-white outline-none transition-colors focus:border-white/60 focus:ring-1 focus:ring-white/30"
                    />
                  </label>

                  <button
                    onClick={handlePreview}
                    className="rounded-full border border-white/30 px-5 py-2 text-sm text-white transition-colors hover:border-white hover:bg-white/10"
                    disabled={status.sent && status.ok}
                  >
                    {isEn ? "Preview" : "内容確認"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
