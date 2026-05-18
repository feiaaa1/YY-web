import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { CaseDetail, Case } from '@/types/database';
import { CATEGORY_MAP, REGION_MAP, formatDate } from '@/lib/utils';
import { CaseCard } from '@/components/CaseCard';
import {
  ArrowLeft, ExternalLink, Heart, MessageCircle, Share2, Eye,
  Sparkles, Megaphone,
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

type AnalysisTab = 'virality' | 'creative' | 'strategy' | 'takeaway';

const ANALYSIS_TABS: { key: AnalysisTab; label: string }[] = [
  { key: 'virality', label: '出圈原因分析' },
  { key: 'creative', label: '创意拆解' },
  { key: 'strategy', label: '营销策略' },
  { key: 'takeaway', label: '可借鉴要素' },
];

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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
      {children}
    </p>
  );
}

function TagGroup({ items, variant = 'gray' }: { items?: string[] | null; variant?: 'gray' | 'indigo' | 'rose' | 'amber' | 'teal' }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => <TagPill key={`${item}-${i}`} variant={variant}>{item}</TagPill>)}
    </div>
  );
}

function NumberedList({ items }: { items?: string[] | null }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={`${item}-${i}`}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex items-start gap-4 rounded-xl p-4"
          style={{ background: 'rgba(75,0,130,0.1)', border: '1px solid rgba(75,0,130,0.25)' }}
        >
          <span className="flex-shrink-0 w-7 h-7 rounded-full text-sm font-black flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
            {i + 1}
          </span>
          <p className="font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>{item}</p>
        </motion.div>
      ))}
    </div>
  );
}

function DetailBlock({ children }: { children?: string | null }) {
  if (!children) return null;
  return (
    <p className="text-sm md:text-base leading-7 whitespace-pre-wrap rounded-xl p-4" style={{ color: 'var(--text-secondary)', background: 'var(--ink-muted)', border: '1px solid var(--border)' }}>
      {children}
    </p>
  );
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
  const [rawLanguage, setRawLanguage] = useState<'cn' | 'original'>('cn');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<AnalysisTab>('virality');

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
  const rawTextCn = data.raw_text_cn?.trim();
  const rawTextOriginal = data.raw_text?.trim();
  const rawText = rawLanguage === 'cn' && rawTextCn ? rawTextCn : rawTextOriginal;
  const hasRawLanguageSwitch = Boolean(rawTextCn && rawTextOriginal);

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

        {/* ③ Analysis */}
        {analysis && (
          <SectionCard id="analysis" title="案例分析" icon={<Sparkles className="w-5 h-5" />}>
            <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="案例分析模块">
              {ANALYSIS_TABS.map((tab) => {
                const active = activeAnalysisTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveAnalysisTab(tab.key)}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                    style={{
                      background: active ? 'linear-gradient(135deg, var(--gold-light), var(--gold))' : 'var(--ink-muted)',
                      color: active ? 'var(--ink)' : 'var(--text-secondary)',
                      border: active ? '1px solid var(--gold)' : '1px solid var(--border)',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeAnalysisTab === 'virality' && (
              <div className="space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel>情感触点</FieldLabel>
                    <TagGroup items={analysis.emotional_triggers} variant="rose" />
                  </div>
                  <div>
                    <FieldLabel>传播机制</FieldLabel>
                    <TagGroup items={analysis.spread_mechanism} variant="indigo" />
                  </div>
                </div>
                <div>
                  <FieldLabel>核心出圈原因</FieldLabel>
                  <NumberedList items={analysis.virality_reasons} />
                </div>
                <div>
                  <FieldLabel>详细分析</FieldLabel>
                  <DetailBlock>{analysis.virality_detail}</DetailBlock>
                </div>
              </div>
            )}

            {activeAnalysisTab === 'creative' && (
              <div className="space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel>创意手法</FieldLabel>
                    <TagGroup items={analysis.creative_technique} variant="teal" />
                  </div>
                  {analysis.hook_type && (
                    <div>
                      <FieldLabel>钩子类型</FieldLabel>
                      <TagPill variant="rose">{analysis.hook_type}</TagPill>
                    </div>
                  )}
                </div>
                {analysis.differentiation && (
                  <div>
                    <FieldLabel>差异化卖点</FieldLabel>
                    <DetailBlock>{analysis.differentiation}</DetailBlock>
                  </div>
                )}
                <div>
                  <FieldLabel>详细分析</FieldLabel>
                  <DetailBlock>{analysis.creative_detail}</DetailBlock>
                </div>
              </div>
            )}

            {activeAnalysisTab === 'strategy' && (
              <div className="space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <FieldLabel>目标人群</FieldLabel>
                    <TagGroup items={analysis.target_audience} />
                  </div>
                  {analysis.funnel_stage && (
                    <div>
                      <FieldLabel>漏斗阶段</FieldLabel>
                      <span className="px-4 py-2 rounded-xl text-sm font-bold" style={FUNNEL_STYLE[analysis.funnel_stage] || { background: 'var(--ink-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                        {FUNNEL_MAP[analysis.funnel_stage] || analysis.funnel_stage}
                      </span>
                    </div>
                  )}
                  <div>
                    <FieldLabel>时机因素</FieldLabel>
                    <TagGroup items={analysis.timing_factors} variant="amber" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysis.cta_strategy && (
                    <div>
                      <FieldLabel>CTA 策略</FieldLabel>
                      <DetailBlock>{analysis.cta_strategy}</DetailBlock>
                    </div>
                  )}
                  {analysis.platform_fit_reason && (
                    <div>
                      <FieldLabel>平台适配原因</FieldLabel>
                      <DetailBlock>{analysis.platform_fit_reason}</DetailBlock>
                    </div>
                  )}
                </div>
                <div>
                  <FieldLabel>详细分析</FieldLabel>
                  <DetailBlock>{analysis.strategy_detail}</DetailBlock>
                </div>
              </div>
            )}

            {activeAnalysisTab === 'takeaway' && (
              <div className="space-y-7">
                <div>
                  <FieldLabel>关键启示</FieldLabel>
                  <NumberedList items={analysis.key_takeaways} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel>适用行业</FieldLabel>
                    <TagGroup items={analysis.applicable_industries} variant="indigo" />
                  </div>
                  <div>
                    <FieldLabel>适用场景</FieldLabel>
                    <TagGroup items={analysis.applicable_scenarios} variant="teal" />
                  </div>
                </div>
                <div>
                  <FieldLabel>详细分析</FieldLabel>
                  <DetailBlock>{analysis.takeaway_detail}</DetailBlock>
                </div>
              </div>
            )}
          </SectionCard>
        )}

        {/* ④ 原始内容 */}
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
                {hasRawLanguageSwitch && (
                  <div className="flex flex-wrap gap-2 mb-4" aria-label="原始内容语言切换">
                    {[
                      { key: 'cn' as const, label: '中文' },
                      { key: 'original' as const, label: '原文' },
                    ].map((option) => {
                      const active = rawLanguage === option.key;
                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => setRawLanguage(option.key)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                          style={{
                            background: active ? 'var(--gold)' : 'var(--ink-muted)',
                            color: active ? 'var(--ink)' : 'var(--text-secondary)',
                            border: active ? '1px solid var(--gold)' : '1px solid var(--border)',
                          }}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}
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
