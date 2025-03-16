import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "邮件列表订阅 | 简单高效的邮件订阅服务",
  description: "一个简单高效的邮件列表订阅服务，帮助您轻松管理订阅者名单，发送邮件通知。",
  keywords: "邮件列表, 订阅服务, 邮件订阅, 邮件管理",
  authors: [{ name: "Email List Team" }],
  openGraph: {
    title: "邮件列表订阅 | 简单高效的邮件订阅服务",
    description: "一个简单高效的邮件列表订阅服务，帮助您轻松管理订阅者名单，发送邮件通知。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
