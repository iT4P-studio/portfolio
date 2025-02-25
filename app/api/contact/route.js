// app/api/contact/route.js
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request) {
  try {
    const { name, email, message } = await request.json()

    // 必要な環境変数を読み込み
    const {
      MAIL_HOST,
      MAIL_PORT,
      MAIL_USER,
      MAIL_PASS,
      ADMIN_EMAIL,
    } = process.env

    // 送信者情報をもとに SMTP 接続用のトランスポーター作成
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: Number(MAIL_PORT),
      secure: false, // 587 ポートの場合は false
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    })

    // 1通目: 管理者宛
    await transporter.sendMail({
      from: `"Portfolio Contact" <${MAIL_USER}>`, // 送信元
      to: ADMIN_EMAIL, // 管理者メール
      subject: '新しいお問い合わせが届きました',
      text: `
        名前: ${name}
        メールアドレス: ${email}
        お問い合わせ内容:
        ${message}
      `,
      // HTML形式にしたい場合は html: "...", を使います
    })

    // 2通目: ユーザー宛
    await transporter.sendMail({
      from: `"Portfolio Contact" <${MAIL_USER}>`,
      to: email, // フォームから取得したユーザーのメールアドレス
      subject: 'お問い合わせありがとうございます',
      text: `
        こんにちは、${name} 様。

        お問い合わせを受け付けました。
        担当者より折り返しご連絡いたします。

        ----
        お問い合わせ内容:
        ${message}
      `,
    })

    return NextResponse.json({ message: 'Mail sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error sending mail:', error)
    return NextResponse.json({ message: 'Failed to send mail' }, { status: 500 })
  }
}
