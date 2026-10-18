export interface MottoItem {
  id: string;
  quote: string;
  author: string;
  work?: string;
  bgTheme: string;
}

export interface SlideItem {
  page: number;
  title: string;
  subtitle: string;
  category: 'lecture' | 'quiz_choice' | 'quiz_subjective';
  bullets: string[];
  diagramType: 'bgp_as' | 'igp_egp' | 'rip_distance' | 'python_try' | 'python_branch' | 'python_loop' | 'subjective_p178';
  realScreenshot?: string;
  confusedCount: number;
  starred: boolean;
}

export interface QuizItem {
  id: string;
  courseId: 'net' | 'python';
  page: number;
  type: '单选题' | '多选题' | '主观题';
  score: number;
  status: 'unpublished' | 'published' | 'timeout_makeup' | 'submitted';
  question: string;
  codeSnippet?: string;
  options?: { label: string; text: string }[];
  correctAnswer?: string;
  userAnswer?: string;
  submittedAt?: string;
  realScreenshot?: string;
}

export interface CourseScheduleItem {
  id: string;
  name: string;
  teacher: string;
  room: string;
  timeRange: string;
  section: string;
  weekday: number; // 1-7
  status: 1 | 0; // 1 = 上课中 (live), 0 = 未开课
  totalSlides: number;
  currentSlide: number;
  colorClass: string;
}

export interface GradeItem {
  id: string;
  semester: string;
  courseName: string;
  credit: number;
  score: number;
  gpa: number;
  type: '必修' | '专业核心' | '选修';
  makeupWarning: boolean;
}

export const MOTTO_LIST: MottoItem[] = [
  {
    id: 'camus',
    quote: '世上的罪恶差不多总是由愚昧无知造成的。没有见识的善良愿望会同罪恶带来同样多的损害。人总是好的比坏的多，实际问题并不在这里，但人的无知程度却有高低的差别。如果没有真知灼见，也就没有真正的善良和崇高的仁爱。',
    author: '加缪',
    work: '《鼠疫》',
    bgTheme: 'from-[#2A1B3D] via-[#3B2645] to-[#1F1A24]'
  },
  {
    id: 'songxiaojun',
    quote: '理想主义，无非是多一些耐力和多一点勇敢。安于现状那是别人的生活方式，我不羡慕，也不喜欢。人总得追求点什么，路上要承担失去，要享受伤感。山在那里，我正年轻，我得去看看。',
    author: '宋小君',
    bgTheme: 'from-[#182B3A] via-[#2C3E50] to-[#3A2E39]'
  },
  {
    id: 'wangxiaobo',
    quote: '似水流年是一个人所有的一切，只有这个东西，才真正归你所有。其余的一切，都是片刻的欢娱和不幸，转眼间就已跑到那似水流年里去了。',
    author: '王小波',
    work: '《似水流年》',
    bgTheme: 'from-[#1A2F38] via-[#243B47] to-[#152228]'
  }
];

