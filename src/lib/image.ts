/**
 * 이미지 분석 유틸리티 (Sharp)
 *
 * 광고 이미지의 메타데이터, 주요 색상, 썸네일을 처리합니다.
 */

import sharp from "sharp";

export interface ImageAnalysis {
  width: number;
  height: number;
  format: string;
  aspectRatio: string;
  dominantColor: { r: number; g: number; b: number; hex: string };
  fileSize: number;
}

/**
 * URL에서 이미지를 다운로드하여 분석
 */
export async function analyzeImageFromUrl(url: string): Promise<ImageAnalysis | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    return analyzeImage(buffer);
  } catch {
    return null;
  }
}

/**
 * 이미지 버퍼를 분석
 */
export async function analyzeImage(buffer: Buffer): Promise<ImageAnalysis> {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const stats = await image.stats();

  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // 주요 색상 추출 (각 채널의 평균)
  const r = Math.round(stats.channels[0]?.mean || 0);
  const g = Math.round(stats.channels[1]?.mean || 0);
  const b = Math.round(stats.channels[2]?.mean || 0);
  const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  // 비율 계산
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height) || 1;
  const aspectRatio = `${width / divisor}:${height / divisor}`;

  return {
    width,
    height,
    format: metadata.format || "unknown",
    aspectRatio,
    dominantColor: { r, g, b, hex },
    fileSize: buffer.length,
  };
}

/**
 * 썸네일 생성
 */
export async function generateThumbnail(
  buffer: Buffer,
  width = 300
): Promise<Buffer> {
  return sharp(buffer)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

/**
 * 색상 유사도 계산 (0~1, 1이 동일)
 */
export function colorSimilarity(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number }
): number {
  const dist = Math.sqrt(
    (c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2
  );
  return 1 - dist / 441.67; // max distance = sqrt(255^2 * 3)
}
