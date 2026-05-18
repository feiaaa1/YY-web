import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Case } from '@/types/database';
import { CaseCard } from '@/components/CaseCard';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HOT_SEARCHES = [
  { label: '瑞幸联名', href: '/cases?q=瑞幸' },
  { label: 'Nike', href: '/cases?q=Nike' },
  { label: '视频广告', href: '/cases?type=video_ad' },
  { label: '整合营销', href: '/cases?type=integrated_campaign' },
];

export default function HomePage() {
  const [featuredCases, setFeaturedCases] = useState<Case[]>([]);
  const [trendingCases, setTrendingCases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [featured, trending] = await Promise.all([
        api.getCases({ is_featured: true, order: 'published_at', limit: 3 }),
        api.getCases({ order: 'engagement_views', limit: 6 }),
      ]);
      setFeaturedCases(featured.data);
      setTrendingCases(trending.data);
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cases?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <section
        className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden"
        style={{ background: 'var(--ink)' }}
      >
        {/* 晚霞渐变背景光晕 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,127,80,0.18) 0%, rgba(255,105,180,0.12) 40%, rgba(75,0,130,0.08) 70%, transparent 100%)',
          }}
        />

        {/* 网格线 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="container relative z-10 mx-auto px-6 lg:px-8 pt-20 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <span
                className="h-px w-8"
                style={{ background: 'var(--gradient-dawn)', backgroundImage: 'linear-gradient(90deg, #FF69B4, #FFD700)' }}
              />
              <span
                className="text-xs font-mono-custom tracking-[0.2em] uppercase"
                style={{ background: 'linear-gradient(90deg, #FF69B4, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'DM Mono, monospace' }}
              >
                专属丫丫大王
              </span>
              <span
                className="h-px w-8"
                style={{ backgroundImage: 'linear-gradient(90deg, #FFD700, #FF69B4)' }}
              />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display mb-6 leading-[1.1]"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2rem, 7vw, 5.5rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
              }}
            >
              为你收集全世界的
              <br />
              <em
                style={{
                  display: 'inline-block',
                  fontStyle: 'italic',
                  background: 'linear-gradient(135deg, #FF69B4 0%, #FF7F50 50%, #FFD700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                营销灵感
              </em>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              丫丫大王，这里有全球最好的营销案例，
              每一个都是我精心为你挑选的。
              希望能给你带来一点点灵感，和很多很多的爱。
            </motion.p>

            {/* Search */}
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto"
            >
              <div
                className="flex items-center rounded-full overflow-hidden transition-all duration-300"
                style={{
                  border: '1px solid var(--border-warm)',
                  background: 'rgba(245, 240, 232, 0.04)',
                }}
                onFocus={() => {}}
              >
                <svg
                  className="ml-5 flex-shrink-0"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  className="flex-1 py-4 px-4 outline-none bg-transparent text-base"
                  style={{
                    color: 'var(--text-primary)',
                    caretColor: 'var(--dawn-coral)',
                  }}
                  placeholder="丫丫大王想找什么灵感？"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="mr-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #FF7F50, #FFD700)',
                    color: 'var(--dawn-violet-muted)',
                  }}
                >
                  搜索
                </button>
              </div>

              <div className="mt-4 flex flex-wrap justify-center items-center gap-x-3 gap-y-2">
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}
                >
                  热门:
                </span>
                {HOT_SEARCHES.map((s) => (
                  <Link
                    key={s.href}
                    to={s.href}
                    className="text-xs px-3 py-1 rounded-full border transition-all duration-200 hover:border-opacity-60"
                    style={{
                      color: 'var(--text-secondary)',
                      borderColor: 'var(--border)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-warm)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    }}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </motion.form>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--ink))' }}
        />
      </section>

      {/* Featured Section */}
      <section
        id="featured-cases"
        className="py-16 md:py-24"
        style={{ background: 'var(--ink-soft)' }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeader
            label="编辑精选"
            title="顶尖案例"
            subtitle="为丫丫大王精心挑选，最具影响力和创意水准的顶尖案例"
            href="/cases"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCases.map((c, i) => (
              <CaseCard key={c.id} caseData={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section
        id="trending-cases"
        className="py-16 md:py-24"
        style={{ background: 'var(--ink)' }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeader
            label="热度飙升"
            title="热门案例"
            subtitle="丫丫大王，这些是全网最火的，你一定会喜欢的"
            href="/cases?order=engagement_views"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCases.map((c, i) => (
              <CaseCard key={`trending-${c.id}`} caseData={c} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  label,
  title,
  subtitle,
  href,
}: {
  label: string;
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <div className="flex items-start justify-between mb-8 md:mb-12 gap-4">
      <div>
        <div
          className="flex items-center gap-2 mb-3"
        >
          <span
            className="h-px w-6"
            style={{ background: 'var(--gold)' }}
          />
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace' }}
          >
            {label}
          </span>
        </div>
        <h2
          className="text-2xl md:text-4xl font-bold mb-2"
          style={{
            fontFamily: 'Playfair Display, serif',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {subtitle}
        </p>
      </div>
      <Link
        to={href}
        className="flex-shrink-0 flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 group mt-1"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
      >
        <span className="hidden sm:inline">查看全部</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
