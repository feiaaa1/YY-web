import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { CaseDetail, Case } from '@/types/database';
import { CATEGORY_MAP, REGION_MAP, formatDate } from '@/lib/utils';
import { CaseCard } from '@/components/CaseCard';
import {
  ArrowLeft, ExternalLink, Heart, MessageCircle, Share2, Eye,
  Sparkles, Zap, Copy, Lightbulb, Target, Megaphone,
  ChevronDown, ChevronUp, MapPin, Calendar, Tag as TagIcon
} from 'lucide-react';

const FUNNEL_MAP: Record<string, string> = {
  awareness: '品牌认知',
  consideration: '考虑决策',
  conversion: '转化行动',
};

const FUNNEL_STYLE: Record<string, React.CSSProperties> = {
  awareness: { background: 'rgba(255,105,180,0.12)', color: '#FF69B4', border: '1px solid rgba(255,105,180,0.3)' },
  consideration: { background: 'rgba(75,0,130,0.2)', color: '#c4a0e0', border: '1px solid rgba(75,0,130,0.4)' },
  conversion: { background: 'rgba(255,215,0,0.1)', color: 'var(--gold)', border: '1px solid var(--border-warm)' },
};

function ScoreRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const fill = circ - (circ * (value ?? 0)) / 100;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} strokeWidth="8" stroke="var(--border)" fill="none" />
          <circle
            cx="48" cy="48" r={r} strokeWidth="8" fill="none"
            stroke={color} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={fill}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{value ?? '-'}</span>
        </div>
      </div>
      <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}

