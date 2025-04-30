"use client";

import React, { useState } from "react";

// Formspree のエンドポイント
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvgapaag";

export default function ContactPage() {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>

      {/* ステータスメッセージ */}
      {status.sent && status.ok && (
        <p className="mb-4 text-green-400">送信しました。ありがとうございました！</p>
      )}
      {status.sent && status.error && (
        <p className="mb-4 text-red-400">送信に失敗しました。時間をおいて再度お試しください。</p>
      )}

      {/* プレビュー表示 */}
      {preview ? (
        <div className="max-w-md mx-auto bg-gray-900 p-6 rounded text-white space-y-4">
          <h2 className="text-xl font-semibold">内容確認</h2>
          <div><strong>お名前:</strong> {formValues.name}</div>
          <div><strong>メールアドレス:</strong> {formValues.email}</div>
          <div><strong>お問い合わせ内容:</strong></div>
          <p className="whitespace-pre-wrap">{formValues.message}</p>
          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >戻る</button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
              disabled={status.sent && status.ok}
            >送信</button>
          </div>
        </div>
      ) : (
        <form className="max-w-md mx-auto space-y-4 text-white">
          {/* honeypot */}
          <input type="text" name="company" className="hidden" tabIndex="-1" autoComplete="off" />

          <div>
            <label className="block text-sm mb-1">お名前</label>
            <input
              name="name"
              value={formValues.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-600 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">メールアドレス</label>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-600 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">お問い合わせ内容</label>
            <textarea
              rows={6}
              name="message"
              value={formValues.message}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-600 p-2 rounded"
            />
          </div>

          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
            disabled={status.sent && status.ok}
          >内容確認</button>
        </form>
      )}
    </div>
  );
}
