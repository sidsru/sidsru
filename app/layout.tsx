import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "게임 클라이언트 개발자 포트폴리오 | Unreal Engine Specialist",
  description:
    "언리얼 엔진 기반 게임 클라이언트 개발자 포트폴리오. Motion Matching, GAS, Optimization 전문.",
  keywords: [
    "Unreal Engine",
    "게임 개발자",
    "클라이언트 개발자",
    "C++",
    "GAS",
    "Motion Matching",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}