import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "고양이 키우기 앱 - 나만의 다이아냥 키우기",
  description: "스케치 기반의 귀여운 기하학적 고양이 키우기 게임 (먹이주기, 놀아주기, 꾸미기, Supabase 클라우드 동기화)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
