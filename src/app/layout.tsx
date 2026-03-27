import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ad Desk - 광고 소재 관리 시스템",
  description: "인하우스 광고 소재 검색, 경쟁사 모니터링, 레퍼런스 관리 도구",
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
