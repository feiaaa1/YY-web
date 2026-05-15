import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Case } from '@/types/database';
import { CaseCard } from '@/components/CaseCard';
import { CATEGORY_MAP, REGION_MAP } from '@/lib/utils';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';

export default function CasesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const PAGE_SIZE = 20;

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  // Current filters
  const currentQuery = searchParams.get('q') || '';
  const currentRegion = searchParams.get('region') || 'all';
  const currentType = searchParams.get('type') || 'all';
  const currentOrder = (searchParams.get('order') as 'collected_at' | 'published_at' | 'engagement_score' | 'quality_score') || 'collected_at';

  // Reset to first page when filters change
  useEffect(() => {
    setPage(0);
    setCases([]);
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

      setCases(prev => page === 0 ? res.data : [...prev, ...res.data]);
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
    <section id="cases-explorer" className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">案例库</h1>
            <p className="text-gray-500">发现全网最优秀的营销创意与策略</p>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                name="search"
                defaultValue={currentQuery}
                placeholder="搜索案例名称..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-l-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg font-medium transition-colors">
              搜索
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                <SlidersHorizontal className="w-5 h-5" />
                筛选条件
              </div>

              {/* Region Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">区域</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-indigo-600">
                    <input 
                      type="radio" 
                      name="region" 
                      checked={currentRegion === 'all'} 
                      onChange={() => updateFilter('region', 'all')}
                      className="text-indigo-600 focus:ring-indigo-500" 
                    />
                    不限
                  </label>
                  {Object.entries(REGION_MAP).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-indigo-600">
                      <input 
                        type="radio" 
                        name="region" 
                        checked={currentRegion === key} 
                        onChange={() => updateFilter('region', key)}
                        className="text-indigo-600 focus:ring-indigo-500" 
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">内容类型</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-indigo-600">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={currentType === 'all'} 
                      onChange={() => updateFilter('type', 'all')}
                      className="text-indigo-600 focus:ring-indigo-500" 
                    />
                    不限
                  </label>
                  {Object.entries(CATEGORY_MAP).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-indigo-600">
                      <input 
                        type="radio" 
                        name="type" 
                        checked={currentType === key} 
                        onChange={() => updateFilter('type', key)}
                        className="text-indigo-600 focus:ring-indigo-500" 
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Sort Filter */}
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">排序方式</h3>
                <select 
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                  value={currentOrder}
                  onChange={(e) => updateFilter('order', e.target.value)}
                >
                  <option value="collected_at">最新收录</option>
                  <option value="published_at">最新发布</option>
                  <option value="engagement_score">互动量最高</option>
                  <option value="quality_score">质量分最高</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results Area */}
          <div className="flex-grow">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
                <p>加载中...</p>
              </div>
            ) : cases.length > 0 ? (
              <>
                <p className="text-sm text-gray-400 mb-4">共 {total} 个案例，已加载 {cases.length} 个</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cases.map((caseItem, idx) => (
                    <CaseCard key={caseItem.id} caseData={caseItem} index={idx} />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={loadingMore}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 hover:border-indigo-400 hover:text-indigo-600 text-gray-700 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-60"
                    >
                      {loadingMore ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> 加载中...</>
                      ) : (
                        <>加载更多 · 还剩 {total - cases.length} 个</>
                      )}
                    </button>
                  </div>
                )}

                {!hasMore && cases.length > 0 && (
                  <p className="text-center text-sm text-gray-400 mt-10">— 已加载全部 {total} 个案例 —</p>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">未找到符合条件的案例</h3>
                <p className="text-gray-500 mb-6">尝试调整筛选条件或搜索其他关键词</p>
                <button 
                  onClick={() => navigate('/cases')}
                  className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                >
                  清除所有筛选
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