function TagPill({ children, variant = 'gray' }: { children: React.ReactNode; variant?: 'gray' | 'indigo' | 'rose' | 'amber' | 'teal' }) {
  const styles: Record<string, React.CSSProperties> = {
    gray: { background: 'var(--ink-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    indigo: { background: 'rgba(75,0,130,0.15)', color: '#c4a0e0', border: '1px solid rgba(75,0,130,0.3)' },
    rose: { background: 'rgba(244,63,94,0.12)', color: '#fda4af', border: '1px solid rgba(244,63,94,0.25)' },
    amber: { background: 'rgba(201,168,76,0.12)', color: 'var(--gold-light)', border: '1px solid var(--border-warm)' },
    teal: { background: 'rgba(20,184,166,0.12)', color: '#5eead4', border: '1px solid rgba(20,184,166,0.25)' },
  };
  return <span className="px-3 py-1 rounded-full text-xs font-semibold" style={styles[variant]}>{children}</span>;
}

function SectionCard({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--ink-soft)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-3 px-5 md:px-7 py-4 md:py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--gold)' }}>{icon}</span>
        <h2 className="text-base md:text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>{title}</h2>
      </div>
      <div className="px-5 md:px-7 py-5 md:py-6">{children}</div>
    </section>
  );
}

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CaseDetail | null>(null);
  const [related, setRelated] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [rawExpanded, setRawExpanded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      window.scrollTo(0, 0);
      const result = await api.getCaseDetail(id);
      setData(result);
      if (result) {
        const rel = await api.getRelatedCases(id, result.content_type);
        setRelated(rel);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
        <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--ink)' }}>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>找不到该案例</h2>
        <Link to="/cases" className="text-sm font-medium" style={{ color: 'var(--gold)' }}>← 返回案例库</Link>
      </div>
    );
  }

  const analysis = data.analysis?.[0];
  const primaryMedia = data.raw_media_urls?.[0];
  const mediaGallery = (data.raw_media_urls ?? []).slice(1, 5);
  const brandFirstChar = data.brand_name?.charAt(0) ?? data.brand?.name?.charAt(0) ?? '?';
  const rawText = (data as unknown as Record<string, unknown>)['raw_text'] as string | undefined;

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>

      {/* ① Header / Hero */}
      <section id="hero">
        {/* Cover */}
        {primaryMedia && (
          <div className="w-full h-64 md:h-96 overflow-hidden relative" style={{ background: 'var(--ink-muted)' }}>
            <img
              src={primaryMedia}
              alt={data.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,0,24,0.6) 0%, rgba(13,0,24,0.1) 50%, transparent 100%)' }} />
          </div>
        )}

        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back nav */}
          <div className="pt-6 pb-2">
            <Link to="/cases" className="inline-flex items-center text-sm transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> 返回案例库
            </Link>
          </div>

          <div className="pb-10 pt-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="px-3 py-1 text-xs font-bold rounded-full" style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
                {CATEGORY_MAP[data.content_type] || data.content_type}
              </span>
              <span className="px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1" style={{ background: 'var(--ink-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                <MapPin className="w-3 h-3" /> {REGION_MAP[data.region] || data.region}
                {data.country && ` · ${data.country}`}
              </span>
              {data.is_featured && (
                <span className="px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1" style={{ background: 'linear-gradient(135deg, var(--gold-light), var(--gold))', color: 'var(--ink)' }}>
                  <Sparkles className="w-3 h-3" /> 精选
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
              {data.title_cn || data.title}
            </h1>
            {data.title_cn && (
              <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>{data.title}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              {/* Brand */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ink-muted)', borderColor: 'var(--border)' }}>
                  {data.brand?.logo_url ? (
                    <img src={data.brand.logo_url} alt="" referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{brandFirstChar}</span>
                  )}
                </div>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{data.brand_name ?? data.brand?.name ?? '未知品牌'}</span>
                {data.brand?.industry && <span style={{ color: 'var(--text-muted)' }}>· {data.brand.industry}</span>}
              </div>

              {data.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(data.published_at)}
                </span>
              )}

              {(data.source?.name_cn || data.source?.name) && (
                <span>来自 <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{data.source.name_cn || data.source.name}</span></span>
              )}

              <a
                href={data.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90 md:ml-auto"
                style={{ background: 'linear-gradient(135deg, var(--gold-light), var(--gold))', color: 'var(--ink)' }}
              >
                查看原文 <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Summary */}
            {data.summary && (
              <p className="text-base md:text-lg leading-relaxed pl-4 md:pl-5" style={{ color: 'var(--text-secondary)', borderLeft: '3px solid var(--gold)' }}>
                {data.summary}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="container mx-auto px-4 max-w-5xl pb-24 space-y-6">

        {/* ② Core Metrics */}
        <section id="metrics">
          <div className="rounded-2xl p-5 md:p-8" style={{ background: 'var(--ink-soft)', border: '1px solid var(--border-warm)' }}>
            <div className="flex flex-wrap items-center justify-around gap-6 md:gap-8">
              {/* Scores */}
              {analysis && (
                <>
                  <ScoreRing value={analysis.virality_score} label="出圈指数" color="#818cf8" />
                  <ScoreRing value={analysis.replicability_score} label="可复制性" color="#34d399" />
                  <ScoreRing value={data.quality_score} label="质量评分" color="#fbbf24" />
                </>
              )}
              {/* Engagement */}
              <div className="flex gap-4 md:gap-6">
                <div className="text-center">
                  <Eye className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--text-secondary)' }} />
                  <div className="text-xl md:text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                    {data.engagement_views != null
                      ? data.engagement_views >= 10000
                        ? `${(data.engagement_views / 10000).toFixed(1)}W`
                        : data.engagement_views.toLocaleString()
                      : '-'}
                  </div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>播放量</div>
                </div>
                <div className="text-center">
                  <Heart className="w-5 h-5 mx-auto mb-1" style={{ color: '#fda4af' }} />
                  <div className="text-xl md:text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                    {data.engagement_likes != null
                      ? data.engagement_likes >= 10000
                        ? `${(data.engagement_likes / 10000).toFixed(1)}W`
                        : data.engagement_likes.toLocaleString()
                      : '-'}
                  </div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>点赞数</div>
                </div>
                <div className="text-center">
                  <MessageCircle className="w-5 h-5 mx-auto mb-1" style={{ color: '#7dd3fc' }} />
                  <div className="text-xl md:text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{data.engagement_comments ?? '-'}</div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>评论数</div>
                </div>
                <div className="text-center">
                  <Share2 className="w-5 h-5 mx-auto mb-1" style={{ color: '#6ee7b7' }} />
                  <div className="text-xl md:text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{data.engagement_shares ?? '-'}</div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>分享数</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ③ 出圈原因分析 */}
        {analysis && (
          <SectionCard id="virality" title="出圈原因分析" icon={<Zap className="w-5 h-5" />}>
            {/* Virality reasons — visual hero */}
            {analysis.virality_reasons?.length > 0 && (
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#FF69B4' }}>核心出圈原因</p>
                <div className="space-y-3">
                  {analysis.virality_reasons.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-4 rounded-xl p-4"
                      style={{ background: 'rgba(75,0,130,0.1)', border: '1px solid rgba(75,0,130,0.25)' }}
                    >
                      <span className="flex-shrink-0 w-7 h-7 rounded-full text-sm font-black flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
                        {i + 1}
                      </span>
                      <p className="font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>{r}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analysis.emotional_triggers?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>情感触点</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.emotional_triggers.map((t, i) => <TagPill key={i} variant="rose">{t}</TagPill>)}
                  </div>
                </div>
              )}
              {analysis.spread_mechanism?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>传播机制</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.spread_mechanism.map((t, i) => <TagPill key={i} variant="indigo">{t}</TagPill>)}
                  </div>
                </div>
              )}
              {analysis.timing_factors?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>时机因素</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.timing_factors.map((t, i) => <TagPill key={i} variant="amber">{t}</TagPill>)}
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        )}

        {/* ④ 创意拆解 */}
        {analysis && (
          <SectionCard id="creative" title="创意拆解" icon={<Sparkles className="w-5 h-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.creative_technique?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>创意手法</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.creative_technique.map((t, i) => <TagPill key={i} variant="teal">{t}</TagPill>)}
                  </div>
                </div>
              )}
              {analysis.hook_type && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>钩子类型</p>
                  <TagPill variant="rose">{analysis.hook_type}</TagPill>
                </div>
              )}
              {analysis.differentiation && (
                <div className="md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>差异化卖点</p>
                  <p className="text-sm leading-relaxed rounded-xl p-4" style={{ color: 'var(--text-secondary)', background: 'var(--ink-muted)', border: '1px solid var(--border)' }}>{analysis.differentiation}</p>
                </div>
              )}
              {analysis.platform_fit_reason && (
                <div className="md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>平台适配原因</p>
                  <p className="text-sm leading-relaxed rounded-xl p-4" style={{ color: 'var(--text-secondary)', background: 'var(--ink-muted)', border: '1px solid var(--border)' }}>{analysis.platform_fit_reason}</p>
                </div>
              )}
            </div>
          </SectionCard>
        )}

        {/* ⑤ 营销策略 */}
        {analysis && (
          <SectionCard id="strategy" title="营销策略" icon={<Target className="w-5 h-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analysis.target_audience?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>目标人群</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.target_audience.map((t, i) => <TagPill key={i}>{t}</TagPill>)}
                  </div>
                </div>
              )}
              {analysis.funnel_stage && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>漏斗阶段</p>
                  <span className="px-4 py-2 rounded-xl text-sm font-bold" style={FUNNEL_STYLE[analysis.funnel_stage] || { background: 'var(--ink-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    {FUNNEL_MAP[analysis.funnel_stage] || analysis.funnel_stage}
                  </span>
                </div>
              )}
              {analysis.cta_strategy && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>CTA 策略</p>
                  <p className="text-sm leading-relaxed rounded-xl p-3" style={{ color: 'var(--text-secondary)', background: 'var(--ink-muted)', border: '1px solid var(--border)' }}>{analysis.cta_strategy}</p>
                </div>
              )}
            </div>
          </SectionCard>
        )}

        {/* ⑥ 可借鉴要素 */}
        {analysis && (
          <SectionCard id="takeaways" title="可借鉴要素" icon={<Lightbulb className="w-5 h-5" />}>
            {/* Key takeaways — hero layout */}
            {analysis.key_takeaways?.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--gold)' }}>关键启示</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.key_takeaways.map((t, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl p-4" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid var(--border-warm)' }}>
                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.applicable_industries?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>适用行业</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.applicable_industries.map((t, i) => <TagPill key={i} variant="indigo">{t}</TagPill>)}
                  </div>
                </div>
              )}
              {analysis.applicable_scenarios?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>适用场景</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.applicable_scenarios.map((t, i) => <TagPill key={i} variant="teal">{t}</TagPill>)}
                  </div>
                </div>
              )}
              {analysis.replicability_notes && (
                <div className="md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>可复制性说明</p>
                  <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: 'var(--ink-muted)', border: '1px solid var(--border)' }}>
                    <Copy className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{analysis.replicability_notes}</p>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        )}

        {/* ⑦ 原始内容 */}
        {(rawText || mediaGallery.length > 0) && (
          <SectionCard id="raw-content" title="原始内容" icon={<Megaphone className="w-5 h-5" />}>
            {/* Gallery */}
            {mediaGallery.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {mediaGallery.map((url, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden" style={{ background: 'var(--ink-muted)' }}>
                    <img
                      src={url}
                      alt={`媒体素材 ${i + 2}`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Raw text collapsible */}
            {rawText && (
              <div>
                <div className={`text-sm leading-relaxed overflow-hidden transition-all duration-300 ${rawExpanded ? '' : 'max-h-32'}`} style={{ color: 'var(--text-secondary)' }}>
                  <p className="whitespace-pre-wrap">{rawText}</p>
                </div>
                <button
                  onClick={() => setRawExpanded(v => !v)}
                  className="mt-3 flex items-center gap-1 text-sm font-semibold hover:underline"
                  style={{ color: 'var(--gold)' }}
                >
                  {rawExpanded ? <><ChevronUp className="w-4 h-4" /> 收起</> : <><ChevronDown className="w-4 h-4" /> 展开全文</>}
                </button>
              </div>
            )}
          </SectionCard>
        )}

        {/* ⑧ 标签 & 相关推荐 */}
        <section id="tags-related">
          {/* Tags */}
          {data.tags?.length > 0 && (
            <div className="rounded-2xl p-7 mb-6" style={{ background: 'var(--ink-soft)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <TagIcon className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>标签</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.tags.map(({ tag }, i) => (
                  <Link
                    key={i}
                    to={`/cases?tag=${tag.name}`}
                    className="px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200"
                    style={{ background: 'var(--ink-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-warm)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    }}
                  >
                    {tag.name_cn || tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Cases */}
          {related.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>相关案例</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {related.map((c, i) => (
                  <CaseCard key={c.id} caseData={c} index={i} />
                ))}
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
