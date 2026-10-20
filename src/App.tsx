import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  QrCode,
  Share,
  Sparkles,
  User,
  X
} from 'lucide-react';

const LOGO_URL = 'https://wework.qpic.cn/wwpic3az/121013_b5N-cfkWQ6CtmCI_1792308181/0';
const LOGO_FALLBACK_URL = '/blog-assets/logo_official.png';
const GITHUB_URL = 'https://github.com/StalinDev54/gongxiaohu';
const ANDROID_DOWNLOAD_URL = 'https://pan.quark.cn/s/236c3ee4c001#/list/share';
const IOS_DOWNLOAD_URL = 'https://github.com/StalinDev54/gongxiaohu/releases';

interface ScreenshotItem {
  id: string;
  title: string;
  src: string;
}

interface ReviewItem {
  id: string;
  title: string;
  author: string;
  date: string;
  rating: number;
  content: string;
}

const SCREENSHOTS: ScreenshotItem[] = [
  {
    id: 'home',
    title: '免扫码秒进班',
    src: '/blog-assets/02_home_live_class.png'
  },
  {
    id: 'slides',
    title: '百页课件预览',
    src: '/blog-assets/05_slides_bgp_preview.png'
  },
  {
    id: 'quiz-list',
    title: '习题提前查看',
    src: '/blog-assets/06_quiz_list_python.png'
  },
  {
    id: 'choice',
    title: '弹窗点选即交',
    src: '/blog-assets/07_quiz_single_choice.png'
  },
  {
    id: 'makeup',
    title: '超时补交与防丢',
    src: '/blog-assets/03_quiz_timeout_makeup.png'
  },
  {
    id: 'settings',
    title: '高级设置',
    src: '/blog-assets/04_advanced_sign_settings.png'
  }
];