export const COMPUTER_NETWORK_SLIDES: SlideItem[] = [
  {
    page: 132,
    title: '主观简答题 · P178-2',
    subtitle: '第 4 章 网络层 · 自治系统与路由聚合计算 (10分)',
    category: 'quiz_subjective',
    bullets: [
      '已知自治系统 AS65001 拥有地址块 194.24.0.0/21 至 194.24.16.0/20',
      '1. 请计算经 BGP-4 边界路由器 R1 聚合后的最长前缀 CIDR 路由表项',
      '2. 若倒计时归零，工小湖客户端将自动切换为「可补交」状态并保留本地草稿'
    ],
    diagramType: 'subjective_p178',
    realScreenshot: '/blog-assets/03_quiz_timeout_makeup.png',
    confusedCount: 8,
    starred: true
  },
  {
    page: 146,
    title: '因特网有两大类路由选择协议',
    subtitle: '湖南工学院 · 计算机网络 第 4 章 网络层',
    category: 'lecture',
    bullets: [
      '内部网关协议 IGP (Interior Gateway Protocol)：在一个自治系统内部使用的路由选择协议，如 RIP 和 OSPF 协议。',
      '外部网关协议 EGP (Exterior Gateway Protocol)：若源站和目的站处在不同的自治系统中，使用域间路由选择，如 BGP-4。'
    ],
    diagramType: 'igp_egp',
    confusedCount: 2,
    starred: false
  },
  {
    page: 147,
    title: '自治系统和内部网关协议、外部网关协议',
    subtitle: '湖南工学院 · 域间路由选择 (interdomain) 与域内路由选择 (intradomain)',
    category: 'lecture',
    bullets: [
      '自治系统 A 内部：用内部网关协议（例如，RIP）',
      '自治系统 A (R1) <---> 自治系统 B (R2)：用外部网关协议（例如，BGP-4）',
      '自治系统 B 内部：用内部网关协议（例如，OSPF）',
      '自治系统之间的路由选择也叫做域间路由选择 (interdomain routing)，在自治系统内部的路由选择叫做域内路由选择 (intradomain routing)'
    ],
    diagramType: 'bgp_as',
    realScreenshot: '/blog-assets/05_slides_bgp_preview.png',
    confusedCount: 5,
    starred: true
  },
  {
    page: 148,
    title: '这里要指出两点：网关与路由器术语演进',
    subtitle: '湖南工学院 · RFC 历史标准与现代路由体系',
    category: 'lecture',
    bullets: [
      '因特网早期的 RFC 文档中未使用“路由器”而使用“网关”这一名词。但新的 RFC 文档中又改用了“路由器”这一名词。',
      'IGP 和 EGP 等协议类别的名称仍保留使用，体现协议设计的历史连续性。'
    ],
    diagramType: 'igp_egp',
    confusedCount: 1,
    starred: false
  },
  {
    page: 149,
    title: '因特网的路由选择协议分类总览',
    subtitle: '湖南工学院 · IGP 与 EGP 协议栈对比',
    category: 'lecture',
    bullets: [
      '内部网关协议 IGP：具体的协议有多种，如 RIP（基于距离向量）和 OSPF（基于链路状态）等。',
      '外部网关协议 EGP：目前使用的协议就是 BGP-4（边界网关协议第 4 版）。'
    ],
    diagramType: 'bgp_as',
    confusedCount: 3,
    starred: false
  },
  {
    page: 150,
    title: '4.5.2 内部网关协议 RIP (Routing Information Protocol)',
    subtitle: '湖南工学院 · 分布式基于距离向量的路由选择协议',
    category: 'lecture',
    bullets: [
      '1. 工作原理：RIP 是一种分布式的基于距离向量的路由选择协议。',
      'RIP 协议要求网络中的每一个路由器都要维护从它自己到其他每一个目的网络的距离记录（跳数 Hop Count，最大为 15，16 表示不可达）。'
    ],
    diagramType: 'rip_distance',
    confusedCount: 4,
    starred: true
  }
];

