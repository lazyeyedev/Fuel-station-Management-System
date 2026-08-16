import type { ReactNode } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import GlassPanel from "./GlassPanel";

interface ChartPanelProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const data = [
  { day: "Mon", sales: 3200 },
  { day: "Tue", sales: 4100 },
  { day: "Wed", sales: 3900 },
  { day: "Thu", sales: 5200 },
  { day: "Fri", sales: 6100 },
  { day: "Sat", sales: 7400 },
  { day: "Sun", sales: 6900 },
];

export default function ChartPanel({
  title,
  description,
  action,
  className = "",
}: ChartPanelProps) {
  return (
    <GlassPanel className={`p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-xs text-text-secondary">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      <div className="mt-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2A2F38"
            />

            <XAxis
              dataKey="day"
              stroke="#9CA3AF"
            />

            <YAxis stroke="#9CA3AF" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#39D353"
              fill="#39D353"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}