import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FileText,
  GraduationCap,
  Share,
  Sparkles,
  Star,
  User,
  X
} from 'lucide-react';

const LOGO_URL = 'https://wework.qpic.cn/wwpic3az/121013_b5N-cfkWQ6CtmCI_1792308181/0';
const LOGO_FALLBACK_URL = '/blog-assets/logo_official.png';

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

const INITIAL_REVIEWS: ReviewItem[] = [
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

  // Horizontal drag-to-scroll state (PC mouse)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  // Ratings & Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [ratingCount, setRatingCount] = useState<number>(1286);
  const [userTapStars, setUserTapStars] = useState<number>(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReviewStars, setNewReviewStars] = useState<number>(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');

  // Modals
  const [getSheetOpen, setGetSheetOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [apkDownloading, setApkDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Listen to window scroll for App Store sticky compact header
  useEffect(() => {
    const onScroll = () => {
      setShowStickyBar(window.scrollY > 260);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard shortcuts for PC (Escape / Left / Right in Lightbox)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGetSheetOpen(false);
        setReviewModalOpen(false);
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
    const step = window.innerWidth >= 768 ? 500 : 240;
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

  const handleQuickStarTap = (stars: number) => {
    if (userTapStars === 0) {
      setRatingCount((c) => c + 1);
    }
    setUserTapStars(stars);
    setNewReviewStars(stars);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() && !newReviewContent.trim()) return;

    const item: ReviewItem = {
      id: `r-${Date.now()}`,
      title: newReviewTitle.trim() || '非常好用的校园工具',
      author: newReviewAuthor.trim() || '湖工同学',
      date: '刚刚',
      rating: newReviewStars,
      content: newReviewContent.trim() || '免扫码进班和课件预览非常流畅！'
    };

    setReviews((prev) => [item, ...prev]);
    if (userTapStars === 0) {
      setRatingCount((c) => c + 1);
    }
    setUserTapStars(newReviewStars);
    setNewReviewTitle('');
    setNewReviewAuthor('');
    setNewReviewContent('');
    setReviewModalOpen(false);
  };

  const activeLightbox =
    lightboxIdx !== null ? SCREENSHOTS[lightboxIdx] : null;

  return (
    <div className="min-h-screen bg-white text-[#1C1C1E] antialiased selection:bg-[#007AFF] selection:text-white pb-16 md:pb-24">
      {/* ==================== STICKY COMPACT HEADER ON SCROLL (Mobile & PC) ==================== */}
      <div
        className={`fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#E5E5EA] transition-all duration-200 ${
          showStickyBar
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 md:px-8 h-13 flex items-center justify-between">
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

          <button
            onClick={() => setGetSheetOpen(true)}
            className="px-5 py-1 rounded-full bg-[#007AFF] hover:bg-[#0066CC] active:scale-95 text-white text-[13px] font-bold transition-all whitespace-nowrap shrink-0"
          >
            获取
          </button>
        </div>
      </div>

      {/* ==================== 1. TOP APP STORE ARTWORK BANNER ==================== */}
      <div className="relative w-full h-[168px] sm:h-[200px] md:h-[236px] bg-gradient-to-b from-[#DCE0E6] via-[#E8EBF0] to-[#F5F6F8] overflow-hidden select-none">
        <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-[#8E939E]/20 absolute top-6 left-[12%] md:left-[18%] -rotate-12" />
        <GraduationCap className="w-7 h-7 md:w-8 md:h-8 text-[#8E939E]/20 absolute top-8 right-[14%] md:right-[20%] rotate-12" />
        <Calendar className="w-6 h-6 md:w-7 md:h-7 text-[#8E939E]/20 absolute bottom-7 left-[20%] md:left-[26%] rotate-6" />
        <FileText className="w-6 h-6 md:w-7 md:h-7 text-[#8E939E]/20 absolute bottom-8 right-[15%] md:right-[22%] -rotate-6" />
        <Sparkles className="w-5 h-5 text-[#8E939E]/20 absolute top-1/3 left-[48%]" />

        <div className="max-w-[980px] mx-auto px-4 sm:px-6 md:px-8 pt-3.5 sm:pt-5 flex items-center justify-between relative z-10">
          <a
            href="https://blog.jiclub.site/2026/yuketang-deep-dive"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-black/[0.05] flex items-center justify-center text-[#1C1C1E] hover:bg-white transition-colors"
            title="返回博客"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </a>

          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-black/[0.05] flex items-center justify-center text-[#1C1C1E] hover:bg-white transition-colors"
            title="复制链接"
          >
            {copiedLink ? (
              <Check className="w-4 h-4 text-[#007AFF]" />
            ) : (
              <Share className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-3">
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

      {/* ==================== MAIN RESPONSIVE CONTAINER (Phone + Desktop) ==================== */}
      <main className="max-w-[980px] mx-auto px-4 sm:px-6 md:px-8">
        {/* ==================== 2. APP ICON + TITLE + SINGLE BLUE CTA ==================== */}
        <section className="pt-4 sm:pt-6 pb-5 sm:pb-7 flex items-stretch gap-4 sm:gap-6 md:gap-7">
          <div className="w-[96px] h-[96px] sm:w-[116px] sm:h-[116px] md:w-[136px] md:h-[136px] rounded-[22px] sm:rounded-[26px] md:rounded-[30px] bg-white border border-black/[0.08] shadow-2xs overflow-hidden shrink-0 p-1.5 sm:p-2 flex items-center justify-center">
            <img
              src={LOGO_URL}
              onError={(e) => {
                if (e.currentTarget.src !== LOGO_FALLBACK_URL) {
                  e.currentTarget.src = LOGO_FALLBACK_URL;
                }
              }}
              alt="工小湖"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-[16px] sm:rounded-[20px]"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between py-0.5 sm:py-1 min-w-0">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[22px] sm:text-[26px] md:text-[30px] font-bold tracking-tight text-[#1C1C1E] leading-tight">
                  工小湖
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-[#8E8E93] border border-[#E5E5EA] rounded px-1.5 py-0.5 leading-none">
                  4+
                </span>
              </div>
              <p className="text-[13px] sm:text-[15px] md:text-[16px] text-[#8E8E93] mt-0.5 sm:mt-1 truncate">
                雨课堂与学校教务助手
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGetSheetOpen(true)}
                  className="px-7 sm:px-8 py-1.5 sm:py-2 rounded-full bg-[#007AFF] hover:bg-[#0066CC] active:scale-95 text-white text-[15px] sm:text-[16px] font-bold tracking-tight transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  获取
                </button>
                <span className="hidden md:inline text-[12px] text-[#8E8E93]">
                  支持微信小程序 · Android 客户端
                </span>
              </div>

              <button
                onClick={handleShare}
                className="sm:hidden text-[#007AFF] p-1"
                aria-label="分享"
              >
                {copiedLink ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Share className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ==================== 3. HORIZONTAL METADATA STRIP ==================== */}
        <section className="py-3 sm:py-4 border-y border-[#E5E5EA] grid grid-cols-4 text-center select-none">
          <a href="#ratings" className="px-1 hover:opacity-80 transition-opacity">
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93] truncate">
              {ratingCount.toLocaleString()} 个评分
            </div>
            <div className="text-[18px] sm:text-[21px] font-bold text-[#8E8E93] font-mono tabular-nums leading-tight mt-0.5">
              4.9
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93] tracking-tighter mt-0.5">
              ★★★★★
            </div>
          </a>

          <div className="px-1 border-l border-[#E5E5EA]">
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93]">年龄分级</div>
            <div className="text-[18px] sm:text-[21px] font-bold text-[#8E8E93] font-mono tabular-nums leading-tight mt-0.5">
              4+
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93] mt-0.5">教育</div>
          </div>

          <div className="px-1 border-l border-[#E5E5EA]">
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93]">排行榜</div>
            <div className="text-[18px] sm:text-[21px] font-bold text-[#8E8E93] font-mono tabular-nums leading-tight mt-0.5">
              #1
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93] mt-0.5">效率</div>
          </div>

          <div className="px-1 border-l border-[#E5E5EA]">
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93]">开发者</div>
            <div className="flex justify-center my-1">
              <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-md border border-[#8E8E93] flex items-center justify-center text-[#8E8E93]">
                <User className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93] truncate">
              Cталин
            </div>
          </div>
        </section>

        {/* ==================== 4. WHAT'S NEW (新功能) ==================== */}
        <section className="py-5 sm:py-6 border-b border-[#E5E5EA] space-y-2 md:space-y-0 md:grid md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4 space-y-1">
            <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#1C1C1E]">
              新功能
            </h2>
            <div className="flex md:flex-col items-center md:items-start justify-between text-[13px] text-[#8E8E93] md:space-y-0.5">
              <span>版本 2.4.0</span>
              <span>近期更新</span>
            </div>
          </div>

          <div className="md:col-span-8 text-[14px] sm:text-[15px] text-[#1C1C1E] leading-relaxed space-y-1.5 pt-0.5 md:pt-1">
            <p className="font-medium">本次更新：</p>
            <p>- 免扫码秒进班：打开自动进入正在上课的课堂，告别抬手扫大屏。</p>
            <p>- 超时补答与草稿防丢：实时存本地草稿，支持 9 张配图与超时补交。</p>
            <p>- 百页课件流畅预览：支持双指无级缩放、习题提前查看与弹窗秒交。</p>
          </div>
        </section>

        {/* ==================== 5. PREVIEW (预览 — Touch Swipe on Mobile & Multi-Card on PC) ==================== */}
        <section className="py-6 sm:py-7 border-b border-[#E5E5EA] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#1C1C1E]">
              预览
            </h2>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scrollByStep('left')}
                className="w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] transition-colors cursor-pointer"
                aria-label="上一张"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollByStep('right')}
                className="w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] transition-colors cursor-pointer"
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
            className={`flex items-start gap-3.5 sm:gap-4 md:gap-5 overflow-x-auto pb-2 no-scrollbar select-none touch-pan-x ${
              isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab snap-x snap-mandatory sm:snap-none'
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
                className="snap-start shrink-0 w-[204px] sm:w-[224px] md:w-[238px] rounded-[22px] sm:rounded-[24px] overflow-hidden border border-black/[0.08] bg-[#F2F2F7] shadow-2xs hover:opacity-95 transition-opacity"
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

        {/* ==================== 6. RATINGS & REVIEWS (评分及评论) ==================== */}
        <section id="ratings" className="py-6 sm:py-7 border-b border-[#E5E5EA] space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#1C1C1E]">
              评分及评论
            </h2>
            <button
              onClick={() => setReviewModalOpen(true)}
              className="text-[14px] sm:text-[15px] text-[#007AFF] font-medium flex items-center gap-1 hover:opacity-80 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>撰写评论</span>
            </button>
          </div>

          {/* Score Breakdown + Tap to Rate (Responsive on Mobile & PC) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center">
            <div className="md:col-span-7 flex items-center justify-between gap-6">
              {/* Left Big Number */}
              <div className="text-center shrink-0">
                <div className="text-[52px] sm:text-[60px] font-extrabold tracking-tight text-[#1C1C1E] leading-none font-mono tabular-nums">
                  4.9
                </div>
                <div className="text-[12px] sm:text-[13px] font-semibold text-[#8E8E93] mt-1.5">
                  满分 5 分
                </div>
              </div>

              {/* Right 5-Bar Distribution */}
              <div className="flex-1 space-y-1">
                {[
                  { stars: 5, pct: '92%' },
                  { stars: 4, pct: '6%' },
                  { stars: 3, pct: '2%' },
                  { stars: 2, pct: '0%' },
                  { stars: 1, pct: '0%' }
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-2.5">
                    <div className="w-14 text-right text-[9px] text-[#8E8E93] tracking-tighter leading-none shrink-0">
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
                  {ratingCount.toLocaleString()} 个评分
                </div>
              </div>
            </div>

            {/* Tap to Rate Box (轻点评分) */}
            <div className="md:col-span-5 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-[#E5E5EA]/80 md:pl-8 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
              <span className="text-[13px] sm:text-[14px] text-[#8E8E93]">
                {userTapStars > 0 ? `已评分（${userTapStars} 星）` : '轻点评分：'}
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleQuickStarTap(star)}
                    className="p-0.5 transition-transform active:scale-125 cursor-pointer"
                    aria-label={`评分 ${star} 星`}
                  >
                    <Star
                      className={`w-6 h-6 sm:w-7 sm:h-7 ${
                        star <= userTapStars
                          ? 'fill-[#007AFF] text-[#007AFF]'
                          : 'text-[#007AFF]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Review Cards: Horizontal Swipe on Mobile, 3-Column Grid / Scroll on Desktop */}
          <div className="flex md:grid md:grid-cols-3 items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory md:snap-none touch-pan-x">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="snap-start shrink-0 w-[282px] sm:w-[310px] md:w-auto bg-[#F2F2F7] rounded-[20px] p-4 sm:p-5 flex flex-col justify-between space-y-2.5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[14px] sm:text-[15px] font-bold text-[#1C1C1E] line-clamp-1">
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

                  <p className="text-[13px] sm:text-[13.5px] text-[#3A3A3C] leading-relaxed line-clamp-4 pt-0.5">
                    {rev.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== 7. INFORMATION TABLE (信息 — Stacked on Mobile, 2-Column on PC) ==================== */}
        <section className="py-6 sm:py-7 space-y-3.5">
          <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#1C1C1E]">
            信息
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 divide-y divide-[#E5E5EA] md:divide-y-0 text-[14px]">
            <div className="py-3 md:border-b md:border-[#E5E5EA] flex items-center justify-between gap-4">
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">微信小程序</span>
              <button
                onClick={() => setGetSheetOpen(true)}
                className="text-[#007AFF] font-medium hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                微信扫码使用
              </button>
            </div>

            <div className="py-3 md:border-b md:border-[#E5E5EA] flex items-center justify-between gap-4">
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">Android 客户端</span>
              <button
                onClick={() => setGetSheetOpen(true)}
                className="text-[#007AFF] font-medium hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                v2.4.0 · 下载 APK
              </button>
            </div>

            <div className="py-3 md:border-b md:border-[#E5E5EA] flex items-center justify-between gap-4">
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">iOS 客户端</span>
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">
                正在开发构建中
              </span>
            </div>

            <div className="py-3 md:border-b md:border-[#E5E5EA] flex items-center justify-between gap-4">
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">类别</span>
              <span className="text-[#1C1C1E] whitespace-nowrap shrink-0">
                教育 / 校园效率
              </span>
            </div>

            <div className="py-3 md:border-b md:border-[#E5E5EA] flex items-center justify-between gap-4">
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">隐私保护</span>
              <span className="text-[#1C1C1E] truncate">
                本地 AES 加密存储，不留存隐私
              </span>
            </div>

            <div className="py-3 md:border-b md:border-[#E5E5EA] flex items-center justify-between gap-4">
              <span className="text-[#8E8E93] whitespace-nowrap shrink-0">开发者</span>
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

      {/* ==================== ULTRA-CLEAN "获取" MODAL (Bottom Sheet on Phone, Dialog on PC) ==================== */}
      {getSheetOpen && (
        <div
          onClick={() => setGetSheetOpen(false)}
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-[28px] sm:rounded-[28px] max-w-[400px] w-full p-6 pb-8 sm:pb-6 space-y-5 shadow-2xl"
          >
            {/* Mobile grab handle */}
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
                    v2.4.0 · 4.2 MB
                  </div>
                </div>
                <button
                  onClick={handleDownloadApk}
                  className="px-4 py-1.5 rounded-full bg-[#007AFF] hover:bg-[#0066CC] text-white text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                >
                  {apkDownloading ? '下载中...' : '下载 APK'}
                </button>
              </div>

              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-[#1C1C1E] truncate">
                    iOS 客户端
                  </div>
                  <div className="text-xs text-[#8E8E93] truncate">
                    现阶段请扫码使用小程序
                  </div>
                </div>
                <span className="text-xs text-[#8E8E93] font-medium whitespace-nowrap shrink-0">
                  正在开发构建中
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== WRITE A REVIEW MODAL (撰写评论) ==================== */}
      {reviewModalOpen && (
        <div
          onClick={() => setReviewModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmitReview}
            className="bg-white rounded-t-[28px] sm:rounded-[28px] max-w-[420px] w-full p-5 pb-8 sm:pb-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5EA] pb-3">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-[15px] text-[#007AFF] cursor-pointer"
              >
                取消
              </button>
              <span className="text-[16px] font-bold text-[#1C1C1E]">
                撰写评论
              </span>
              <button
                type="submit"
                className="text-[15px] font-bold text-[#007AFF] cursor-pointer"
              >
                发送
              </button>
            </div>

            {/* Star Selector */}
            <div className="flex flex-col items-center py-1 space-y-1">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewReviewStars(s)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        s <= newReviewStars
                          ? 'fill-[#FF9500] text-[#FF9500]'
                          : 'text-[#C7C7CC]'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs text-[#8E8E93]">轻点星级评分</span>
            </div>

            <div className="divide-y divide-[#E5E5EA] border-t border-b border-[#E5E5EA] text-sm">
              <input
                type="text"
                value={newReviewTitle}
                onChange={(e) => setNewReviewTitle(e.target.value)}
                placeholder="标题"
                className="w-full py-2.5 focus:outline-none text-[#1C1C1E] placeholder:text-[#C7C7CC]"
              />
              <input
                type="text"
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                placeholder="昵称（选填）"
                className="w-full py-2.5 focus:outline-none text-[#1C1C1E] placeholder:text-[#C7C7CC]"
              />
              <textarea
                rows={4}
                value={newReviewContent}
                onChange={(e) => setNewReviewContent(e.target.value)}
                placeholder="评论（选填）"
                className="w-full py-2.5 focus:outline-none text-[#1C1C1E] placeholder:text-[#C7C7CC] resize-none"
              />
            </div>
          </form>
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