export const PYTHON_COURSE_SLIDES: SlideItem[] = [
  {
    page: 15,
    title: '单选题 · 分支结构缩进判定',
    subtitle: 'Python程序设计 · 第 3 章 程序的控制结构 (5分)',
    category: 'quiz_choice',
    bullets: [
      '用来判断当前 Python 语句在分支结构中的是 ()',
      'A. 引号   B. 冒号   C. 大括号   D. 缩进'
    ],
    diagramType: 'python_branch',
    confusedCount: 1,
    starred: false
  },
  {
    page: 24,
    title: '单选题 · while 循环折半运行次数',
    subtitle: 'Python程序设计 · 第 3 章 循环控制结构 (5分)',
    category: 'quiz_choice',
    bullets: [
      '给出下面代码：k=10000; while k>1: print(k); k=k/2',
      '上述程序的运行次数是：A. 14   B. 1000   C. 15   D. 13'
    ],
    diagramType: 'python_loop',
    confusedCount: 6,
    starred: true
  },
  {
    page: 32,
    title: '单选题 · range(1, 10, 2) 步长遍历输出',
    subtitle: 'Python程序设计 · 第 3 章 for 循环与迭代器 (5分)',
    category: 'quiz_choice',
    bullets: [
      '下面代码的输出结果是 ()',
      'for i in range(1, 10, 2): print(i, end=",")'
    ],
    diagramType: 'python_loop',
    confusedCount: 2,
    starred: false
  },
  {
    page: 42,
    title: '3.3.1 try语句 · 异常捕获机制',
    subtitle: 'Python程序设计 · 1、try...except语句语法格式与执行流程',
    category: 'lecture',
    bullets: [
      '语法格式：try: 语句块A  except: 语句块B',
      '执行流程：执行语句块A，如果触发异常，则跳转到语句块B执行；若未触发异常则直接结束。',
      '随堂伴随单选：下面语句中可以帮助用户快速定位到异常的语句是 ()'
    ],
    diagramType: 'python_try',
    realScreenshot: '/blog-assets/06_quiz_list_python.png',
    confusedCount: 3,
    starred: true
  },
  {
    page: 43,
    title: '3.3.1 try语句 · 特定异常类型捕获',
    subtitle: 'Python程序设计 · ZeroDivisionError 与 ValueError 处理',
    category: 'lecture',
    bullets: [
      '支持针对特定异常类型做精细分支捕获：except ZeroDivisionError:',
      '避免裸 except 吞掉系统退出信号或键盘中断信号。'
    ],
    diagramType: 'python_try',
    confusedCount: 2,
    starred: false
  },
  {
    page: 44,
    title: '3.3.2 try...except...else...finally 完整结构',
    subtitle: 'Python程序设计 · 资源释放与无异常分支',
    category: 'lecture',
    bullets: [
      'else 子句：当 try 块没有抛出任何异常时执行。',
      'finally 子句：无论是否发生异常都会执行，常用于关闭文件句柄或网络连接。'
    ],
    diagramType: 'python_try',
    confusedCount: 4,
    starred: false
  }
];

