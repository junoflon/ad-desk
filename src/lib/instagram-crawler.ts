/**
 * Instagram 프로필/게시물 크롤러 (Playwright)
 *
 * 공개 계정의 프로필 정보와 최근 게시물을 수집합니다.
 * 봇 감지 우회를 위해 stealth 설정을 적용합니다.
 *
 * 사용법:
 * - crawlInstagramProfile("oliveyoung_official") → 프로필 + 최근 게시물
 */

import { chromium, type Browser, type BrowserContext } from "playwright";

export interface InstagramProfile {
  handle: string;
  fullName: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  profilePicUrl: string;
  isPrivate: boolean;
}

export interface InstagramPostData {
  shortcode: string;
  caption: string;
  imageUrl: string;
  videoUrl?: string;
  contentType: "post" | "reels" | "carousel";
  likes: number;
  comments: number;
  postedAt: string | null;
}

export interface CrawlResult {
  profile: InstagramProfile;
  posts: InstagramPostData[];
  success: boolean;
  error?: string;
}

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });
  }
  return browser;
}

async function createStealthContext(b: Browser): Promise<BrowserContext> {
  const context = await b.newContext({
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    viewport: { width: 390, height: 844 },
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
  });

  // 봇 감지 우회
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  return context;
}

function parseCount(text: string): number {
  if (!text) return 0;
  const cleaned = text.replace(/,/g, "").trim();

  // 만 단위 (한국어)
  const manMatch = cleaned.match(/([\d.]+)\s*만/);
  if (manMatch) return Math.round(parseFloat(manMatch[1]) * 10000);

  // K/M 단위
  const kMatch = cleaned.match(/([\d.]+)\s*[Kk]/);
  if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1000);

  const mMatch = cleaned.match(/([\d.]+)\s*[Mm]/);
  if (mMatch) return Math.round(parseFloat(mMatch[1]) * 1000000);

  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

