import React, { useState } from 'react';
import {
  Bell,
  Layers,
  Check,
  Wifi,
  PictureInPicture2,
  Smartphone,
  Clock,
  ChevronRight,
  Calendar,
  Sliders,
  MapPin
} from 'lucide-react';
import {
  COMPUTER_NETWORK_SLIDES,
  COURSE_SCHEDULE
} from '../data/gongxiaohuData';
import { SlideCanvasRenderer } from './SlideCanvasRenderer';

export const AndroidClient: React.FC = () => {
  const [androidTab, setAndroidTab] = useState<'home' | 'classroom' | 'schedule' | 'settings'>('home');
  const [notifQuickAnswer, setNotifQuickAnswer] = useState<string | null>('C');
  const [slideIdx, setSlideIdx] = useState(2); // Page 147
  const [autoSignEnabled, setAutoSignEnabled] = useState(true);
  const [pipEnabled, setPipEnabled] = useState(true);
  const [makeupEnabled, setMakeupEnabled] = useState(true);
  const [androidToast, setAndroidToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setAndroidToast(msg);
    setTimeout(() => setAndroidToast(null), 2500);
  };

  const currentSlide = COMPUTER_NETWORK_SLIDES[slideIdx] || COMPUTER_NETWORK_SLIDES[2];

  return (
    <div className="w-full max-w-[392px] mx-auto bg-[#F7F8FA] text-slate-900 rounded-[42px] border-[8px] border-[#1D1D1F] shadow-xl overflow-hidden flex flex-col min-h-[780px] max-h-[820px] relative">
      {/* Android Status Bar */}
      <div className="px-6 pt-3 pb-2 bg-white flex items-center justify-between text-xs text-slate-800 select-none">
        <span className="font-mono font-semibold tabular-nums">11:06</span>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600 tabular-nums">
          <span>5G</span>
          <Wifi className="w-3.5 h-3.5" />
          <span>82%</span>
        </div>
      </div>

      {/* Toast */}
      {androidToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{androidToast}</span>
        </div>
      )}

      {/* Clean Android Top Bar */}
      <div className="px-5 py-3 bg-white flex items-center justify-between border-b border-black/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-sm shadow-2xs">
            🦢
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">工小湖</div>
            <div className="text-[11px] text-slate-400">Android 客户端</div>
          </div>
        </div>

        <span className="text-xs font-medium text-emerald-600">
          课堂守护已开启
        </span>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3.5">
        {/* ==================== TAB 1: HOME ==================== */}
        {androidTab === 'home' && (
          <>
            {/* Live Class Banner */}
            <div className="rounded-3xl bg-white p-4 border border-black/[0.05] shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-600">正在上课 · 已自动签入</span>
                <span className="text-slate-400 font-mono">10:25 - 12:00</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">计算机网络</h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>2609(多媒体)</span>
                  <span>·</span>
                  <span>老师放映至第 147 页</span>
                </div>
              </div>

              <button
                onClick={() => setAndroidTab('classroom')}
                className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>打开课件与随堂习题</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Quick Answer Card */}
            <div className="rounded-3xl bg-white p-4 border border-black/[0.05] shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">实况通知栏快捷作答</span>
                <span className="text-slate-400">免切应用秒交</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                随堂单选题：当前因特网标准使用的外部网关协议（EGP）是？
              </p>
              <div className="grid grid-cols-4 gap-2">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setNotifQuickAnswer(opt);
                      triggerToast(`已通过通知栏提交选项 ${opt}`);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                      notifQuickAnswer === opt
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    选项 {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Android Native Features */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setAndroidTab('classroom')}
                className="p-3.5 rounded-2xl bg-white border border-black/[0.05] text-left space-y-1"
              >
                <PictureInPicture2 className="w-4 h-4 text-blue-600" />
                <div className="text-xs font-bold text-slate-900 pt-1">
                  画中画小窗课件
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  边看课件边在笔记软件记重点
                </p>
              </button>

              <button
                onClick={() => setAndroidTab('schedule')}
                className="p-3.5 rounded-2xl bg-white border border-black/[0.05] text-left space-y-1"
              >
                <Calendar className="w-4 h-4 text-emerald-600" />
                <div className="text-xs font-bold text-slate-900 pt-1">
                  今日课表与教室
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  随时查看当天上课时间与多媒体教室
                </p>
              </button>
            </div>
          </>
        )}

        {/* ==================== TAB 2: CLASSROOM & PIP ==================== */}
        {androidTab === 'classroom' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  计算机网络 · 课件与笔记
                </h4>
                <p className="text-[11px] text-slate-400">
                  支持双指缩放与分屏速记
                </p>
              </div>
              <button
                onClick={() => {
                  setPipEnabled((v) => !v);
                  triggerToast(pipEnabled ? '已切换为全屏视图' : '已开启画中画悬浮窗');
                }}
                className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold"
              >
                {pipEnabled ? '小窗模式' : '全屏模式'}
              </button>
            </div>

            <SlideCanvasRenderer
              slide={currentSlide}
              courseName="计算机网络"
              totalSlides={230}
            />

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {COMPUTER_NETWORK_SLIDES.map((s, idx) => (
                <button
                  key={s.page}
                  onClick={() => setSlideIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs shrink-0 transition-colors ${
                    slideIdx === idx
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-white text-slate-600 border border-slate-200/80'
                  }`}
                >
                  第 {s.page} 页
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-white border border-black/[0.05] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  随堂笔记（第 {currentSlide.page} 页）
                </span>
                <span className="text-[11px] text-slate-400">自动保存</span>
              </div>
              <textarea
                rows={3}
                defaultValue="自治系统间使用 BGP-4，自治系统内使用 RIP 或 OSPF。主观题 P178-2 聚合后子网掩码为 /19。"
                className="w-full rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ==================== TAB 3: SCHEDULE ==================== */}
        {androidTab === 'schedule' && (
          <div className="space-y-3.5">
            <div className="text-xs text-slate-500 px-1">
              今日课程安排
            </div>

            <div className="p-4 rounded-3xl bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 border border-blue-100 space-y-3">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">🦢</span>
                    <span className="text-xs font-bold text-slate-900">
                      工小湖 · 今日课程
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-600 font-medium">
                    周三 · 2 节课
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {COURSE_SCHEDULE.slice(0, 2).map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1"
                    >
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {c.timeRange}
                      </div>
                      <div className="text-[10px] text-blue-600 font-medium">
                        {c.room}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-black/[0.05] space-y-2">
              <div className="text-sm font-bold text-slate-900">
                今日完整日程
              </div>
              {COURSE_SCHEDULE.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="py-2 flex items-center justify-between text-xs border-b border-slate-100 last:border-0"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{c.name}</span>
                    <span className="text-slate-400 ml-2">{c.room}</span>
                  </div>
                  <span className="font-mono text-slate-500">{c.timeRange}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: ANDROID SETTINGS ==================== */}
        {androidTab === 'settings' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl divide-y divide-slate-100 border border-black/[0.05]">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    熄屏自动进班与签到
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    开课时后台自动进入课堂并完成打卡
                  </div>
                </div>
                <button
                  onClick={() => setAutoSignEnabled((v) => !v)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                    autoSignEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-2xs" />
                </button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    画中画课件悬浮窗
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    切回桌面或笔记应用时自动缩小为悬浮窗
                  </div>
                </div>
                <button
                  onClick={() => setPipEnabled((v) => !v)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                    pipEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-2xs" />
                </button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    随堂测验超时补答
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    倒计时归零后仍支持提交答案与草稿图
                  </div>
                </div>
                <button
                  onClick={() => setMakeupEnabled((v) => !v)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                    makeupEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-2xs" />
                </button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    安装包与版本更新
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    当前版本 v2.1.0 (15 MB) · 夸克网盘官方源
                  </div>
                </div>
                <a
                  href="https://pan.quark.cn/s/236c3ee4c001"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerToast('正在跳转夸克网盘下载最新 APK')}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  下载 APK
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-slate-200/70 px-3 py-2 grid grid-cols-4 gap-1 select-none">
        {(
          [
            { id: 'home', label: '首页', icon: Smartphone },
            { id: 'classroom', label: '课件', icon: Layers },
            { id: 'schedule', label: '课表', icon: Calendar },
            { id: 'settings', label: '设置', icon: Sliders }
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const active = androidTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAndroidTab(item.id)}
              className={`py-1.5 rounded-2xl flex flex-col items-center justify-center transition-colors ${
                active ? 'text-blue-600 font-semibold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