export const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: 'q-net-132',
    courseId: 'net',
    page: 132,
    type: '主观题',
    score: 10,
    status: 'timeout_makeup',
    question: 'P178-2：设自治系统 AS65001 与 AS65002 通过边界路由器 R1、R2 建立 eBGP 邻接关系。请写出 R1 向 R2 通告聚合路由 194.24.0.0/19 时的 BGP 核心路径属性（AS_PATH、NEXT_HOP、ORIGIN），并附上子网聚合演算过程。',
    realScreenshot: '/blog-assets/03_quiz_timeout_makeup.png',
    userAnswer: '1. 地址块 194.24.0.0/21 与 194.24.8.0/21、194.24.16.0/20 在前 19 位完全相同，聚合后 CIDR 为 194.24.0.0/19（子网掩码 255.255.224.0）。\n2. eBGP 通告属性：AS_PATH = [65001]，NEXT_HOP = R1 接口 IP，ORIGIN = IGP。'
  },
  {
    id: 'q-net-147',
    courseId: 'net',
    page: 147,
    type: '单选题',
    score: 5,
    status: 'published',
    question: '在因特网的层次路由体系中，自治系统（AS）之间的路由选择被称为域间路由选择，当前因特网标准使用的外部网关协议（EGP）是（）。',
    options: [
      { label: 'A', text: 'RIP (Routing Information Protocol)' },
      { label: 'B', text: 'OSPF (Open Shortest Path First)' },
      { label: 'C', text: 'BGP-4 (Border Gateway Protocol)' },
      { label: 'D', text: 'IGRP (Interior Gateway Routing Protocol)' }
    ],
    correctAnswer: 'C'
  },
  {
    id: 'q-py-42',
    courseId: 'python',
    page: 42,
    type: '单选题',
    score: 5,
    status: 'published',
    question: '下面语句中可以帮助用户快速定位到异常的语句是()。',
    options: [
      { label: 'A', text: 'try-except 语句' },
      { label: 'B', text: 'if语句' },
      { label: 'C', text: 'for循环语句' },
      { label: 'D', text: 'eval语句' }
    ],
    correctAnswer: 'A',
    realScreenshot: '/blog-assets/07_quiz_single_choice.png'
  },
  {
    id: 'q-py-15',
    courseId: 'python',
    page: 15,
    type: '单选题',
    score: 5,
    status: 'unpublished',
    question: '用来判断当前 Python 语句在分支结构中的是()',
    options: [
      { label: 'A', text: '引号' },
      { label: 'B', text: '冒号' },
      { label: 'C', text: '大括号' },
      { label: 'D', text: '缩进' }
    ],
    correctAnswer: 'D'
  },
  {
    id: 'q-py-16',
    courseId: 'python',
    page: 16,
    type: '单选题',
    score: 5,
    status: 'unpublished',
    question: '关于 Python 的分支结构,以下选项中描述错误的是()',
    options: [
      { label: 'A', text: 'Python 中 if-elif-else 语句描述多分支结构' },
      { label: 'B', text: '分支结构使用 if 保留字' },
      { label: 'C', text: 'Python 中 if-else 语句用来形成二分支结构' },
      { label: 'D', text: '分支结构可以向已经执行过的语句部分跳转' }
    ],
    correctAnswer: 'D'
  },
  {
    id: 'q-py-24',
    courseId: 'python',
    page: 24,
    type: '单选题',
    score: 5,
    status: 'unpublished',
    question: '给出下面代码: k=10000 while k>1: print(k) k=k/2 上述程序的运行次数是:',
    codeSnippet: 'k = 10000\nwhile k > 1:\n    print(k)\n    k = k / 2',
    options: [
      { label: 'A', text: '14' },
      { label: 'B', text: '1000' },
      { label: 'C', text: '15' },
      { label: 'D', text: '13' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 'q-py-32',
    courseId: 'python',
    page: 32,
    type: '单选题',
    score: 5,
    status: 'unpublished',
    question: '下面代码的输出结果是() for i in range(1,10,2): print(i,end=",")',
    codeSnippet: 'for i in range(1, 10, 2):\n    print(i, end=",")',
    options: [
      { label: 'A', text: '1,4,' },
      { label: 'B', text: '1,4,7,' },
      { label: 'C', text: '1,3,5,7,9,' },
      { label: 'D', text: '1,3,' }
    ],
    correctAnswer: 'C'
  },
  {
    id: 'q-py-33',
    courseId: 'python',
    page: 33,
    type: '单选题',
    score: 5,
    status: 'unpublished',
    question: '给出如下代码: sum=0; for i in range(1,11): sum += i; print(sum) 以下选项中描述正确的是()',
    options: [
      { label: 'A', text: '循环体语句一共执行了 11 次' },
      { label: 'B', text: '输出结果为 55' },
      { label: 'C', text: 'range(1,11) 包含数字 11' },
      { label: 'D', text: '如果将 for 换成 while 结构无法实现同样功能' }
    ],
    correctAnswer: 'B'
  }
];

export const COURSE_SCHEDULE: CourseScheduleItem[] = [
  {
    id: 'net',
    name: '计算机网络',
    teacher: '陈建国 教授',
    room: '2609(多媒体)',
    timeRange: '10:25-12:00',
    section: '第1节 · 上课中',
    weekday: 1,
    status: 1,
    totalSlides: 230,
    currentSlide: 147,
    colorClass: 'bg-blue-600'
  },
  {
    id: 'python',
    name: 'Python程序设计',
    teacher: '林志远 副教授',
    room: '3402(机房)',
    timeRange: '14:00-15:35',
    section: '第3节 · 待开课',
    weekday: 1,
    status: 1,
    totalSlides: 68,
    currentSlide: 42,
    colorClass: 'bg-indigo-600'
  },
  {
    id: 'os',
    name: '操作系统原理',
    teacher: '周明华 教授',
    room: '2405(多媒体)',
    timeRange: '08:30-10:05',
    section: '第1-2节',
    weekday: 2,
    status: 0,
    totalSlides: 185,
    currentSlide: 88,
    colorClass: 'bg-teal-600'
  },
  {
    id: 'ds',
    name: '数据结构与算法',
    teacher: '王晓峰 讲师',
    room: '2501(多媒体)',
    timeRange: '10:25-12:00',
    section: '第3-4节',
    weekday: 3,
    status: 0,
    totalSlides: 210,
    currentSlide: 112,
    colorClass: 'bg-emerald-600'
  },
  {
    id: 'prob',
    name: '概率论与数理统计',
    teacher: '刘芳 副教授',
    room: '1308(阶梯教室)',
    timeRange: '16:00-17:35',
    section: '第7-8节',
    weekday: 4,
    status: 0,
    totalSlides: 156,
    currentSlide: 64,
    colorClass: 'bg-amber-600'
  },
  {
    id: 'db',
    name: '数据库系统概论',
    teacher: '赵鹏 副教授',
    room: '3209(多媒体)',
    timeRange: '08:30-10:05',
    section: '第1-2节',
    weekday: 5,
    status: 0,
    totalSlides: 192,
    currentSlide: 95,
    colorClass: 'bg-slate-700'
  }
];

export const STUDENT_GRADES: GradeItem[] = [
  { id: 'g1', semester: '2026-2027-1', courseName: '计算机网络', credit: 4.0, score: 94, gpa: 4.4, type: '专业核心', makeupWarning: false },
  { id: 'g2', semester: '2026-2027-1', courseName: 'Python程序设计', credit: 3.0, score: 96, gpa: 4.6, type: '必修', makeupWarning: false },
  { id: 'g3', semester: '2026-2027-1', courseName: '操作系统原理', credit: 4.0, score: 89, gpa: 3.9, type: '专业核心', makeupWarning: false },
  { id: 'g4', semester: '2026-2027-1', courseName: '数据结构与算法', credit: 4.5, score: 92, gpa: 4.2, type: '专业核心', makeupWarning: false },
  { id: 'g5', semester: '2026-2027-1', courseName: '概率论与数理统计', credit: 3.5, score: 86, gpa: 3.6, type: '必修', makeupWarning: false },
  { id: 'g6', semester: '2025-2026-2', courseName: '离散数学', credit: 3.5, score: 91, gpa: 4.1, type: '必修', makeupWarning: false }
];

export const PYTHON_LONG_POLLING_CODE = `import httpx
from typing import Optional, Dict, Any

class RainClassroomAuthService:
    """雨课堂扫码登录长轮询服务"""

    def __init__(self, base_url: str = "https://changjiang.ykt.io") -> None:
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=35.0)

    async def poll_auth_status(self, ticket: str) -> Optional[Dict[str, Any]]:
        """
        保持30秒阻塞长连接，监听微信扫码授权状态
        :param ticket: 二维码生成时获得的票据
        :return: 授权成功的凭据字典，超时或失败返回 None
        """
        url = f"{self.base_url}/custom/auth/v1/auth/status"
        params = {"ticket": ticket, "format": "json"}

        try:
            # NOTE: 保持长连接挂起，扫码确认瞬间立即触发返回，实现0延迟跳转
            resp = await self.client.get(url, params=params)
            resp.raise_for_status()
            res_data = resp.json()

            if res_data.get("data", {}).get("status") == "success":
                return {
                    "userId": res_data["data"]["user_id"],
                    "sessionKey": res_data["data"]["session_key"],
                }
            return None
        except httpx.RequestError:
            return None`;

export const ANDROID_KOTLIN_SERVICE_CODE = `package site.jiclub.gongxiaohu.service

import android.app.Notification
import android.app.Service
import android.content.Intent
import android.os.IBinder
import kotlinx.coroutines.*
import okhttp3.OkHttpClient
import okhttp3.Request
import java.util.concurrent.TimeUnit

class RainClassroomGuardService : Service() {
    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    
    // 35秒超时配置，适配工小湖无状态网关30秒长轮询与实时开课嗅探
    private val httpClient = OkHttpClient.Builder()
        .readTimeout(35, TimeUnit.SECONDS)
        .connectTimeout(10, TimeUnit.SECONDS)
        .build()

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForeground(1001, buildLiveCourseNotification("正在守护雨课堂与教务会话..."))
        serviceScope.launch {
            observeActiveClassesLoop()
        }
        return START_STICKY
    }

    private suspend fun observeActiveClassesLoop() {
        while (currentCoroutineContext().isActive) {
            // 1. 调 get_user_course_list 查课表，过滤 status == 1 的正在上课课堂
            // 2. 使用本地 AES-GCM 加密存储的 session_key 直接换取课堂凭据秒进班
            // 3. 若开启「自动签到：开课立即签」，毫秒级自动完成签到并推送灵动通知
            delay(15_000L)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}`;
