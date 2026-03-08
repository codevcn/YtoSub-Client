import { Link } from 'react-router-dom'

// ─── Feature card data ────────────────────────────────────────────────────────

type Feature = {
  icon: React.ReactNode
  title: string
  desc: string
}

const FEATURES: Feature[] = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Xem Video YouTube',
    desc: 'Dán URL bất kỳ từ YouTube, video phát ngay trong trang — không cần rời trình duyệt.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'Tải lên Phụ Đề .SRT',
    desc: 'Upload file .srt bất kỳ, phụ đề tự đồng bộ với timeline video theo từng giây.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
        <path d="M12 2a10 10 0 0 1 10 10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: 'Dịch Phụ Đề bằng AI',
    desc: 'Gửi video lên server, AI dịch toàn bộ phụ đề sang tiếng Việt với tiến độ realtime qua SSE streaming.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: 'Tải Kết Quả Về Máy',
    desc: 'Sau khi dịch xong, tải ngay phụ đề đã dịch (.srt), transcript gốc, và file tóm tắt nội dung.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07" />
      </svg>
    ),
    title: 'Tuỳ Chỉnh Phụ Đề',
    desc: 'Điều chỉnh vị trí dọc, cỡ chữ và độ trong suốt nền phụ đề theo sở thích của bạn.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Bản Dịch Của Tôi',
    desc: 'Truy cập lại các file đã dịch bất cứ lúc nào từ trang "Bản dịch của tôi" — không cần tải lại.',
  },
]

// ─── Feature Card ─────────────────────────────────────────────────────────────

type FeatureCardProps = Feature

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-(--main-cl)/40 hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--main-cl)_25%,transparent)] transition-all group">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-(--main-cl)/10 text-(--main-cl) group-hover:bg-(--main-cl)/20 transition-colors shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

type SectionHeaderProps = {
  tag: string
  label: string
}

function SectionHeader({ tag, label }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono font-bold text-(--main-cl) tracking-[0.18em] uppercase shrink-0">
        {tag} — {label}
      </span>
      <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
    </div>
  )
}

// ─── About Us Page ────────────────────────────────────────────────────────────

