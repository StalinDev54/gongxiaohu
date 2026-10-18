import React from 'react';
import { SlideItem } from '../data/gongxiaohuData';

interface SlideCanvasRendererProps {
  slide: SlideItem;
  zoom?: number;
  courseName: string;
  totalSlides: number;
}

export const SlideCanvasRenderer: React.FC<SlideCanvasRendererProps> = ({
  slide,
  zoom = 1,
  courseName,
  totalSlides,
}) => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-white border border-black/[0.06] shadow-2xs select-none">
      <div
        className="w-full transition-transform duration-150 origin-center p-4"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Top University Header */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-teal-700/40 bg-teal-50/70 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-teal-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 14c1.5-2 3-3 4-3s2.5 1 4 3" />
                <path d="M9 10h6M12 7v6" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-teal-900">
              湖南工学院 · {courseName}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            第 {slide.page} 页
          </span>
        </div>

        {/* Slide Title */}
        <h4 className="mt-2.5 text-sm font-bold text-slate-900 leading-snug">
          {slide.title}
        </h4>

        {/* Diagram Content */}
        {slide.diagramType === 'bgp_as' && (
          <div className="mt-2.5">
            <svg viewBox="0 0 520 185" className="w-full h-auto rounded-xl bg-slate-50/70 border border-slate-100 p-1.5">
              <path
                d="M55 110 C30 110, 20 85, 40 70 C35 45, 70 35, 95 48 C115 30, 155 38, 165 62 C190 68, 190 102, 168 110 Z"
                fill="#E2E8F0"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text x="105" y="30" textAnchor="middle" className="text-[12px] fill-slate-700 font-semibold">
                自治系统 A
              </text>
              <text x="102" y="75" textAnchor="middle" className="text-[11px] fill-indigo-950 font-medium">
                用内部网关协议
              </text>
              <text x="102" y="92" textAnchor="middle" className="text-[11px] fill-indigo-950 font-medium">
                （例如，RIP）
              </text>

              <path
                d="M350 110 C325 110, 315 85, 335 70 C330 45, 365 35, 390 48 C410 30, 450 38, 460 62 C485 68, 485 102, 463 110 Z"
                fill="#E2E8F0"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text x="400" y="30" textAnchor="middle" className="text-[12px] fill-slate-700 font-semibold">
                自治系统 B
              </text>
              <text x="398" y="75" textAnchor="middle" className="text-[11px] fill-indigo-950 font-medium">
                用内部网关协议
              </text>
              <text x="398" y="92" textAnchor="middle" className="text-[11px] fill-indigo-950 font-medium">
                （例如，OSPF）
              </text>

              <g transform="translate(162, 62)">
                <ellipse cx="22" cy="18" rx="20" ry="9" fill="#0284C7" />
                <rect x="2" y="8" width="40" height="10" fill="#0284C7" />
                <ellipse cx="22" cy="8" rx="20" ry="9" fill="#38BDF8" stroke="#0369A1" strokeWidth="1" />
                <path d="M14 6l16 4M30 6l-16 4" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="18" y="-6" textAnchor="middle" className="text-[12px] fill-slate-800 font-mono font-bold">
                  R1
                </text>
              </g>

              <g transform="translate(312, 62)">
                <ellipse cx="22" cy="18" rx="20" ry="9" fill="#0284C7" />
                <rect x="2" y="8" width="40" height="10" fill="#0284C7" />
                <ellipse cx="22" cy="8" rx="20" ry="9" fill="#38BDF8" stroke="#0369A1" strokeWidth="1" />
                <path d="M14 6l16 4M30 6l-16 4" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="26" y="-6" textAnchor="middle" className="text-[12px] fill-slate-800 font-mono font-bold">
                  R2
                </text>
              </g>

              <line x1="205" y1="74" x2="310" y2="74" stroke="#DC2626" strokeWidth="2.2" />
              <polygon points="205,74 214,69 214,79" fill="#DC2626" />
              <polygon points="310,74 301,69 301,79" fill="#DC2626" />
              <text x="258" y="52" textAnchor="middle" className="text-[11px] fill-slate-800 font-medium">
                用外部网关协议
              </text>
              <text x="258" y="67" textAnchor="middle" className="text-[11px] fill-slate-800 font-medium">
                （例如，BGP-4）
              </text>

              <rect x="75" y="122" width="370" height="54" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" rx="4" />
              <text x="88" y="142" className="text-[12px] fill-indigo-950 font-semibold">
                自治系统之间的路由选择也叫做
                <tspan fill="#B91C1C" fontWeight="bold"> 域间路由选择</tspan>
                (interdomain routing)，
              </text>
              <text x="88" y="162" className="text-[12px] fill-indigo-950 font-semibold">
                在自治系统内部的路由选择叫做
                <tspan fill="#B91C1C" fontWeight="bold"> 域内路由选择</tspan>
                (intradomain routing)
              </text>
            </svg>
          </div>
        )}

        {slide.diagramType === 'python_try' && (
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 items-center bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="space-y-1 text-xs">
              <div className="bg-[#1E3A8A] text-white px-2 py-0.5 rounded font-semibold text-[11px] w-fit">
                3.3.1 try语句
              </div>
              <pre className="font-mono text-[11px] bg-white p-2 rounded border border-slate-100 text-red-700 leading-relaxed">
{`try:
    语句块A
except:
    语句块B`}
              </pre>
            </div>
            <svg viewBox="0 0 220 155" className="w-full h-auto bg-white rounded-lg border border-slate-100 p-1">
              <polygon points="100,16 165,38 100,60 35,38" fill="#F8FAFC" stroke="#475569" strokeWidth="1.3" />
              <text x="100" y="42" textAnchor="middle" className="text-[10px] fill-slate-800 font-medium">
                A触发异常?
              </text>
              <line x1="100" y1="60" x2="100" y2="82" stroke="#475569" strokeWidth="1.3" />
              <rect x="82" y="82" width="36" height="22" fill="#F8FAFC" stroke="#475569" strokeWidth="1.3" />
              <text x="100" y="97" textAnchor="middle" className="text-[10px] fill-slate-800 font-semibold">B</text>
              <line x1="100" y1="104" x2="100" y2="120" stroke="#475569" strokeWidth="1.3" />
              <rect x="70" y="120" width="60" height="22" rx="10" fill="#F8FAFC" stroke="#475569" strokeWidth="1.3" />
              <text x="100" y="135" textAnchor="middle" className="text-[10px] fill-slate-800">结束</text>
              <polyline points="165,38 195,38 195,131 130,131" fill="none" stroke="#475569" strokeWidth="1.3" />
            </svg>
          </div>
        )}

        {slide.diagramType !== 'bgp_as' && slide.diagramType !== 'python_try' && (
          <div className="mt-2.5 rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1.5">
            {slide.bullets.map((b, idx) => (
              <div key={idx} className="text-xs text-slate-700 leading-relaxed">
                {b}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Page Number Indicator */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full bg-black/75 text-white font-mono text-[11px] tabular-nums">
          {slide.page} / {totalSlides}
        </span>
      </div>
    </div>
  );
};
