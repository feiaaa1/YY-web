import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Case } from '@/types/database';
import { CaseCard } from '@/components/CaseCard';
import { CATEGORY_MAP, REGION_MAP } from '@/lib/utils';
import { SlidersHorizontal, X } from 'lucide-react';

export default function CasesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const PAGE_SIZE = 20;

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [batchStart, setBatchStart] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const currentQuery = searchParams.get('q') || '';
  const currentRegion = searchParams.get('region') || 'all';
  const currentType = searchParams.get('type') || 'all';
  const currentOrder =
    (searchParams.get('order') as
      | 'collected_at'
      | 'published_at'
      | 'engagement_views'
      | 'engagement_likes') || 'collected_at';

  useEffect(() => {
    setPage(0);
    setCases([]);
    setBatchStart(0);
  }, [currentQuery, currentRegion, currentType, currentOrder]);

  useEffect(() => {
    const fetchCases = async () => {
      if (page === 0) setLoading(true);
      else setLoadingMore(true);

      const res = await api.getCases({
        search: currentQuery,
        region: currentRegion,
        content_type: currentType,
        order: currentOrder,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });

      setCases((prev) => {
        if (page === 0) return res.data;
        setBatchStart(prev.length);
        return [...prev, ...res.data];
      });
      setTotal(res.count ?? 0);
      setLoading(false);
      setLoadingMore(false);
    };

    fetchCases();
  }, [currentQuery, currentRegion, currentType, currentOrder, page]);

  const hasMore = cases.length < total;

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    updateFilter('q', query);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      {/* Page header */}
      <div
        className="border-b"
        style={{ background: 'var(--ink-soft)', borderColor: 'var(--border)' }}
      >
        <div className="container mx-auto px-6 lg:px-8 py-8 md:py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px w-6" style={{ background: 'var(--gold)' }} />
                <span
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace' }}
                >
                  案例库
                </span>
              </div>
              <h1
                className="text-2xl md:text-4xl font-bold mb-1"
                style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}
              >
                全部案例
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                发现全网最优秀的营销创意与策略
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Mobile filter button */}
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium flex-shrink-0 transition-all duration-200"
                style={{ border: '1px solid var(--border-warm)', color: 'var(--text-secondary)', background: 'transparent' }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                筛选
              </button>

              <form onSubmit={handleSearchSubmit} className="flex-1 md:flex-none">
                <div
                  className="flex items-center rounded-full overflow-hidden"
                  style={{ border: '1px solid var(--border)', background: 'rgba(245,240,232,0.04)' }}
                >
                  <svg
                    className="ml-4 flex-shrink-0"
                    width="15"
                    height="15"
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
                    name="search"
                    defaultValue={currentQuery}
                    placeholder="搜索案例名称…"
                    className="py-2.5 px-3 outline-none bg-transparent text-sm w-full md:w-56"
                    style={{ color: 'var(--text-primary)', caretColor: 'var(--gold)' }}
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
                      color: 'var(--ink)',
                    }}
                  >
                    搜索
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer overlay */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setFilterOpen(false)}
          style={{ background: 'rgba(0,0,0,0.5)' }}
        />
      )}

      {/* Mobile filter drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:hidden transition-transform duration-300 overflow-y-auto ${filterOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--ink-soft)', borderRight: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--gold)' }} />
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>
              筛选
            </span>
          </div>
          <button
            onClick={() => setFilterOpen(false)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <FilterGroup label="区域">
            <FilterOption label="不限" checked={currentRegion === 'all'} onChange={() => updateFilter('region', 'all')} />
            {Object.entries(REGION_MAP).map(([key, label]) => (
              <FilterOption key={key} label={label} checked={currentRegion === key} onChange={() => updateFilter('region', key)} />
            ))}
          </FilterGroup>
          <FilterGroup label="内容类型">
            <FilterOption label="不限" checked={currentType === 'all'} onChange={() => updateFilter('type', 'all')} />
            {Object.entries(CATEGORY_MAP).map(([key, label]) => (
              <FilterOption key={key} label={label} checked={currentType === key} onChange={() => updateFilter('type', key)} />
            ))}
          </FilterGroup>
          <FilterGroup label="排序方式" last>
            {[
              { value: 'collected_at', label: '最新收录' },
              { value: 'published_at', label: '最新发布' },
              { value: 'engagement_views', label: '播放量最高' },
              { value: 'engagement_likes', label: '点赞数最高' },
            ].map((opt) => (
              <FilterOption key={opt.value} label={opt.label} checked={currentOrder === opt.value} onChange={() => updateFilter('order', opt.value)} />
            ))}
          </FilterGroup>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-56 flex-shrink-0">
            <div
              className="rounded-2xl p-5 sticky top-24"
              style={{ background: 'var(--ink-soft)', border: '1px solid var(--border)' }}
            >
              <div
                className="flex items-center gap-2 mb-6 pb-4"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: 'var(--gold)' }}
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="20" y2="12" />
                  <line x1="12" y1="18" x2="20" y2="18" />
                </svg>
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}
                >
                  筛选
                </span>
              </div>

              <FilterGroup label="区域">
                <FilterOption label="不限" checked={currentRegion === 'all'} onChange={() => updateFilter('region', 'all')} />
                {Object.entries(REGION_MAP).map(([key, label]) => (
                  <FilterOption key={key} label={label} checked={currentRegion === key} onChange={() => updateFilter('region', key)} />
                ))}
              </FilterGroup>

              <FilterGroup label="内容类型">
                <FilterOption label="不限" checked={currentType === 'all'} onChange={() => updateFilter('type', 'all')} />
                {Object.entries(CATEGORY_MAP).map(([key, label]) => (
                  <FilterOption key={key} label={label} checked={currentType === key} onChange={() => updateFilter('type', key)} />
                ))}
              </FilterGroup>

              <FilterGroup label="排序方式" last>
                {[
                  { value: 'collected_at', label: '最新收录' },
                  { value: 'published_at', label: '最新发布' },
                  { value: 'engagement_views', label: '播放量最高' },
                  { value: 'engagement_likes', label: '点赞数最高' },
                ].map((opt) => (
                  <FilterOption key={opt.value} label={opt.label} checked={currentOrder === opt.value} onChange={() => updateFilter('order', opt.value)} />
                ))}
              </FilterGroup>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-grow min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div
                  className="w-8 h-8 rounded-full border-2 animate-spin mb-4"
                  style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }}
                />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>加载中…</p>
              </div>
            ) : cases.length > 0 ? (
              <>
                <p
                  className="text-xs mb-6"
                  style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}
                >
                  共 {total} 个案例 · 已加载 {cases.length} 个
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {cases.map((c, idx) => (
                    <CaseCard key={c.id} caseData={c} index={idx - batchStart} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={loadingMore}
                      className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50"
                      style={{ border: '1px solid var(--border-warm)', color: 'var(--text-secondary)', background: 'transparent' }}
                      onMouseEnter={e => {
                        if (!loadingMore) {
                          (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
                        }
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-warm)';
                      }}
                    >
                      {loadingMore ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
                          加载中…
                        </>
                      ) : (
                        <>加载更多 · 还剩 {total - cases.length} 个</>
                      )}
                    </button>
                  </div>
                )}

                {!hasMore && cases.length > 0 && (
                  <p className="text-center text-xs mt-12" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
                    — 已加载全部 {total} 个案例 —
                  </p>
                )}
              </>
            ) : (
              <div
                className="rounded-2xl p-16 text-center"
                style={{ background: 'var(--ink-soft)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--ink-muted)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
                  未找到符合条件的案例
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  尝试调整筛选条件或搜索其他关键词
                </p>
                <button
                  onClick={() => navigate('/cases')}
                  className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={{ border: '1px solid var(--border-warm)', color: 'var(--gold)', background: 'transparent' }}
                >
                  清除所有筛选
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children, last = false }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={last ? 'mb-0' : 'mb-6'}>
      <h3 className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
        {label}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer" style={{ color: checked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
      <span
        className="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all duration-200"
        style={{ borderColor: checked ? 'var(--gold)' : 'var(--border)', background: checked ? 'var(--gold)' : 'transparent' }}
      >
        {checked && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ink)' }} />}
      </span>
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
      <span className="text-sm">{label}</span>
    </label>
  );
}
