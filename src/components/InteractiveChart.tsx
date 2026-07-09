/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

export const InteractiveChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
  const { lang, isRtl } = useApp();

  const maxVal = 100;
  const chartHeight = 220;
  const paddingLeft = isRtl ? 10 : 50;
  const paddingRight = isRtl ? 50 : 10;
  const paddingTop = 20;
  const paddingBottom = 40;
  const chartWidth = 500;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  return (
    <div className="w-full overflow-x-auto select-none" id="assessment-chart-container">
      <div className="min-w-[450px]">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto font-sans overflow-visible text-slate-400"
          id="assessment-chart-svg"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((tick, idx) => {
            const y = paddingTop + graphHeight - (tick / maxVal) * graphHeight;
            return (
              <g key={tick} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#475569"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={isRtl ? chartWidth - 10 : 35}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* Bar Chart rendering */}
          {data.map((item, idx) => {
            const barWidth = graphWidth / data.length - 20;
            const barHeight = (item.value / maxVal) * graphHeight;
            const x =
              paddingLeft +
              idx * (graphWidth / data.length) +
              (graphWidth / data.length - barWidth) / 2;
            const y = paddingTop + graphHeight - barHeight;

            return (
              <g key={item.label} className="group cursor-pointer">
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={item.color} stopOpacity="1" />
                    <stop offset="100%" stopColor={item.color} stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Animated bar background track */}
                <rect
                  x={x}
                  y={paddingTop}
                  width={barWidth}
                  height={graphHeight}
                  fill="#334155"
                  fillOpacity="0.1"
                  rx="6"
                />

                {/* Main value bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 4)}
                  fill={`url(#grad-${idx})`}
                  rx="6"
                  className="transition-all duration-700 ease-out hover:fill-opacity-90"
                />

                {/* Value text above bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="text-xs font-bold fill-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  {Math.round(item.value)}%
                </text>

                {/* Label below bar */}
                <text
                  x={x + barWidth / 2}
                  y={paddingTop + graphHeight + 18}
                  textAnchor="middle"
                  className="text-[10px] md:text-xs fill-slate-400 font-medium"
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          {/* Axis Line */}
          <line
            x1={paddingLeft}
            y1={paddingTop + graphHeight}
            x2={chartWidth - paddingRight}
            y2={paddingTop + graphHeight}
            stroke="#64748b"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
};
