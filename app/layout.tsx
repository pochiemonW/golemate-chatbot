import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "あなたと一緒に目標を立ててくれるチャットボット（仮）",
  description: "目標設定〜Todo化まで並走するチャットボット",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}