export function AboutPage() {
  return (
    <main className="px-4 mt-6 pb-8 max-w-4xl mx-auto flex flex-col gap-12">

      {/* ── Hero ── */}
      <section className="flex flex-col items-center gap-5 text-center pt-4">
        {/* Pill logo — mirrors the splash screen branding */}
        <div
          className="w-20 h-14 rounded-2xl flex items-center justify-center border-2 border-(--main-cl) bg-zinc-950"
          style={{ boxShadow: '0 0 28px 4px color-mix(in srgb, var(--main-cl) 28%, transparent)' }}
          aria-label="ytosub logo"
          role="img"
        >
          <svg width="64" height="44" viewBox="0 0 64 44" fill="none" aria-hidden="true">
            <polygon points="8,9 8,35 26,22" fill="#3cd1fe" />
            <line x1="33" y1="6" x2="33" y2="38" stroke="#3cd1fe" strokeWidth="1" strokeOpacity="0.3" />
            <rect x="38" y="13" width="19" height="4" rx="2" fill="#3cd1fe" fillOpacity="0.9" />
            <rect x="38" y="21" width="14" height="4" rx="2" fill="#3cd1fe" fillOpacity="0.6" />
            <rect x="38" y="29" width="16" height="4" rx="2" fill="#3cd1fe" fillOpacity="0.35" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h1
            className="text-4xl font-bold text-zinc-800 dark:text-zinc-50 tracking-tight"
            style={{ fontFamily: 'var(--font-app-logo-text, var(--font-heading))' }}
          >
            yto<span style={{ color: 'var(--main-cl)' }}>sub</span>
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-md">
            Xem video YouTube kèm phụ đề, dịch phụ đề tự động bằng AI — ngay trên trình duyệt.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 h-10 bg-(--main-cl) hover:bg-(--main-cl-hover) text-zinc-950 text-sm font-semibold rounded-lg transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Dùng thử ngay
          </Link>
          <Link
            to="/translate"
            className="flex items-center gap-2 px-5 h-10 border border-zinc-300 dark:border-zinc-700 hover:border-(--main-cl)/60 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm font-medium rounded-lg transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Dịch phụ đề
          </Link>
        </div>
      </section>

      {/* ── What is ytosub ── */}
      <section className="flex flex-col gap-4">
        <SectionHeader tag="01" label="Giới thiệu" />

        <div className="grid mobile:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">ytosub là gì?</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              <strong className="text-zinc-700 dark:text-zinc-200">ytosub</strong> (YouTube → Subtitle) là công cụ web
              giúp bạn xem video YouTube kèm file phụ đề{' '}
              <span className="text-(--main-cl) font-medium">.srt</span> tự upload, đồng thời tích hợp AI để{' '}
              <span className="text-(--main-cl) font-medium">dịch tự động</span> phụ đề sang tiếng Việt.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Không cần cài đặt, không cần đăng ký tài khoản — chỉ cần dán URL và bắt đầu.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Vì sao xây dựng app này?</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Rất nhiều video giáo dục, bài giảng, và nội dung hay trên YouTube không có phụ đề tiếng Việt. ytosub
              ra đời để giải quyết đúng cái gap đó — cho phép bất kỳ ai xem hiểu nội dung video{' '}
              <span className="text-(--main-cl) font-medium">mà không cần rào cản ngôn ngữ</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="flex flex-col gap-4">
        <SectionHeader tag="02" label="Tính năng" />
        <div className="grid sm:grid-cols-2 mobile:grid-cols-3 gap-3">
          {FEATURES.map(f => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="flex flex-col gap-4">
        <SectionHeader tag="03" label="Chỉ 4 bước đơn giản" />

        <div className="flex flex-col mobile:flex-row gap-0 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          {(
            [
              {
                step: '1',
                label: 'Dán link video',
                detail: 'Mở YouTube, copy đường link video bất kỳ rồi dán vào ô URL trên trang Dịch phụ đề.',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                ),
              },
              {
                step: '2',
                label: 'Nhấn "Dịch phụ đề"',
                detail: 'Chỉ cần nhấn một nút — hệ thống tự lo phần còn lại, không cần cài đặt hay thao tác thêm.',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                ),
              },
              {
                step: '3',
                label: 'Chờ AI dịch',
                detail: 'Thanh tiến độ hiện từng bước rõ ràng. Thường mất vài phút tuỳ độ dài video.',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
              },
              {
                step: '4',
                label: 'Tải về & thưởng thức',
                detail: 'Nhấn vào file đã dịch để tải về, rồi load vào player — xem video với phụ đề tiếng Việt ngay.',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                ),
              },
            ] as const
          ).map((s, i, arr) => (
            <div
              key={s.step}
              className="relative flex-1 flex flex-col gap-3 p-5 border-b mobile:border-b-0 mobile:border-r border-zinc-200 dark:border-zinc-800 last:border-0"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-(--main-cl)/10 border border-(--main-cl)/30 shrink-0 text-(--main-cl)">
                  {s.icon}
                </div>
                <span className="text-xs font-mono text-zinc-400">Bước {s.step}</span>
              </div>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{s.label}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{s.detail}</span>
              {i < arr.length - 1 && (
                <div className="hidden mobile:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-5 h-5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Why trust us ── */}
      <section className="flex flex-col gap-4">
        <SectionHeader tag="04" label="Tại sao nên dùng ytosub?" />

        <div className="grid sm:grid-cols-2 mobile:grid-cols-3 gap-3">
          {(
            [
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: 'Hoàn toàn miễn phí',
                desc: 'Không tốn tiền, không quảng cáo. Dùng thoải mái mà không lo phí ẩn.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <line x1="12" y1="6" x2="12" y2="8" />
                    <line x1="12" y1="16" x2="12" y2="18" />
                  </svg>
                ),
                title: 'Không cần cài đặt',
                desc: 'Mở trình duyệt là dùng được ngay — không cần tải app, không cần đăng ký.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                ),
                title: 'File phụ đề thật',
                desc: 'Kết quả là file .srt chuẩn, dùng được với bất kỳ trình phát video nào.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ),
                title: 'Tiếng Việt tự nhiên',
                desc: 'AI được hướng dẫn dịch sát nghĩa, tự nhiên — không phải dịch máy cứng nhắc.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
                title: 'Tiến độ minh bạch',
                desc: 'Thanh tiến độ hiện theo từng bước, bạn biết chính xác hệ thống đang làm gì.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                ),
                title: 'Dùng tốt trên điện thoại',
                desc: 'Giao diện tự co giãn — dùng thoải mái trên cả điện thoại lẫn máy tính.',
              },
            ] as const
          ).map(item => (
            <div
              key={item.title}
              className="flex flex-col gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-(--main-cl)/10 text-(--main-cl) shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{item.title}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Owner ── */}
      <section className="flex flex-col gap-4">
        <SectionHeader tag="05" label="Tác giả" />

        <div className="flex flex-col mobile:flex-row items-center mobile:items-start gap-5 p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-2 border-(--main-cl)/60"
            style={{ background: 'radial-gradient(circle at 40% 35%, color-mix(in srgb, var(--main-cl) 20%, #18181b), #18181b)' }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-(--main-cl)" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <div className="flex flex-col gap-2 text-center mobile:text-left">
            <div className="flex flex-col gap-0.5">
              <span
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-app-logo-text, var(--font-heading))', color: 'var(--main-cl)' }}
              >
                CodeVCN
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-500 font-mono">Indie Developer · Vietnam</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Xây dựng các công cụ web thiết thực, tập trung vào trải nghiệm mượt mà và hiệu năng cao. ytosub là
              dự án cá nhân sinh ra từ nhu cầu thực tế khi xem video nước ngoài mỗi ngày.
            </p>

            <div className="flex gap-3 justify-center mobile:justify-start mt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub của CodeVCN"
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-(--main-cl) transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer note ── */}
      <div className="flex flex-col items-center gap-2 text-center pb-2">
        <div className="w-8 h-px bg-(--main-cl)/30" />
        <p className="text-xs text-zinc-500">
          Made with{' '}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="inline text-(--main-cl)" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>{' '}
          by <span className="font-semibold text-zinc-400 dark:text-zinc-400">CodeVCN</span>
        </p>
      </div>

    </main>
  )
}
