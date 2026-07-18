"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

export default function EvolutionChart({
  data,
  height = 240,
  color = "#14b8c4",
  seuil,
}: {
  data: { label: string; score: number }[];
  height?: number;
  color?: string;
  seuil?: number;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 13, fill: "#64748b", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={(v) => `${v}%`}
          />
          {seuil !== undefined && (
            <ReferenceLine
              y={seuil}
              stroke="#f59e0b"
              strokeDasharray="5 4"
              label={{ value: `Seuil ${seuil}%`, position: "insideTopRight", fontSize: 11, fill: "#f59e0b" }}
            />
          )}
          <Tooltip
            formatter={(v) => [`${v ?? 0}%`, "Conformité"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke={color}
            strokeWidth={3}
            fill="url(#grad)"
            dot={{ r: 4, fill: color }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
