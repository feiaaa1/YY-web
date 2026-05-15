import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Case } from '@/types/database';
import { CaseCard } from '@/components/CaseCard';
import { Search, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [featuredCases, setFeaturedCases] = useState<Case[]>([]);
  const [trendingCases, setTrendingCases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Featured Cases
      const featured = await api.getCases({ is_featured: true, order: 'quality_score', limit: 3 });
      setFeaturedCases(featured.data);

      // Fetch Trending Cases
      const trending = await api.getCases({ order: 'engagement_score', limit: 6 });
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
      {/* Hero Section */}
      <section id="hero" className="relative pt-24 pb-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/100" />
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6">
              汇集全球顶尖营销智慧
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              探索改变行业的<span className="text-indigo-600">营销案例</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
              收录数百个经过验证的成功案例，借助AI深度解析传播机制与策略，寻找下一个爆款灵感。
            </p>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white shadow-xl rounded-full border border-gray-100 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <Search className="w-5 h-5 text-gray-400 absolute left-5" />
                <input 
                  type="text" 
                  className="w-full py-4 pl-14 pr-32 outline-none text-gray-700 bg-transparent placeholder-gray-400"
                  placeholder="搜索品牌、案例或营销手法 (如: 母亲节)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
                >
                  搜索
                </button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                <span>热门搜索:</span>
                <Link to="/cases?q=瑞幸" className="hover:text-indigo-600 transition-colors">瑞幸联名</Link>
                <Link to="/cases?q=Nike" className="hover:text-indigo-600 transition-colors">Nike</Link>
                <Link to="/cases?type=video_ad" className="hover:text-indigo-600 transition-colors">视频广告</Link>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured-cases" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-900 mb-2">
                <Sparkles className="text-amber-500" />
                编辑精选
              </h2>
              <p className="text-gray-500">深入解析最具影响力和创意水准的顶尖案例</p>
            </div>
            <Link to="/cases" className="hidden sm:flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCases.map((caseItem, idx) => (
              <CaseCard key={caseItem.id} caseData={caseItem} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section id="trending-cases" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-900 mb-2">
                <TrendingUp className="text-rose-500" />
                热度飙升
              </h2>
              <p className="text-gray-500">全网互动量最高、最具讨论度的话题案例</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingCases.map((caseItem, idx) => (
              <CaseCard key={`trending-${caseItem.id}`} caseData={caseItem} index={idx} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
