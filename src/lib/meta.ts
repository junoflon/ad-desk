/**
 * Meta Ad Library API 클라이언트
 *
 * Meta Ad Library API 사용법:
 * 1. https://developers.facebook.com 에서 앱 생성
 * 2. Marketing API 접근 권한 요청
 * 3. Ad Library API 액세스 토큰 발급
 * 4. .env에 META_AD_LIBRARY_TOKEN 설정
 *
 * API 문서: https://www.facebook.com/ads/library/api
 */

const META_API_BASE = "https://graph.facebook.com/v21.0";

export interface MetaAdResult {
  id: string;
  ad_creation_time?: string;
  ad_creative_bodies?: string[];
  ad_creative_link_captions?: string[];
  ad_creative_link_titles?: string[];
  ad_delivery_start_time?: string;
  ad_delivery_stop_time?: string;
  ad_snapshot_url?: string;
  bylines?: string;
  currency?: string;
  impressions?: { lower_bound: string; upper_bound: string };
  languages?: string[];
  page_id?: string;
  page_name?: string;
  publisher_platforms?: string[];
  spend?: { lower_bound: string; upper_bound: string };
}

export interface MetaSearchParams {
  searchTerms?: string;
  pageId?: string;
  country?: string;
  adType?: "ALL" | "POLITICAL_AND_ISSUE_ADS" | "CREDIT_ADS" | "EMPLOYMENT_ADS" | "HOUSING_ADS";
  adReachedCountries?: string[];
  limit?: number;
}

interface MetaApiResponse {
  data: MetaAdResult[];
  paging?: {
    cursors?: { after: string };
    next?: string;
  };
}

export async function searchMetaAds(params: MetaSearchParams): Promise<MetaAdResult[]> {
  const token = process.env.META_AD_LIBRARY_TOKEN;
  if (!token) {
    throw new Error("META_AD_LIBRARY_TOKEN이 설정되지 않았습니다.");
  }

  const queryParams = new URLSearchParams({
    access_token: token,
    ad_reached_countries: JSON.stringify(params.adReachedCountries || ["KR"]),
    ad_type: params.adType || "ALL",
    fields: [
      "id",
      "ad_creation_time",
      "ad_creative_bodies",
      "ad_creative_link_captions",
      "ad_creative_link_titles",
      "ad_delivery_start_time",
      "ad_delivery_stop_time",
      "ad_snapshot_url",
      "bylines",
      "page_id",
      "page_name",
      "publisher_platforms",
    ].join(","),
    limit: String(params.limit || 25),
  });

  if (params.searchTerms) {
    queryParams.set("search_terms", params.searchTerms);
  }
  if (params.pageId) {
    queryParams.set("search_page_ids", params.pageId);
  }

  const url = `${META_API_BASE}/ads_archive?${queryParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Meta API error (${response.status}): ${err}`);
  }

  const data: MetaApiResponse = await response.json();
  return data.data || [];
}

/**
 * Meta API 결과를 DB Ad 형식으로 변환
 */
export function metaAdToDbFormat(metaAd: MetaAdResult) {
  const platforms = metaAd.publisher_platforms || [];
  const platform = platforms.includes("instagram")
    ? "instagram"
    : platforms.includes("facebook")
      ? "facebook"
      : "meta";

  const copyText = [
    ...(metaAd.ad_creative_bodies || []),
    ...(metaAd.ad_creative_link_titles || []),
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    platform,
    brand: metaAd.page_name || "Unknown",
    imageUrl: metaAd.ad_snapshot_url || "/images/placeholder-ad.svg",
    copyText: copyText || null,
    format: "이미지", // Meta API doesn't reliably return format
    startDate: metaAd.ad_delivery_start_time
      ? new Date(metaAd.ad_delivery_start_time)
      : null,
    endDate: metaAd.ad_delivery_stop_time
      ? new Date(metaAd.ad_delivery_stop_time)
      : null,
    isActive: !metaAd.ad_delivery_stop_time,
    country: "KR",
  };
}
