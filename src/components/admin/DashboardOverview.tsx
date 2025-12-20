import { useState } from "react";
import type { AdminStats } from "../../utils";

interface DashboardOverviewProps {
  stats: AdminStats | null;
}

export default function DashboardOverview({ stats }: DashboardOverviewProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    date: string;
    count: number;
    color: string;
  } | null>(null);

  if (!stats) return null;

  // Simple SVG Line Chart helper
  const renderChart = (data: { _id: string; count: number }[], color: string) => {
    if (data.length === 0) return <div className="h-32 flex items-center justify-center text-gray-400">No data available</div>;

    const maxCount = Math.max(...data.map(d => d.count), 5);
    const width = 400;
    const height = 100;
    const padding = 10;
    
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * (width - 2 * padding) + padding;
      const y = height - ((d.count / maxCount) * (height - 2 * padding) + padding);
      return `${x},${y}`;
    }).join(" ");

    return (
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 overflow-visible">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="opacity-80"
          />
          {/* Dots with hover interaction */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1 || 1)) * (width - 2 * padding) + padding;
            const y = height - ((d.count / maxCount) * (height - 2 * padding) + padding);
            return (
              <g key={i} className="cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={color}
                  className="transition-all duration-200 hover:r-6"
                  onMouseEnter={() => setHoveredPoint({ x, y, date: d._id, count: d.count, color })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* Larger invisible hit area for easier hovering */}
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="transparent"
                  onMouseEnter={() => setHoveredPoint({ x, y, date: d._id, count: d.count, color })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>
        
        {/* Tooltip */}
        {hoveredPoint && (
          <div 
            className="absolute z-10 bg-gray-900 text-white text-xs rounded py-1 px-2 pointer-events-none shadow-lg transform -translate-x-1/2 -translate-y-full mb-2"
            style={{ 
              left: `${(hoveredPoint.x / width) * 100}%`, 
              top: `${(hoveredPoint.y / height) * 100}%`,
              borderColor: hoveredPoint.color,
              borderWidth: '1px'
            }}
          >
            <div className="font-bold">{hoveredPoint.count}</div>
            <div className="opacity-70">{hoveredPoint.date}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Users</h3>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.totalUsers}</p>
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Growth (Last 30 days)</p>
            {renderChart(stats.userGrowth, "#3b82f6")}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Posts</h3>
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.totalPosts}</p>
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Activity (Last 30 days)</p>
            {renderChart(stats.postGrowth, "#ef4444")}
          </div>
        </div>
      </div>

      {/* Recent Activity Section (Optional) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Dashboard Insights</h3>
        <p className="text-gray-600">
          The charts above show the growth of users and posts over the last 30 days. 
          The blue line represents new user registrations, while the red line represents new post activity.
          Hover over the points to see the exact count for each day.
        </p>
      </div>
    </div>
  );
}