export async function crawlInstagramProfile(
  handle: string,
  maxPosts = 12
): Promise<CrawlResult> {
  const cleanHandle = handle.replace(/^@/, "").trim();
  const b = await getBrowser();
  const context = await createStealthContext(b);
  const page = await context.newPage();

  try {
    // Instagram 프로필 페이지 접근
    const url = `https://www.instagram.com/${cleanHandle}/`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // 로그인 팝업 닫기 (있을 경우)
    await page.waitForTimeout(2000);
    const loginModal = await page.$('button:has-text("Not Now"), button:has-text("나중에 하기")');
    if (loginModal) await loginModal.click();
    await page.waitForTimeout(1000);

    // 404 체크
    const pageContent = await page.content();
    if (
      pageContent.includes("Sorry, this page") ||
      pageContent.includes("이 페이지는 사용할 수 없습니다")
    ) {
      return {
        profile: emptyProfile(cleanHandle),
        posts: [],
        success: false,
        error: "계정을 찾을 수 없습니다.",
      };
    }

    // 프로필 정보 추출
    const profile = await page.evaluate((h: string) => {
      const getText = (selector: string) =>
        document.querySelector(selector)?.textContent?.trim() || "";

      // 메타 태그에서 기본 정보 추출
      const metaDesc =
        document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
      const titleEl = document.querySelector("title")?.textContent || "";

      // 팔로워/게시물 수는 메타 태그에서 추출 (예: "123 Followers, 456 Following, 78 Posts")
      const statsMatch = metaDesc.match(
        /([\d,.]+[KkMm만]*)\s*Followers?,\s*([\d,.]+[KkMm만]*)\s*Following,\s*([\d,.]+[KkMm만]*)\s*Posts?/i
      );

      // header section에서 stats 추출 시도
      const statElements = document.querySelectorAll("header li span, header ul li span");
      const stats: string[] = [];
      statElements.forEach((el) => {
        const t = el.getAttribute("title") || el.textContent || "";
        if (t) stats.push(t);
      });

      // fullName
      const nameEl =
        document.querySelector("header h1") ||
        document.querySelector("header h2") ||
        document.querySelector('span[class*="name"]');
      const fullName = nameEl?.textContent?.trim() || h;

      // bio
      const bioEl = document.querySelector("header div > span") || document.querySelector(".-vDIg span");
      const bio = bioEl?.textContent?.trim() || "";

      // profile pic
      const picEl = document.querySelector('header img[alt*="profile"], header img[alt*="사진"]') as HTMLImageElement;
      const profilePicUrl = picEl?.src || "";

      // private check
      const isPrivate =
        pageContent?.includes("This account is private") ||
        pageContent?.includes("비공개 계정입니다") ||
        false;

      return {
        handle: h,
        fullName,
        bio,
        followersRaw: statsMatch?.[1] || stats[0] || "0",
        followingRaw: statsMatch?.[2] || stats[1] || "0",
        postsRaw: statsMatch?.[3] || stats[2] || "0",
        profilePicUrl,
        isPrivate: !!isPrivate,
      };
    }, cleanHandle);

    const profileData: InstagramProfile = {
      handle: cleanHandle,
      fullName: profile.fullName,
      bio: profile.bio,
      followers: parseCount(profile.followersRaw),
      following: parseCount(profile.followingRaw),
      posts: parseCount(profile.postsRaw),
      profilePicUrl: profile.profilePicUrl,
      isPrivate: profile.isPrivate,
    };

    if (profile.isPrivate) {
      return {
        profile: profileData,
        posts: [],
        success: true,
        error: "비공개 계정입니다. 게시물을 수집할 수 없습니다.",
      };
    }

    // 게시물 목록 추출
    const posts = await page.evaluate((max: number) => {
      const results: {
        shortcode: string;
        imageUrl: string;
        caption: string;
        isVideo: boolean;
        isCarousel: boolean;
      }[] = [];

      // 게시물 링크들 수집
      const postLinks = document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]');
      postLinks.forEach((link) => {
        if (results.length >= max) return;

        const href = (link as HTMLAnchorElement).href;
        const shortcodeMatch = href.match(/\/(p|reel)\/([\w-]+)/);
        if (!shortcodeMatch) return;

        const shortcode = shortcodeMatch[2];
        if (results.some((r) => r.shortcode === shortcode)) return;

        const img = link.querySelector("img") as HTMLImageElement;
        const imageUrl = img?.src || "";
        const caption = img?.alt || "";
        const isVideo = href.includes("/reel/") || !!link.querySelector('[aria-label*="video"], [aria-label*="릴스"]');
        const isCarousel = !!link.querySelector('[aria-label*="carousel"], [aria-label*="슬라이드"]');

        results.push({ shortcode, imageUrl, caption, isVideo, isCarousel });
      });

      return results;
    }, maxPosts);

    const postData: InstagramPostData[] = posts.map((p) => ({
      shortcode: p.shortcode,
      caption: p.caption,
      imageUrl: p.imageUrl,
      contentType: p.isVideo ? "reels" : p.isCarousel ? "carousel" : "post",
      likes: 0, // 좋아요 수는 개별 게시물 페이지에서만 확인 가능
      comments: 0,
      postedAt: null,
    }));

    // 개별 게시물 좋아요/댓글 수집 (상위 6개만 — rate limit 방지)
    const detailLimit = Math.min(postData.length, 6);
    for (let i = 0; i < detailLimit; i++) {
      try {
        const postUrl = `https://www.instagram.com/p/${postData[i].shortcode}/`;
        await page.goto(postUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForTimeout(1500);

        const detail = await page.evaluate(() => {
          const content = document.body.textContent || "";

          // 좋아요 수 추출
          const likeEl = document.querySelector(
            'section span[class*="like"], a[href*="liked_by"] span, button[class*="like"] span'
          );
          const likeText = likeEl?.textContent || "";

          // 댓글 수 추출
          const commentEl = document.querySelector('a[href*="comments"] span');
          const commentText = commentEl?.textContent || "";

          // 날짜 추출
          const timeEl = document.querySelector("time");
          const postedAt = timeEl?.getAttribute("datetime") || null;

          return { likeText, commentText, postedAt };
        });

        postData[i].likes = parseCount(detail.likeText);
        postData[i].comments = parseCount(detail.commentText);
        postData[i].postedAt = detail.postedAt;
      } catch {
        // 개별 게시물 수집 실패는 무시
        console.warn(`[IG Crawler] Post detail failed: ${postData[i].shortcode}`);
      }
    }

    return {
      profile: profileData,
      posts: postData,
      success: true,
    };
  } catch (e) {
    console.error(`[IG Crawler] Error for @${cleanHandle}:`, e);
    return {
      profile: emptyProfile(cleanHandle),
      posts: [],
      success: false,
      error: e instanceof Error ? e.message : String(e),
    };
  } finally {
    await context.close();
  }
}

function emptyProfile(handle: string): InstagramProfile {
  return {
    handle,
    fullName: "",
    bio: "",
    followers: 0,
    following: 0,
    posts: 0,
    profilePicUrl: "",
    isPrivate: false,
  };
}

export async function closeInstagramBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
