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

let task: ScheduledTask | null = null;
let lastRun: Date | null = null;
let lastResult: string | null = null;

const SCHEDULE = "0 */6 * * *"; // 6시간마다

async function runCollection() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/collect/monitor`, {
      method: "POST",
    });
    const data = await res.json();
    lastRun = new Date();
    lastResult = data.success
      ? `성공: ${data.data?.message}`
      : `실패: ${data.error}`;
    console.log(`[CRON] ${lastResult}`);
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
