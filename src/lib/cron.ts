/**
 * 크론 스케줄러
 * 모니터링 브랜드 광고를 주기적으로 수집합니다.
 *
 * 사용법:
 * - GET /api/cron/status : 크론 상태 확인
 * - POST /api/cron/start : 크론 시작 (6시간마다 수집)
 * - POST /api/cron/stop  : 크론 중지
 * - POST /api/cron/run   : 수동 즉시 실행
 *
 * 외부 크론 서비스 (Railway cron, Vercel cron, cron-job.org 등)를 사용할 경우
 * POST /api/collect/monitor 를 직접 호출하면 됩니다.
 */

import cron, { type ScheduledTask } from "node-cron";
import { notifyCollectionComplete } from "@/lib/notify";

let task: ScheduledTask | null = null;
let lastRun: Date | null = null;
let lastResult: string | null = null;

const SCHEDULE = "0 */6 * * *"; // 6시간마다

async function runCollection() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 1) 기존 Meta 광고 수집
    const res = await fetch(`${baseUrl}/api/collect/monitor`, {
      method: "POST",
    });
    const data = await res.json();

    // 2) Instagram 게시물 수집
    let igResult = { success: false, data: null as { message?: string } | null };
    try {
      const igRes = await fetch(`${baseUrl}/api/instagram/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      igResult = await igRes.json();
    } catch (igErr) {
      console.error(`[CRON] Instagram 수집 실패:`, igErr);
    }

    lastRun = new Date();
    lastResult = [
      data.success ? `광고: ${data.data?.message}` : `광고 실패: ${data.error}`,
      igResult.success ? `인스타: ${igResult.data?.message}` : "인스타: 스킵/실패",
    ].join(" | ");
    console.log(`[CRON] ${lastResult}`);

    // 알림 전송
    if (data.success && data.data?.results) {
      await notifyCollectionComplete(data.data.results);
    }
  } catch (e) {
    lastRun = new Date();
    lastResult = `에러: ${e instanceof Error ? e.message : e}`;
    console.error(`[CRON] ${lastResult}`);
  }
}

export function startCron(): boolean {
  if (task) return false;
  task = cron.schedule(SCHEDULE, runCollection);
  console.log(`[CRON] 스케줄러 시작 (${SCHEDULE})`);
  return true;
}

export function stopCron(): boolean {
  if (!task) return false;
  task.stop();
  task = null;
  console.log("[CRON] 스케줄러 중지");
  return true;
}

export function getCronStatus() {
  return {
    running: !!task,
    schedule: SCHEDULE,
    lastRun: lastRun?.toISOString() || null,
    lastResult,
  };
}

export { runCollection };
