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

const FUNNEL_COLOR: Record<string, string> = {
  awareness: 'bg-sky-50 text-sky-700 border-sky-200',
  consideration: 'bg-violet-50 text-violet-700 border-violet-200',
  conversion: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function ScoreRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const fill = circ - (circ * (value ?? 0)) / 100;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} strokeWidth="8" className="stroke-gray-100" fill="none" />
          <circle
            cx="48" cy="48" r={r} strokeWidth="8" fill="none"
            stroke={color} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={fill}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-gray-900">{value ?? '-'}</span>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-500">{label}</span>
    </div>
  );
}

function TagPill({ children, variant = 'gray' }: { children: React.ReactNode; variant?: 'gray' | 'indigo' | 'rose' | 'amber' | 'teal' }) {
  const cls = {
    gray: 'bg-gray-100 text-gray-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    rose: 'bg-rose-50 text-rose-700',
    amber: 'bg-amber-50 text-amber-700',
    teal: 'bg-teal-50 text-teal-700',
  }[variant];
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{children}</span>;
}

function SectionCard({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-7 py-5 border-b border-gray-100">
        <span className="text-indigo-600">{icon}</span>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <div className="px-7 py-6">{children}</div>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">找不到该案例</h2>
        <Link to="/cases" className="text-indigo-600 hover:underline font-medium">← 返回案例库</Link>
      </div>
    );
  }

  const analysis = data.analysis?.[0];
  const primaryMedia = data.raw_media_urls?.[0];
  const mediaGallery = (data.raw_media_urls ?? []).slice(1, 5);
  const brandFirstChar = data.brand_name?.charAt(0) ?? data.brand?.name?.charAt(0) ?? '?';
  const rawText = (data as unknown as Record<string, unknown>)['raw_text'] as string | undefined;

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ① Header / Hero */}
      <section id="hero">
        {/* Cover */}
        {primaryMedia && (
          <div className="w-full h-64 md:h-96 bg-gray-200 overflow-hidden relative">
            <img
              src={primaryMedia}
              alt={data.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
        )}

        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back nav */}
          <div className="pt-6 pb-2">
            <Link to="/cases" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> 返回案例库
            </Link>
          </div>

          <div className="pb-10 pt-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                {CATEGORY_MAP[data.content_type] || data.content_type}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {REGION_MAP[data.region] || data.region}
                {data.country && ` · ${data.country}`}
              </span>
              {data.is_featured && (
                <span className="px-3 py-1 bg-amber-400 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> 精选
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
              {data.title_cn || data.title}
            </h1>
            {data.title_cn && (
              <p className="text-lg text-gray-500 mb-6">{data.title}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-8">
              {/* Brand */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {data.brand?.logo_url ? (
                    <img src={data.brand.logo_url} alt="" referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <span className="text-sm font-bold text-gray-400">{brandFirstChar}</span>
                  )}
                </div>
                <span className="font-semibold text-gray-800">{data.brand_name ?? data.brand?.name ?? '未知品牌'}</span>
                {data.brand?.industry && <span className="text-gray-400">· {data.brand.industry}</span>}
              </div>

              {data.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(data.published_at)}
                </span>
              )}

              {(data.source?.name_cn || data.source?.name) && (
                <span>来自 <span className="font-medium text-gray-700">{data.source.name_cn || data.source.name}</span></span>
              )}

              <a
                href={data.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                查看原文 <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Summary */}
            {data.summary && (
              <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-indigo-400 pl-5">
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
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-2xl p-8 text-white">
            <div className="flex flex-wrap items-center justify-around gap-8">
              {/* Scores */}
              {analysis && (
                <>
                  <ScoreRing value={analysis.virality_score} label="出圈指数" color="#818cf8" />
                  <ScoreRing value={analysis.replicability_score} label="可复制性" color="#34d399" />
                  <ScoreRing value={data.quality_score} label="质量评分" color="#fbbf24" />
                </>
              )}
              {/* Engagement */}
              <div className="flex gap-6">
                <div className="text-center">
                  <Eye className="w-5 h-5 mx-auto mb-1 text-indigo-300" />
                  <div className="text-2xl font-black">
                    {data.engagement_views != null
                      ? data.engagement_views >= 10000
                        ? `${(data.engagement_views / 10000).toFixed(1)}W`
                        : data.engagement_views.toLocaleString()
                      : '-'}
                  </div>
                  <div className="text-xs text-indigo-300 font-medium mt-0.5">播放量</div>
                </div>
                <div className="text-center">
                  <Heart className="w-5 h-5 mx-auto mb-1 text-rose-400" />
                  <div className="text-2xl font-black">
                    {data.engagement_likes != null
                      ? data.engagement_likes >= 10000
                        ? `${(data.engagement_likes / 10000).toFixed(1)}W`
                        : data.engagement_likes.toLocaleString()
                      : '-'}
                  </div>
                  <div className="text-xs text-indigo-300 font-medium mt-0.5">点赞数</div>
                </div>
                <div className="text-center">
                  <MessageCircle className="w-5 h-5 mx-auto mb-1 text-sky-400" />
                  <div className="text-2xl font-black">{data.engagement_comments ?? '-'}</div>
                  <div className="text-xs text-indigo-300 font-medium mt-0.5">评论数</div>
                </div>
                <div className="text-center">
                  <Share2 className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <div className="text-2xl font-black">{data.engagement_shares ?? '-'}</div>
                  <div className="text-xs text-indigo-300 font-medium mt-0.5">分享数</div>
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
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">核心出圈原因</p>
                <div className="space-y-3">
                  {analysis.virality_reasons.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-4 bg-gradient-to-r from-indigo-50 to-transparent rounded-xl p-4 border border-indigo-100"
                    >
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-black flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="text-gray-800 font-medium leading-relaxed">{r}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analysis.emotional_triggers?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">情感触点</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.emotional_triggers.map((t, i) => <TagPill key={i} variant="rose">{t}</TagPill>)}
                  </div>
                </div>
              )}
              {analysis.spread_mechanism?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">传播机制</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.spread_mechanism.map((t, i) => <TagPill key={i} variant="indigo">{t}</TagPill>)}
                  </div>
                </div>
              )}
              {analysis.timing_factors?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">时机因素</p>
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
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">创意手法</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.creative_technique.map((t, i) => <TagPill key={i} variant="teal">{t}</TagPill>)}
                  </div>
                </div>
              )}
              {analysis.hook_type && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">钩子类型</p>
                  <TagPill variant="rose">{analysis.hook_type}</TagPill>
                </div>
              )}
              {analysis.differentiation && (
                <div className="md:col-span-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">差异化卖点</p>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">{analysis.differentiation}</p>
                </div>
              )}
              {analysis.platform_fit_reason && (
                <div className="md:col-span-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">平台适配原因</p>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">{analysis.platform_fit_reason}</p>
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
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">目标人群</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.target_audience.map((t, i) => <TagPill key={i}>{t}</TagPill>)}
                  </div>
                </div>
              )}
              {analysis.funnel_stage && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">漏斗阶段</p>
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${FUNNEL_COLOR[analysis.funnel_stage] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {FUNNEL_MAP[analysis.funnel_stage] || analysis.funnel_stage}
                  </span>
                </div>
              )}
              {analysis.cta_strategy && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">CTA 策略</p>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">{analysis.cta_strategy}</p>
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
                <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">关键启示</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.key_takeaways.map((t, i) => (
                    <div key={i} className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-800 text-sm leading-relaxed">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.applicable_industries?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">适用行业</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.applicable_industries.map((t, i) => <TagPill key={i} variant="indigo">{t}</TagPill>)}
                  </div>
                </div>
              )}
              {analysis.applicable_scenarios?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">适用场景</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.applicable_scenarios.map((t, i) => <TagPill key={i} variant="teal">{t}</TagPill>)}
                  </div>
                </div>
              )}
              {analysis.replicability_notes && (
                <div className="md:col-span-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">可复制性说明</p>
                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <Copy className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm leading-relaxed">{analysis.replicability_notes}</p>
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
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
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
                <div className={`text-gray-700 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${rawExpanded ? '' : 'max-h-32'}`}>
                  <p className="whitespace-pre-wrap">{rawText}</p>
                </div>
                <button
                  onClick={() => setRawExpanded(v => !v)}
                  className="mt-3 flex items-center gap-1 text-indigo-600 text-sm font-semibold hover:underline"
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TagIcon className="w-4 h-4 text-indigo-600" />
                <h2 className="text-base font-bold text-gray-900">标签</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.tags.map(({ tag }, i) => (
                  <Link
                    key={i}
                    to={`/cases?tag=${tag.name}`}
                    className="px-3 py-1 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 text-xs font-semibold rounded-full transition-colors"
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
              <h2 className="text-xl font-bold text-gray-900 mb-5">相关案例</h2>
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
