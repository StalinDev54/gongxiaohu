import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  MapPin,
  HelpCircle,
  Bookmark,
  Plus,
  X,
  Check,
  Maximize2,
  Minimize2,
  Sliders,
  Calendar,
  Award,
  BookOpen,
  Sparkles,
  Wifi
} from 'lucide-react';
import {
  MOTTO_LIST,
  COMPUTER_NETWORK_SLIDES,
  PYTHON_COURSE_SLIDES,
  INITIAL_QUIZZES,
  COURSE_SCHEDULE,
  STUDENT_GRADES,
  QuizItem,
  SlideItem
} from '../data/gongxiaohuData';
import { SlideCanvasRenderer } from './SlideCanvasRenderer';

export type MiniScreen = 'home' | 'classroom' | 'settings' | 'schedule' | 'grades';

interface MiniProgramClientProps {
  activeScreen?: MiniScreen;
  onScreenChange?: (screen: MiniScreen) => void;
}

export const MiniProgramClient: React.FC<MiniProgramClientProps> = ({
  activeScreen: externalScreen,
  onScreenChange,
}) => {
  const [internalScreen, setInternalScreen] = useState<MiniScreen>('home');
  const screen = externalScreen ?? internalScreen;

  const navigate = (next: MiniScreen) => {
    setInternalScreen(next);
    onScreenChange?.(next);
  };

  // Daily quote
  const [mottoIdx, setMottoIdx] = useState(0);
  const currentMotto = MOTTO_LIST[mottoIdx];

  // Focus timer
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [focusUsersCount, setFocusUsersCount] = useState(12);

  useEffect(() => {
    if (!pomodoroRunning) return;
    const timer = setInterval(() => {
      setPomodoroSeconds((prev) => (prev > 0 ? prev - 1 : 25 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, [pomodoroRunning]);

  // Settings
  const [realNameStyle, setRealNameStyle] = useState<'完整' | '隐藏'>('完整');
  const [sessionRenewMode, setSessionRenewMode] = useState<'静默续签' | '手动确认'>('静默续签');
  const [autoSignMode, setAutoSignMode] = useState<'开课立即签' | '仅提醒' | '关闭'>('开课立即签');
  const [timeoutMakeupEnabled, setTimeoutMakeupEnabled] = useState(true);
  const [autoQuizBetaEnabled, setAutoQuizBetaEnabled] = useState(false);
  const [antiRollCallAlert, setAntiRollCallAlert] = useState(false);

  // Classroom
  const [activeCourseId, setActiveCourseId] = useState<'net' | 'python'>('net');
  const [netSlides, setNetSlides] = useState<SlideItem[]>(COMPUTER_NETWORK_SLIDES);
  const [pySlides, setPySlides] = useState<SlideItem[]>(PYTHON_COURSE_SLIDES);
  const currentSlides = activeCourseId === 'net' ? netSlides : pySlides;
  const totalCourseSlides = activeCourseId === 'net' ? 230 : 68;

  const [selectedSlidePage, setSelectedSlidePage] = useState<number>(147);
  const [slideZoom, setSlideZoom] = useState<number>(1);
  const [classroomTab, setClassroomTab] = useState<'all' | 'slides' | 'quizzes' | 'rollcall'>('all');
  const [quizFilter, setQuizFilter] = useState<'all' | 'published' | 'unpublished'>('all');

  // Quizzes & Drafts
  const [quizzes, setQuizzes] = useState<QuizItem[]>(INITIAL_QUIZZES);
  const [activeQuizModal, setActiveQuizModal] = useState<QuizItem | null>(null);
  const [subjectiveDraft, setSubjectiveDraft] = useState<string>('');
  const [draftImages, setDraftImages] = useState<string[]>([]);
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 2600);
  };

  const handleSwitchCourse = (cid: 'net' | 'python') => {
    setActiveCourseId(cid);
    setSelectedSlidePage(cid === 'net' ? 147 : 42);
    setSlideZoom(1);
  };

  const activeSlide =
    currentSlides.find((s) => s.page === selectedSlidePage) || currentSlides[0];

  const handleAddDraftPhoto = () => {
    if (draftImages.length >= 9) {
      showToast('最多支持上传 9 张图片');
      return;
    }
    const nextIdx = draftImages.length + 1;
    setDraftImages((prev) => [...prev, `草稿配图_${nextIdx}.jpg`]);
  };

  const handleRemoveDraftPhoto = (idx: number) => {
    setDraftImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitQuiz = (quiz: QuizItem, chosenOption?: string) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quiz.id
          ? {
              ...q,
              status: 'submitted',
              userAnswer: chosenOption || subjectiveDraft
            }
          : q
      )
    );
    setActiveQuizModal(null);
    showToast(quiz.type === '主观题' ? '补交作答已提交' : `已提交选项 ${chosenOption}`);
  };

  const toggleSlideConfused = (page: number) => {
    const updater = (list: SlideItem[]) =>
      list.map((s) =>
        s.page === page ? { ...s, confusedCount: s.confusedCount + 1 } : s
      );
    if (activeCourseId === 'net') setNetSlides(updater);
    else setPySlides(updater);
    showToast('已标记不懂');
  };

  const toggleSlideStar = (page: number) => {
    const updater = (list: SlideItem[]) =>
      list.map((s) => (s.page === page ? { ...s, starred: !s.starred } : s));
    if (activeCourseId === 'net') setNetSlides(updater);
    else setPySlides(updater);
  };

  const courseQuizzes = quizzes.filter((q) => q.courseId === activeCourseId);
  const filteredQuizzes = courseQuizzes.filter((q) => {
    if (quizFilter === 'all') return true;
    if (quizFilter === 'published') return q.status !== 'unpublished';
    return q.status === 'unpublished';
  });

  return (
    <div className="w-full max-w-[392px] mx-auto bg-[#F5F6F8] rounded-[44px] border-[8px] border-[#1D1D1F] shadow-xl overflow-hidden flex flex-col min-h-[780px] max-h-[820px] relative">
      {/* Status Bar */}
      <div
        className={`px-6 pt-3 pb-1.5 flex items-center justify-between text-xs font-semibold select-none transition-colors ${
          screen === 'home'
            ? 'bg-[#2A1B3D] text-white/95'
            : 'bg-white text-slate-900'
        }`}
      >
        <span className="font-mono tabular-nums">10:44</span>
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5" />
          <div className="px-1.5 py-0.5 rounded bg-black/10 text-[10px] font-mono tabular-nums">
            82
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastBanner && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-black/85 text-white text-xs px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastBanner}</span>
        </div>
      )}

      {/* ==================== HOME SCREEN ==================== */}
      {screen === 'home' && (
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
          {/* Literary Quote Header */}
          <div
            className={`relative bg-gradient-to-b ${currentMotto.bgTheme} text-white px-4 pt-2 pb-8 transition-colors duration-300`}
          >
            {/* WeChat Capsule Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-white/90 text-slate-900 pl-1.5 pr-3.5 py-1 rounded-full">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs">
                  🦢
                </span>
                <span className="text-xs font-bold tracking-tight">工小湖</span>
              </div>

              <div className="flex items-center bg-white/80 text-slate-900 rounded-full px-2.5 py-1 gap-2.5">
                <button
                  onClick={() => navigate('settings')}
                  className="text-xs font-bold tracking-widest px-1"
                  title="高级设置"
                >
                  •••
                </button>
                <span className="w-px h-3.5 bg-slate-300" />
                <span className="w-4 h-4 rounded-full border-2 border-slate-800 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                </span>
              </div>
            </div>

            {/* Dynamic Island Live Class Pill */}
            <button
              onClick={() => {
                handleSwitchCourse('net');
                navigate('classroom');
              }}
              className="mt-3.5 w-full max-w-[290px] mx-auto bg-black/90 text-white rounded-full px-3.5 py-2 flex items-center justify-between shadow-md border border-white/10 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                </span>
                <span className="text-xs font-medium">已免扫码进入</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-300">
                <span>计算机网络</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </button>

            {/* Daily Quote */}
            <div className="mt-4 px-2 text-center">
              <div className="text-lg text-white/60 font-serif leading-none">“</div>
              <p className="mt-1 text-xs leading-relaxed text-white/95 line-clamp-4">
                {currentMotto.quote}
              </p>
              <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-white/75">
                <span>
                  —— {currentMotto.author}
                  {currentMotto.work ? ` ${currentMotto.work}` : ''}
                </span>
                <button
                  onClick={() => setMottoIdx((prev) => (prev + 1) % MOTTO_LIST.length)}
                  className="p-1 rounded-full hover:bg-white/10 active:rotate-180 transition-transform"
                  aria-label="换一句"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Rounded Sheet Content */}
          <div className="-mt-4 bg-[#F6F8FB] rounded-t-3xl px-4 pt-4 pb-6 space-y-3.5 flex-1">
            {/* Greeting */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  早上好{realNameStyle === '完整' ? '' : ''}
                </h2>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span>教务与雨课堂已连接</span>
                  <span>·</span>
                  <span>今日元气满满</span>
                  <span>·</span>
                  <span>{focusUsersCount} 人正在专注</span>
                </div>
              </div>
              <button
                onClick={() => navigate('settings')}
                className="w-9 h-9 rounded-full bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center shadow-2xs"
                title="高级设置"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            {/* Focus Card */}
            <div className="bg-gradient-to-r from-emerald-50/90 to-white rounded-2xl p-3.5 border border-emerald-200/50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-emerald-950">
                    今天也要加油鸭！
                  </div>
                  <p className="text-[11px] text-emerald-800/80 mt-0.5">
                    {pomodoroRunning
                      ? `专注倒计时 ${String(Math.floor(pomodoroSeconds / 60)).padStart(2, '0')}:${String(pomodoroSeconds % 60).padStart(2, '0')}`
                      : '保持节奏 · 点击开启番茄专注'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPomodoroRunning((r) => !r);
                    setFocusUsersCount((c) => (pomodoroRunning ? c - 1 : c + 1));
                  }}
                  className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-emerald-900 font-medium mb-1">
                  <span>本周学习进度</span>
                  <span className="font-mono tabular-nums">4/7 天</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-emerald-200/60 overflow-hidden">
                  <div className="h-full w-[57%] bg-emerald-600 rounded-full" />
                </div>
              </div>
            </div>

            {/* Live Class Card */}
            <div className="bg-[#EAF2FF] rounded-2xl p-4 border border-blue-200/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-700 font-semibold">第1节 · 上课中</span>
                <button
                  onClick={() => navigate('schedule')}
                  className="text-blue-600 font-medium flex items-center gap-0.5"
                >
                  <span>完整课表</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    正在上课
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">计算机网络</h3>
                  <span className="text-xs font-mono text-slate-700 bg-white px-2 py-0.5 rounded tabular-nums flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    10:25-12:00
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                  <span className="bg-white px-2 py-0.5 rounded flex items-center gap-1 text-slate-700">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    2609(多媒体)
                  </span>
                  <span>保持专注汲取力量 · 距微休还有 26 分钟</span>
                </div>
              </div>

              <button
                onClick={() => {
                  handleSwitchCourse('net');
                  navigate('classroom');
                }}
                className="mt-3.5 w-full py-2.5 rounded-xl bg-[#1D58D8] hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>进入课堂专注模式</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Entry Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => navigate('schedule')}
                className="bg-white p-3.5 rounded-2xl border border-black/[0.04] text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] font-medium text-blue-600">课表日程</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">课程表</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">智能倒计时 · 周课表</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
              </button>

              <button
                onClick={() => navigate('grades')}
                className="bg-white p-3.5 rounded-2xl border border-black/[0.04] text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] font-medium text-emerald-600">成绩分析</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">成绩查询</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">学期绩点 · 补考预警</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
              </button>

              <button
                onClick={() => {
                  handleSwitchCourse('python');
                  navigate('classroom');
                }}
                className="bg-white p-3.5 rounded-2xl border border-black/[0.04] text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] font-medium text-sky-600">智慧课堂</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">雨课堂</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">课件预览 · 随堂习题</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
              </button>

              <button
                onClick={() => navigate('settings')}
                className="bg-white p-3.5 rounded-2xl border border-black/[0.04] text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] font-medium text-purple-600">偏好设定</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">高级设置</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">自动签到 · 超时补答</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CLASSROOM SCREEN ==================== */}
      {screen === 'classroom' && (
        <div className="flex-1 flex flex-col bg-[#F5F7FA] overflow-hidden">
          {/* Header */}
          <div className="bg-white px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100">
            <button
              onClick={() => navigate('home')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
              aria-label="返回"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              <button
                onClick={() => handleSwitchCourse('net')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  activeCourseId === 'net'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                计算机网络
              </button>
              <button
                onClick={() => handleSwitchCourse('python')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  activeCourseId === 'python'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                Python程序设计
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setSlideZoom((z) => (z >= 1.3 ? 1 : +(z + 0.15).toFixed(2)))
                }
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
                title="缩放课件"
              >
                {slideZoom > 1 ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Dynamic Island Classroom Pill */}
          <div className="px-4 pt-2.5 pb-1.5 bg-white">
            <button
              onClick={() => {
                const targetQuiz =
                  activeCourseId === 'net'
                    ? quizzes.find((q) => q.id === 'q-net-132')
                    : quizzes.find((q) => q.id === 'q-py-42');
                if (targetQuiz) setActiveQuizModal(targetQuiz);
              }}
              className="w-full bg-black text-white rounded-full px-3.5 py-2 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-[10px]">
                  📺
                </span>
                <span className="text-xs font-medium">
                  老师放映至第 {selectedSlidePage} 页
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-300">
                <span>课件放映</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-2 space-y-3">
            <SlideCanvasRenderer
              slide={activeSlide}
              zoom={slideZoom}
              courseName={activeCourseId === 'net' ? '计算机网络' : 'Python程序设计'}
              totalSlides={totalCourseSlides}
            />

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {currentSlides.map((s) => {
                const isSelected = s.page === selectedSlidePage;
                return (
                  <button
                    key={s.page}
                    onClick={() => setSelectedSlidePage(s.page)}
                    className={`relative shrink-0 w-20 h-14 rounded-xl border p-1.5 text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white border-slate-900'
                        : 'bg-white/80 border-slate-200/80 opacity-75'
                    }`}
                  >
                    <div className="text-[9px] font-medium text-slate-700 line-clamp-2 leading-tight">
                      {s.title}
                    </div>
                    <span
                      className={`self-end px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tabular-nums ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-600 text-white'
                      }`}
                    >
                      {s.page}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 4 Clean Tabs: 全部 | 课件 | 习题 | 点名 */}
            <div className="flex items-center gap-6 px-2 pt-1 border-b border-slate-200/80 text-sm">
              {(
                [
                  { id: 'all', label: '全部' },
                  { id: 'slides', label: '课件' },
                  { id: 'quizzes', label: '习题' },
                  { id: 'rollcall', label: '点名' }
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setClassroomTab(t.id)}
                  className={`pb-2 font-bold transition-colors relative ${
                    classroomTab === t.id
                      ? 'text-slate-900'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t.label}
                  {classroomTab === t.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Quizzes List */}
            {(classroomTab === 'quizzes' || classroomTab === 'all') && (
              <div className="space-y-2.5">
                {classroomTab === 'quizzes' && (
                  <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-full w-fit">
                    <button
                      onClick={() => setQuizFilter('all')}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        quizFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      全部 ({courseQuizzes.length})
                    </button>
                    <button
                      onClick={() => setQuizFilter('published')}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        quizFilter === 'published'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      已发布 ({courseQuizzes.filter((q) => q.status !== 'unpublished').length})
                    </button>
                    <button
                      onClick={() => setQuizFilter('unpublished')}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        quizFilter === 'unpublished'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      未发布 ({courseQuizzes.filter((q) => q.status === 'unpublished').length})
                    </button>
                  </div>
                )}

                {filteredQuizzes.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuizModal(q)}
                    className="w-full bg-white p-3.5 rounded-2xl border border-black/[0.04] text-left flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-14 h-11 rounded-lg bg-slate-100 border border-slate-200/70 flex flex-col justify-between p-1.5 shrink-0">
                        <span className="text-[9px] text-slate-500 truncate">
                          {q.type}
                        </span>
                        <span className="self-end px-1 rounded bg-slate-700 text-white font-mono text-[9px] font-bold">
                          P{q.page}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900">
                          {q.type} · 第{q.page}页
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                          {q.question}
                        </p>
                        <div className="mt-1 text-[10px] text-slate-400">
                          随堂课件自带
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-0.5 text-xs">
                      {q.status === 'unpublished' && (
                        <span className="text-slate-400">未发布</span>
                      )}
                      {q.status === 'published' && (
                        <span className="text-blue-600 font-medium">去作答</span>
                      )}
                      {q.status === 'timeout_makeup' && (
                        <span className="text-amber-600 font-medium">可补交</span>
                      )}
                      {q.status === 'submitted' && (
                        <span className="text-emerald-600 font-medium">已提交</span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Slides Stream */}
            {(classroomTab === 'slides' || classroomTab === 'all') && (
              <div className="space-y-2.5">
                {currentSlides.map((s) => (
                  <div
                    key={s.page}
                    className="bg-white rounded-2xl p-3.5 border border-black/[0.04] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        {s.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-600 text-white font-mono text-[10px] tabular-nums">
                        第{s.page}页
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {s.bullets[0]}
                    </p>
                    <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
                      <span>刚刚</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSlideConfused(s.page)}
                          className="px-3 py-1 rounded-full border border-slate-200 text-slate-600 flex items-center gap-1 text-xs"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>不懂</span>
                        </button>
                        <button
                          onClick={() => toggleSlideStar(s.page)}
                          className={`px-3 py-1 rounded-full border flex items-center gap-1 text-xs ${
                            s.starred
                              ? 'border-amber-300 bg-amber-50 text-amber-700'
                              : 'border-slate-200 text-slate-600'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>{s.starred ? '已收藏' : '收藏'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {classroomTab === 'rollcall' && (
              <div className="bg-white rounded-2xl p-4 border border-black/[0.04] text-center py-8 space-y-1">
                <div className="text-sm font-bold text-slate-800">
                  已完成本节课自动签到
                </div>
                <p className="text-xs text-slate-400">
                  当前教师暂未发起随机点名
                </p>
              </div>
            )}
          </div>

          {/* Native Bottom Sheet Quiz Modal */}
          {activeQuizModal && (
            <div className="absolute inset-0 z-40 bg-black/45 flex flex-col justify-end">
              <div className="bg-white rounded-t-3xl p-4 max-h-[85%] overflow-y-auto space-y-3.5 shadow-2xl">
                <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                    {activeQuizModal.type}
                  </span>

                  <div className="flex items-center gap-2">
                    {activeQuizModal.type === '主观题' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>可补交</span>
                      </span>
                    )}
                    <button
                      onClick={() => setActiveQuizModal(null)}
                      className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-900 leading-relaxed">
                  {activeQuizModal.question}
                </div>

                {/* Single Choice Options */}
                {activeQuizModal.options && (
                  <div className="space-y-2 pt-1">
                    {activeQuizModal.options.map((opt) => {
                      const isSelected = activeQuizModal.userAnswer === opt.label;
                      return (
                        <button
                          key={opt.label}
                          onClick={() => handleSubmitQuiz(activeQuizModal, opt.label)}
                          className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/60 text-blue-950'
                              : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-900'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {opt.label}
                          </span>
                          <span className="text-xs font-medium">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Subjective Form */}
                {activeQuizModal.type === '主观题' && (
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-[#F4F5F7] p-3">
                      <textarea
                        rows={4}
                        value={subjectiveDraft}
                        onChange={(e) => setSubjectiveDraft(e.target.value.slice(0, 500))}
                        placeholder="请输入您的随堂简答内容..."
                        className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                      />
                      <div className="text-right text-[11px] text-slate-400 font-mono tabular-nums">
                        {subjectiveDraft.length}/500
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-slate-800">
                          作答配图 ({draftImages.length}/9)
                        </span>
                        <span className="text-[11px] text-slate-400">
                          最多支持上传 9 张图片
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {draftImages.map((imgName, idx) => (
                          <div
                            key={idx}
                            className="relative h-24 rounded-xl bg-slate-100 border border-slate-200 p-2 flex flex-col justify-between"
                          >
                            <button
                              onClick={() => handleRemoveDraftPhoto(idx)}
                              className="self-end w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="text-[10px] text-slate-600 truncate">
                              {imgName}
                            </div>
                          </div>
                        ))}

                        {draftImages.length < 9 && (
                          <button
                            onClick={handleAddDraftPhoto}
                            className="h-24 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 flex flex-col items-center justify-center gap-1"
                          >
                            <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                              <Plus className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-800">
                              添加图片
                            </span>
                            <span className="text-[10px] text-slate-400">
                              拍照 / 相册
                            </span>
                          </button>
                        )}
                      </div>

                      <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
                        * 支持拍摄解题草稿、作业答题卡，将直传至雨课堂云端伴随作答一并提交。
                      </p>
                    </div>

                    <button
                      onClick={() => handleSubmitQuiz(activeQuizModal)}
                      className="w-full py-3 rounded-2xl bg-[#1E2536] text-white text-xs font-bold"
                    >
                      提交补交作答至雨课堂
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== ADVANCED SETTINGS SCREEN ==================== */}
      {screen === 'settings' && (
        <div className="flex-1 flex flex-col bg-[#F5F6F8] overflow-y-auto no-scrollbar">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
            <button
              onClick={() => navigate('home')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-slate-900">高级</h3>
            <div className="w-8" />
          </div>

          <div className="p-4 space-y-5">
            {/* 界面与隐私 */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-500 px-1">界面与隐私</div>
              <div className="bg-white rounded-2xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">
                  首页实名显示样式
                </span>
                <button
                  onClick={() =>
                    setRealNameStyle((s) => (s === '完整' ? '隐藏' : '完整'))
                  }
                  className="text-sm text-slate-500 flex items-center gap-1"
                >
                  <span>{realNameStyle}</span>
                  <span className="text-xs">↕</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 px-1 leading-relaxed">
                设置首页问候栏实名呈现样式。默认为完整；选择隐藏时，将仅保留时间问好（如“晚上好”），不再展示真实姓名，全面保障屏幕隐私。
              </p>
            </div>

            {/* 教务系统 */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-500 px-1">教务系统</div>
              <div className="bg-white rounded-2xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">
                  自动登录与会话续签
                </span>
                <button
                  onClick={() =>
                    setSessionRenewMode((m) =>
                      m === '静默续签' ? '手动确认' : '静默续签'
                    )
                  }
                  className="text-sm text-slate-500 flex items-center gap-1"
                >
                  <span>{sessionRenewMode}</span>
                  <span className="text-xs">↕</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 px-1 leading-relaxed">
                冷启动或切前台时自动保活教务会话并静默续期，保证课表日程、学业成绩即开即用、离线秒开。
              </p>
            </div>

            {/* 雨课堂设定 */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-500 px-1">雨课堂设定</div>
              <div className="bg-white rounded-2xl divide-y divide-slate-100">
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">
                    自动签到
                  </span>
                  <button
                    onClick={() =>
                      setAutoSignMode((m) =>
                        m === '开课立即签'
                          ? '仅提醒'
                          : m === '仅提醒'
                          ? '关闭'
                          : '开课立即签'
                      )
                    }
                    className="text-sm text-slate-500 flex items-center gap-1"
                  >
                    <span>{autoSignMode}</span>
                    <span className="text-xs">↕</span>
                  </button>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">
                    超时补答
                  </span>
                  <button
                    onClick={() => setTimeoutMakeupEnabled((v) => !v)}
                    className={`w-12 h-7 rounded-full p-0.5 transition-colors flex items-center ${
                      timeoutMakeupEnabled
                        ? 'bg-[#34C759] justify-end'
                        : 'bg-slate-300 justify-start'
                    }`}
                    aria-label="切换超时补答"
                  >
                    <span className="w-6 h-6 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 px-1 leading-relaxed">
                自动签到需用户打开小程序则自动签到所有正在开课的课程，直连官方接口核验签到凭据。超时补答突破随堂试题倒计时限制，收题后仍允许客户端向官方接口发起补交。
              </p>
            </div>

            {/* 实验室特性 */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-500 px-1">实验室特性</div>
              <div className="bg-white rounded-2xl divide-y divide-slate-100">
                <button
                  onClick={() => setAutoQuizBetaEnabled((v) => !v)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-slate-900">
                    自动答题
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <span>{autoQuizBetaEnabled ? '已开启' : '灰度内测'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                <button
                  onClick={() => setAntiRollCallAlert((v) => !v)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-slate-900">
                    规避随堂点名
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <span>{antiRollCallAlert ? '已开启' : '研发中'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCHEDULE SCREEN ==================== */}
      {screen === 'schedule' && (
        <div className="flex-1 flex flex-col bg-[#F5F6F8] overflow-y-auto no-scrollbar">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100">
            <button
              onClick={() => navigate('home')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-slate-900">课程表</h3>
            <span className="text-xs text-slate-400">第 8 周</span>
          </div>

          <div className="p-4 space-y-2.5">
            {COURSE_SCHEDULE.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-900">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.teacher} · {item.room} · {item.timeRange}
                  </div>
                </div>
                {item.status === 1 ? (
                  <button
                    onClick={() => {
                      handleSwitchCourse(item.id === 'python' ? 'python' : 'net');
                      navigate('classroom');
                    }}
                    className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold shrink-0"
                  >
                    进入课堂
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 shrink-0">
                    {item.section}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== GRADES SCREEN ==================== */}
      {screen === 'grades' && (
        <div className="flex-1 flex flex-col bg-[#F5F6F8] overflow-y-auto no-scrollbar">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100">
            <button
              onClick={() => navigate('home')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-slate-900">成绩查询</h3>
            <span className="text-xs text-slate-400">GPA 4.18</span>
          </div>

          <div className="p-4 space-y-3">
            <div className="bg-white rounded-2xl divide-y divide-slate-100">
              {STUDENT_GRADES.map((g) => (
                <div
                  key={g.id}
                  className="p-3.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {g.courseName}
                    </div>
                    <div className="text-slate-400 mt-0.5">
                      {g.type} · {g.credit} 学分
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <div className="text-sm font-bold text-slate-900">
                      {g.score}
                    </div>
                    <div className="text-[11px] text-emerald-600">
                      绩点 {g.gpa.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/70 px-3 py-2 grid grid-cols-4 gap-1 select-none">
        {(
          [
            { id: 'home', label: '首页', icon: Sparkles },
            { id: 'classroom', label: '雨课堂', icon: BookOpen },
            { id: 'schedule', label: '课表', icon: Calendar },
            { id: 'settings', label: '设置', icon: Sliders }
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`py-1 rounded-xl flex flex-col items-center justify-center transition-colors ${
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
