// app/photo/page.js

"use client"
import React, { useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatusMsg('') // メッセージリセット

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (res.ok) {
        // 成功
        setStatusMsg('お問い合わせを送信しました。ありがとうございます！')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        // 失敗
        setStatusMsg('メール送信に失敗しました。時間をおいて再度お試しください。')
      }
    } catch (error) {
      console.error(error)
      setStatusMsg('エラーが発生しました。再度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <p className="mb-6">お問い合わせは以下のフォームよりご連絡ください。</p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        {/* 名前 */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-100">
            お名前
          </label>
          <input
            type="text"
            className="w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2"
            placeholder="山田太郎"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* メールアドレス */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-100">
            メールアドレス
          </label>
          <input
            type="email"
            className="w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* お問い合わせ内容 */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-100">
            お問い合わせ内容
          </label>
          <textarea
            rows={5}
            className="w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2"
            placeholder="お問い合わせの内容を記入してください"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
          disabled={loading}
        >
          {loading ? '送信中...' : '送信'}
        </button>
      </form>

      {/* ステータスメッセージ */}
      {statusMsg && (
        <div className="mt-4 text-white">
          {statusMsg}
        </div>
      )}
    </div>
  )
}
