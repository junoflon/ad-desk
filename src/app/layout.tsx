import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "스니핏 - 찾고싶을 때 찾아지는 광고 레퍼런스",
  description:
    "마케터를 위한 AI 기반 광고 레퍼런스 검색, 경쟁사 모니터링, 보드 큐레이션 플랫폼",
  keywords: ["광고 레퍼런스", "마케팅", "경쟁사 분석", "광고 검색", "SNS 광고"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