const REVIEWS: ReviewItem[] = [
  {
    id: 'r1',
    title: '早八人的救星，再也不用举手机扫码了',
    author: '计科24级同学',
    date: '昨天',
    rating: 5,
    content: '以前坐阶梯教室后排每次扫雨课堂动态码都要放大对焦半天，现在打开工小湖直接秒进班，顶栏就能看到上课状态，230页的计网PPT划起来完全不卡。'
  },
  {
    id: 'r2',
    title: '超时补交和草稿防丢太实用了',
    author: '软工在读生',
    date: '3天前',
    rating: 5,
    content: '官方网页端倒计时一到直接弹遮罩锁死输入框，好几次主观题刚算完没来得及交。工小湖不仅实时存草稿，还能上传9张解题草稿图、支持超时补交，安全感拉满。'
  },
  {
    id: 'r3',
    title: '随堂习题提前预习，弹窗不挡课件',
    author: '湖工早八人',
    date: '本周',
    rating: 5,
    content: '把课件和习题拆成两个独立栏位真的太清爽了，老师发题的时候底部弹出小卡片点一下就交卷，一点都不耽误看正在讲的PPT。'
  }
];

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sticky top bar state on scroll
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Horizontal drag-to-scroll state (when carousel is scrollable on small screens)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  // Modals
  const [getSheetOpen, setGetSheetOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [apkDownloading, setApkDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyBar(window.scrollY > 220);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGetSheetOpen(false);
        setLightboxIdx(null);
      } else if (lightboxIdx !== null) {
        if (e.key === 'ArrowLeft') {
          setLightboxIdx((prev) =>
            prev !== null ? (prev - 1 + SCREENSHOTS.length) % SCREENSHOTS.length : null
          );
        } else if (e.key === 'ArrowRight') {
          setLightboxIdx((prev) =>
            prev !== null ? (prev + 1) % SCREENSHOTS.length : null
          );
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIdx]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setDragDistance(0);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftStart(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.25;
    setDragDistance(Math.abs(walk));
    el.scrollLeft = scrollLeftStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const scrollByStep = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(220, Math.round(el.clientWidth * 0.5));
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadApk = () => {
    setApkDownloading(true);
    setTimeout(() => setApkDownloading(false), 3000);
  };

  const activeLightbox =
    lightboxIdx !== null ? SCREENSHOTS[lightboxIdx] : null;

  return (
    <div className="min-h-screen w-full bg-white text-[#1C1C1E] antialiased selection:bg-[#007AFF] selection:text-white pb-14">
      {/* ==================== STICKY COMPACT HEADER ON SCROLL ==================== */}
      <div
        className={`fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E5EA] transition-all duration-200 ${
          showStickyBar
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 h-13 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={LOGO_URL}
              onError={(e) => {
                if (e.currentTarget.src !== LOGO_FALLBACK_URL) {
                  e.currentTarget.src = LOGO_FALLBACK_URL;
                }
              }}
              alt="工小湖"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg border border-black/[0.08] object-contain p-0.5 bg-white shrink-0"
            />
            <span className="text-[15px] font-bold text-[#1C1C1E] truncate">
              工小湖
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] transition-colors"
              title="GitHub 仓库"
            >
              <Github className="w-4 h-4" />
            </a>
            <button
              onClick={() => setGetSheetOpen(true)}
              className="px-5 py-1.5 rounded-full bg-[#007AFF] hover:bg-[#0066CC] active:scale-95 text-white text-[13px] font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              获取
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 1. TOP APP STORE ARTWORK BANNER (100% Full Width) ==================== */}
      <div className="relative w-full h-[156px] sm:h-[184px] md:h-[204px] bg-gradient-to-b from-[#DCE0E6] via-[#E8EBF0] to-[#F5F6F8] overflow-hidden select-none">
        <BookOpen className="w-6 h-6 text-[#8E939E]/20 absolute top-6 left-[12%] -rotate-12" />
        <GraduationCap className="w-7 h-7 text-[#8E939E]/20 absolute top-8 right-[14%] rotate-12" />
        <Calendar className="w-6 h-6 text-[#8E939E]/20 absolute bottom-7 left-[22%] rotate-6" />
        <FileText className="w-6 h-6 text-[#8E939E]/20 absolute bottom-8 right-[18%] -rotate-6" />
        <Sparkles className="w-5 h-5 text-[#8E939E]/20 absolute top-1/3 left-[48%]" />

        <div className="w-full px-4 sm:px-6 md:px-8 pt-3.5 sm:pt-4 flex items-center justify-between relative z-10">
          <a
            href="https://blog.jiclub.site/2026/yuketang-deep-dive"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-black/[0.05] flex items-center justify-center text-[#1C1C1E] hover:bg-white transition-colors"
            title="返回博客"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </a>

          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-black/[0.05] flex items-center justify-center text-[#1C1C1E] hover:bg-white transition-colors"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-black/[0.05] flex items-center justify-center text-[#1C1C1E] hover:bg-white transition-colors cursor-pointer"
              title="复制链接"
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-[#007AFF]" />
              ) : (
                <Share className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-2">
          <div className="flex items-center gap-2.5 sm:gap-3 opacity-40">
            <img
              src={LOGO_URL}
              onError={(e) => {
                if (e.currentTarget.src !== LOGO_FALLBACK_URL) {
                  e.currentTarget.src = LOGO_FALLBACK_URL;
                }
              }}
              alt=""
              referrerPolicy="no-referrer"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-contain grayscale contrast-125"
            />
            <span className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-[#5C6068]">
              GongXiaoHu
            </span>
          </div>
        </div>
      </div>

      {/* ==================== 100% EDGE-TO-EDGE FULL WIDTH MAIN CONTAINER ==================== */}
      <main className="w-full px-4 sm:px-6 md:px-8">
        {/* ==================== 2. APP HEADER ==================== */}
        <section className="pt-4 sm:pt-6 pb-5 sm:pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-stretch gap-4 sm:gap-5">
            <div className="w-[92px] h-[92px] sm:w-[108px] sm:h-[108px] md:w-[116px] md:h-[116px] rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.08] shadow-2xs overflow-hidden shrink-0 p-1.5 flex items-center justify-center">
              <img
                src={LOGO_URL}
                onError={(e) => {
                  if (e.currentTarget.src !== LOGO_FALLBACK_URL) {
                    e.currentTarget.src = LOGO_FALLBACK_URL;
                  }
                }}
                alt="工小湖"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-[16px] sm:rounded-[18px]"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-[#1C1C1E] leading-tight">
                    工小湖
                  </h1>
                  <span className="text-[11px] font-semibold text-[#8E8E93] border border-[#E5E5EA] rounded px-1.5 py-0.5 leading-none">
                    4+
                  </span>
                </div>
                <p className="text-[13px] sm:text-[15px] text-[#8E8E93] mt-0.5 truncate">
                  雨课堂与学校教务助手
                </p>
              </div>

              <div className="flex items-center pt-2">
                <button
                  onClick={() => setGetSheetOpen(true)}
                  className="px-7 py-1.5 rounded-full bg-[#007AFF] hover:bg-[#0066CC] active:scale-95 text-white text-[15px] font-bold tracking-tight transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  获取
                </button>
              </div>
            </div>
          </div>

          {/* Desktop/Tablet Right-Side Quick Access Cards */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => setGetSheetOpen(true)}
              className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#F2F2F7] hover:bg-[#E5E5EA]/80 transition-colors text-left cursor-pointer"
            >
              <img
                src="/blog-assets/qrcode_clean.png"
                alt="小程序码"
                className="w-10 h-10 rounded-lg bg-white p-0.5 border border-black/[0.06] shrink-0"
              />
              <div>
                <div className="text-[13px] font-bold text-[#1C1C1E] flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span>微信小程序</span>
                </div>
                <div className="text-[11px] text-[#8E8E93] mt-0.5">
                  扫码立即使用
                </div>
              </div>
            </button>

            <a
              href={ANDROID_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#F2F2F7] hover:bg-[#E5E5EA]/80 transition-colors text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-black/[0.06] flex items-center justify-center text-[#007AFF] shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#1C1C1E]">
                  Android 客户端
                </div>
                <div className="text-[11px] text-[#8E8E93] mt-0.5">
                  v2.1.0 · 立即下载
                </div>
              </div>
            </a>

            <a
              href={IOS_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#F2F2F7] hover:bg-[#E5E5EA]/80 transition-colors text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-black/[0.06] flex items-center justify-center text-[#007AFF] shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#1C1C1E]">
                  iOS 客户端
                </div>
                <div className="text-[11px] text-[#8E8E93] mt-0.5">
                  v2.1.0 · 立即下载
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* ==================== 3. HORIZONTAL METADATA STRIP ==================== */}
        <section className="py-3.5 border-y border-[#E5E5EA] grid grid-cols-4 text-center select-none">
          <a href="#ratings" className="px-1 hover:opacity-80 transition-opacity">
            <div className="text-[10px] sm:text-[12px] text-[#8E8E93] truncate">
              1,286 个评分
            </div>
            <div className="text-[18px] sm:text-[21px] font-bold text-[#8E8E93] font-mono tabular-nums leading-tight mt-0.5">
              4.9
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93] tracking-tighter mt-0.5">
              ★★★★★
            </div>
          </a>

          <div className="px-1 border-l border-[#E5E5EA]">
            <div className="text-[10px] sm:text-[12px] text-[#8E8E93]">年龄分级</div>
            <div className="text-[18px] sm:text-[21px] font-bold text-[#8E8E93] font-mono tabular-nums leading-tight mt-0.5">
              4+
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93] mt-0.5">教育</div>
          </div>

          <div className="px-1 border-l border-[#E5E5EA]">
            <div className="text-[10px] sm:text-[12px] text-[#8E8E93]">排行榜</div>
            <div className="text-[18px] sm:text-[21px] font-bold text-[#8E8E93] font-mono tabular-nums leading-tight mt-0.5">
              #1
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93] mt-0.5">效率</div>
          </div>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-1 border-l border-[#E5E5EA] hover:opacity-80 transition-opacity"
          >
            <div className="text-[10px] sm:text-[12px] text-[#8E8E93]">开发者</div>
            <div className="flex justify-center my-1">
              <div className="w-5 h-5 rounded-md border border-[#8E8E93] flex items-center justify-center text-[#8E8E93]">
                <User className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93] truncate">
              StalinDev54
            </div>
          </a>
        </section>

        {/* ==================== 4. WHAT'S NEW (新功能) ==================== */}
        <section className="py-5 border-b border-[#E5E5EA] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold tracking-tight text-[#1C1C1E]">
              新功能
            </h2>
            <div className="flex items-center gap-3 text-[13px] text-[#8E8E93]">
              <span>版本 2.1.0</span>
              <span>近期更新</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-4 text-[14px] text-[#1C1C1E] leading-relaxed">
            <div className="md:bg-[#F2F2F7]/70 md:p-3.5 md:rounded-2xl">
              <span className="font-semibold block text-[#1C1C1E] mb-0.5">
                免扫码秒进班
              </span>
              <span className="text-[#3A3A3C] text-[13px]">
                打开自动进入正在上课的课堂，告别后排抬手放大扫大屏。
              </span>
            </div>
            <div className="md:bg-[#F2F2F7]/70 md:p-3.5 md:rounded-2xl">
              <span className="font-semibold block text-[#1C1C1E] mb-0.5">
                超时补答与防丢
              </span>
              <span className="text-[#3A3A3C] text-[13px]">
                实时保存本地答题草稿，支持 9 张解题配图上传与超时补交。
              </span>
            </div>
            <div className="md:bg-[#F2F2F7]/70 md:p-3.5 md:rounded-2xl">
              <span className="font-semibold block text-[#1C1C1E] mb-0.5">
                百页课件流畅预览
              </span>
              <span className="text-[#3A3A3C] text-[13px]">
                支持双指无级缩放、随堂习题提前查看与底部弹窗秒交。
              </span>
            </div>
          </div>
        </section>

        {/* ==================== 5. PREVIEW (预览) ==================== */}
        <section className="py-6 border-b border-[#E5E5EA] space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold tracking-tight text-[#1C1C1E]">
              预览
            </h2>
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={() => scrollByStep('left')}
                className="w-7 h-7 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] cursor-pointer"
                aria-label="上一张"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollByStep('right')}
                className="w-7 h-7 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] cursor-pointer"
                aria-label="下一张"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex md:grid md:grid-cols-6 items-start gap-3 sm:gap-3.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar select-none touch-pan-x ${
              isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab md:cursor-pointer snap-x snap-mandatory md:snap-none'
            }`}
          >
            {SCREENSHOTS.map((shot, idx) => (
              <div
                key={shot.id}
                onClick={() => {
                  if (dragDistance < 8) {
                    setLightboxIdx(idx);
                  }
                }}
                className="snap-start shrink-0 w-[196px] sm:w-[210px] md:w-full rounded-[18px] lg:rounded-[22px] overflow-hidden border border-black/[0.08] bg-[#F2F2F7] shadow-2xs hover:opacity-95 transition-opacity cursor-pointer"
              >
                <img
                  src={shot.src}
                  alt={shot.title}
                  draggable={false}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[9/19.5] object-cover object-top pointer-events-none"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ==================== 6. RATINGS & REVIEWS (纯展示评分及评论，无假打分功能) ==================== */}
        <section id="ratings" className="py-6 border-b border-[#E5E5EA] space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold tracking-tight text-[#1C1C1E]">
              评分及评论
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
            {/* Pure Score & 5-Star Distribution Display */}
            <div className="lg:col-span-4">
              <div className="flex items-center justify-between gap-5">
                <div className="text-center shrink-0">
                  <div className="text-[48px] sm:text-[54px] font-extrabold tracking-tight text-[#1C1C1E] leading-none font-mono tabular-nums">
                    4.9
                  </div>
                  <div className="text-[12px] font-semibold text-[#8E8E93] mt-1.5">
                    满分 5 分
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  {[
                    { stars: 5, pct: '92%' },
                    { stars: 4, pct: '6%' },
                    { stars: 3, pct: '2%' },
                    { stars: 2, pct: '0%' },
                    { stars: 1, pct: '0%' }
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-2">
                      <div className="w-13 text-right text-[9px] text-[#8E8E93] tracking-tighter leading-none shrink-0">
                        {'★'.repeat(row.stars)}
                      </div>
                      <div className="flex-1 h-1.5 rounded-full bg-[#E5E5EA] overflow-hidden">
                        <div
                          className="h-full bg-[#8E8E93] rounded-full"
                          style={{ width: row.pct }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="text-right text-[12px] text-[#8E8E93] pt-1 font-mono tabular-nums">
                    1,286 个评分
                  </div>
                </div>
              </div>
            </div>

            {/* Static Review Cards */}
            <div className="lg:col-span-8 flex md:grid md:grid-cols-3 items-stretch gap-3.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar snap-x snap-mandatory md:snap-none touch-pan-x">
              {REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="snap-start shrink-0 w-[276px] sm:w-[300px] md:w-full bg-[#F2F2F7] rounded-[20px] p-4 flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[14px] font-bold text-[#1C1C1E] line-clamp-1">
                        {rev.title}
                      </h3>
                      <span className="text-[12px] text-[#8E8E93] whitespace-nowrap shrink-0">
                        {rev.date}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#FF9500] tracking-tighter">
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </span>
                      <span className="text-[#8E8E93] truncate max-w-[120px]">
                        {rev.author}
                      </span>
                    </div>

                    <p className="text-[13px] text-[#3A3A3C] leading-relaxed line-clamp-4 pt-0.5">
                      {rev.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== 7. INFORMATION TABLE (信息) ==================== */}
        <section className="py-6 space-y-3">
          <h2 className="text-[20px] font-bold tracking-tight text-[#1C1C1E]">
            信息
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-x-8 md:gap-x-10 divide-y divide-[#E5E5EA] sm:divide-y-0 text-[14px]">
            <div className="py-3 sm:border-b sm:border-[#E5E5EA] flex items-center justify-between gap-4">
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">微信小程序</span>
              <button
                onClick={() => setGetSheetOpen(true)}
                className="text-[#007AFF] font-medium hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                微信扫码使用
              </button>
            </div>

            <div className="py-3 sm:border-b sm:border-[#E5E5EA] flex items-center justify-between gap-4">
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">Android 客户端</span>
              <a
                href={ANDROID_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007AFF] font-medium hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>v2.1.0 · 下载</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="py-3 sm:border-b sm:border-[#E5E5EA] flex items-center justify-between gap-4">
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">iOS 客户端</span>
              <a
                href={IOS_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007AFF] font-medium hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>v2.1.0 · 下载</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="py-3 sm:border-b sm:border-[#E5E5EA] flex items-center justify-between gap-4">
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">GitHub</span>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007AFF] font-medium hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <span>StalinDev54/gongxiaohu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="py-3 sm:border-b sm:border-[#E5E5EA] flex items-center justify-between gap-4">
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">隐私保护</span>
              <span className="text-[#1C1C1E] truncate">
                本地 AES 加密存储，不留存隐私
              </span>
            </div>

            <div className="py-3 sm:border-b sm:border-[#E5E5EA] flex items-center justify-between gap-4">
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">开发者博客</span>
              <a
                href="https://blog.jiclub.site/2026/yuketang-deep-dive"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007AFF] hover:underline whitespace-nowrap shrink-0"
              >
                Cталин
              </a>
            </div>
          </div>

          <div className="pt-5 text-center text-xs text-[#8E8E93]">
            © 2026 Cталин · 湘ICP备2025137878号
          </div>
        </section>
      </main>

      {/* ==================== ULTRA-CLEAN "获取" MODAL ==================== */}
      {getSheetOpen && (
        <div
          onClick={() => setGetSheetOpen(false)}
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-[28px] sm:rounded-[28px] max-w-[400px] w-full p-6 pb-8 sm:pb-6 space-y-5 shadow-2xl"
          >
            <div className="w-9 h-1 rounded-full bg-[#D1D1D6] mx-auto -mt-2 mb-2 sm:hidden" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={LOGO_URL}
                  onError={(e) => {
                    if (e.currentTarget.src !== LOGO_FALLBACK_URL) {
                      e.currentTarget.src = LOGO_FALLBACK_URL;
                    }
                  }}
                  alt="工小湖"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl border border-black/[0.08] object-contain p-0.5 shrink-0"
                />
                <span className="text-base font-bold text-[#1C1C1E]">
                  获取工小湖
                </span>
              </div>
              <button
                onClick={() => setGetSheetOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#8E8E93] shrink-0 cursor-pointer"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 flex flex-col items-center text-center space-y-2.5">
              <img
                src="/blog-assets/qrcode_clean.png"
                alt="微信小程序码"
                referrerPolicy="no-referrer"
                className="w-44 h-44 rounded-2xl border border-black/[0.06] p-2 bg-white"
              />
              <span className="text-xs text-[#8E8E93]">
                微信扫一扫上方二维码，立即打开小程序
              </span>
            </div>

            <div className="border-t border-[#E5E5EA] divide-y divide-[#E5E5EA] text-sm">
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-[#1C1C1E] truncate">
                    Android 客户端
                  </div>
                  <div className="text-xs text-[#8E8E93] truncate">
                    v2.1.0 · 15M
                  </div>
                </div>
                <a
                  href={ANDROID_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full bg-[#007AFF] hover:bg-[#0066CC] text-white text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                >
                  下载 APK
                </a>
              </div>

              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-[#1C1C1E] truncate">
                    iOS 客户端
                  </div>
                  <div className="text-xs text-[#8E8E93] truncate">
                    v2.1.0 · GitHub Releases
                  </div>
                </div>
                <a
                  href={IOS_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full bg-[#007AFF] hover:bg-[#0066CC] text-white text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                >
                  下载 iOS
                </a>
              </div>

              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-[#1C1C1E] truncate">
                    GitHub 仓库
                  </div>
                  <div className="text-xs text-[#8E8E93] truncate">
                    StalinDev54/gongxiaohu
                  </div>
                </div>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>查看</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCREENSHOT LIGHTBOX MODAL ==================== */}
      {activeLightbox && lightboxIdx !== null && (
        <div
          onClick={() => setLightboxIdx(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full bg-white rounded-3xl p-3.5 space-y-2.5 shadow-2xl"
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-bold text-[#1C1C1E]">
                {activeLightbox.title}
              </span>
              <button
                onClick={() => setLightboxIdx(null)}
                className="w-7 h-7 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#6E6E73] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative bg-[#F2F2F7] rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={activeLightbox.src}
                alt={activeLightbox.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain"
              />
              <button
                onClick={() =>
                  setLightboxIdx(
                    (lightboxIdx - 1 + SCREENSHOTS.length) % SCREENSHOTS.length
                  )
                }
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-[#1C1C1E] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setLightboxIdx((lightboxIdx + 1) % SCREENSHOTS.length)
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-[#1C1C1E] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
