import { NextRequest } from "next/server";
import { success } from "@/lib/api";
import { startCron, stopCron, getCronStatus, runCollection } from "@/lib/cron";

export async function GET() {
  return success(getCronStatus());
}

export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const action = searchParams.get("action");

  switch (action) {
    case "start":
      startCron();
      return success({ ...getCronStatus(), message: "크론 시작됨" });
    case "stop":
      stopCron();
      return success({ ...getCronStatus(), message: "크론 중지됨" });
    case "run":
      await runCollection();
      return success({ ...getCronStatus(), message: "수동 실행 완료" });
    default:
      return success({ message: "action: start | stop | run" });
  }
}
