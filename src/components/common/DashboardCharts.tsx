"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
];

interface ChartItem {
  name: string;
  value: number;
}

interface DailyItem {
  date: string;
  count: number;
}

interface StatsData {
  byCategory: ChartItem[];
  byPlatform: ChartItem[];
  byFormat: ChartItem[];
  status: { active: number; inactive: number };
  daily: DailyItem[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-border rounded-lg px-3 py-2 text-xs">
      <p className="text-text-primary">{label}: <span className="font-medium">{payload[0].value}</span></p>
    </div>
  );
};

export default function DashboardCharts({ data }: { data: StatsData }) {
  const statusData = [
    { name: "게재중", value: data.status.active },
    { name: "종료", value: data.status.inactive },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 일별 수집 트렌드 */}
      <div className="bg-bg-card border border-border rounded-xl p-4">
        <h3 className="text-text-secondary text-xs font-medium mb-3">최근 7일 수집</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data.daily}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "#5E5E76", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 업종별 분포 */}
      <div className="bg-bg-card border border-border rounded-xl p-4">
        <h3 className="text-text-secondary text-xs font-medium mb-3">업종별 분포</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data.byCategory.slice(0, 6)} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#A1A1B5", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
              {data.byCategory.slice(0, 6).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 플랫폼 비율 */}
      <div className="bg-bg-card border border-border rounded-xl p-4">
        <h3 className="text-text-secondary text-xs font-medium mb-3">플랫폼</h3>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={data.byPlatform}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                strokeWidth={0}
              >
                {data.byPlatform.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2">
            {data.byPlatform.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-text-secondary">{item.name}</span>
                <span className="text-text-muted">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 게재 상태 */}
      <div className="bg-bg-card border border-border rounded-xl p-4">
        <h3 className="text-text-secondary text-xs font-medium mb-3">게재 상태</h3>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                strokeWidth={0}
              >
                <Cell fill="#10B981" />
                <Cell fill="#6B7280" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-text-secondary">게재중</span>
              <span className="text-text-muted">{data.status.active}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
              <span className="text-text-secondary">종료</span>
              <span className="text-text-muted">{data.status.inactive}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
