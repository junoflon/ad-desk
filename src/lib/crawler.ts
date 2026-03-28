/**
 * Meta Ad Library 웹 크롤러 (Playwright)
 *
 * Meta API 토큰이 없을 때 폴백으로 사용합니다.
 * Facebook Ad Library 웹사이트에서 직접 광고를 수집합니다.
 *
 * 사용법:
 * 1. npx playwright install chromium (최초 1회)
 * 2. POST /api/collect/crawl { searchTerms: "올리브영", country: "KR" }
 */

import { chromium, type Browser } from "playwright";

export interface CrawledAd {
  pageTitle: string;
  adText: string;
  platform: string;
  startDate?: string;
  snapshotUrl?: string;
  isActive: boolean;
}

let browser: Browser | null = null;

async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

export async function crawlMetaAdLibrary(
  searchTerms: string,
  country = "KR",
  limit = 20
): Promise<CrawledAd[]> {
  const b = await getBrowser();
  const context = await b.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    const url = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}&q=${encodeURIComponent(searchTerms)}&media_type=all`;

    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // 광고 카드 대기
    await page.waitForSelector('[class*="ad"]', { timeout: 10000 }).catch(() => null);

    // 스크롤하여 더 많은 결과 로드
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(1500);
    }

    // 광고 데이터 추출
    const ads = await page.evaluate((maxAds: number) => {
      const results: {
        pageTitle: string;
        adText: string;
        platform: string;
        startDate?: string;
        isActive: boolean;
      }[] = [];

      // Meta Ad Library의 광고 카드 셀렉터 (구조가 변경될 수 있음)
      const cards = document.querySelectorAll('[role="article"], [class*="LibraryUnit"]');

      cards.forEach((card) => {
        if (results.length >= maxAds) return;

        const titleEl = card.querySelector('[class*="page_name"], strong, h4');
        const textEl = card.querySelector('[class*="body"], [class*="text"] > span');
        const dateEl = card.querySelector('[class*="started"], [class*="date"]');

        if (titleEl || textEl) {
          results.push({
            pageTitle: titleEl?.textContent?.trim() || "Unknown",
            adText: textEl?.textContent?.trim() || "",
            platform: "meta",
            startDate: dateEl?.textContent?.trim(),
            isActive: true,
          });
        }
      });

      return results;
    }, limit);

    return ads.map((ad) => ({ ...ad, snapshotUrl: undefined }));
  } catch (e) {
    console.error("[Crawler] Error:", e);
    return [];
  } finally {
    await context.close();
  }
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
