/**
 * Slack / Discord 웹훅 알림
 *
 * .env 설정:
 *   SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
 *   DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
 *
 * 둘 다 설정하면 둘 다 전송. 둘 다 없으면 콘솔 로그만.
 */

interface NotifyOptions {
  title: string;
  message: string;
  fields?: { name: string; value: string }[];
  color?: string; // hex color
}

async function sendSlack(webhookUrl: string, opts: NotifyOptions) {
  const payload = {
    attachments: [
      {
        color: opts.color || "#3B82F6",
        blocks: [
          {
            type: "header",
            text: { type: "plain_text", text: opts.title },
          },
          {
            type: "section",
            text: { type: "mrkdwn", text: opts.message },
          },
          ...(opts.fields
            ? [
                {
                  type: "section",
                  fields: opts.fields.map((f) => ({
                    type: "mrkdwn",
                    text: `*${f.name}*\n${f.value}`,
                  })),
                },
              ]
            : []),
        ],
      },
    ],
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function sendDiscord(webhookUrl: string, opts: NotifyOptions) {
  const embed = {
    title: opts.title,
    description: opts.message,
    color: parseInt((opts.color || "#3B82F6").replace("#", ""), 16),
    fields: opts.fields?.map((f) => ({
      name: f.name,
      value: f.value,
      inline: true,
    })),
    timestamp: new Date().toISOString(),
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });
}

export async function notify(opts: NotifyOptions) {
  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  const discordUrl = process.env.DISCORD_WEBHOOK_URL;

  const promises: Promise<void>[] = [];

  if (slackUrl) promises.push(sendSlack(slackUrl, opts).catch(console.error));
  if (discordUrl) promises.push(sendDiscord(discordUrl, opts).catch(console.error));

  if (promises.length === 0) {
    console.log(`[알림] ${opts.title}: ${opts.message}`);
    return;
  }

  await Promise.allSettled(promises);
}

/**
 * 수집 완료 알림
 */
export async function notifyCollectionComplete(results: { brand: string; newAds: number }[]) {
  const totalNew = results.reduce((sum, r) => sum + r.newAds, 0);

  if (totalNew === 0) return; // 신규 광고 없으면 알림 안 보냄

  const brandSummary = results
    .filter((r) => r.newAds > 0)
    .map((r) => `${r.brand}: +${r.newAds}건`)
    .join("\n");

  await notify({
    title: "🔍 신규 광고 감지",
    message: `총 ${totalNew}건의 새로운 광고가 수집되었습니다.`,
    fields: [
      { name: "브랜드별", value: brandSummary || "없음" },
      { name: "시각", value: new Date().toLocaleString("ko-KR") },
    ],
    color: "#10B981",
  });
}
