import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900">
                全球营销<span className="text-indigo-600">案例库</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm max-w-md leading-relaxed">
              为您提供最前沿的全球营销案例，深入解析创意、策略与AI传播机制。助力品牌经理与广告人找到下一个增长点。
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">案例库</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/cases" className="hover:text-indigo-600 transition-colors">全部案例</Link></li>
              <li><Link to="/cases?type=video_ad" className="hover:text-indigo-600 transition-colors">视频广告</Link></li>
              <li><Link to="/cases?type=integrated_campaign" className="hover:text-indigo-600 transition-colors">整合营销</Link></li>
              <li><Link to="/cases?type=kol_collaboration" className="hover:text-indigo-600 transition-colors">KOL合作</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">关于</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">关于我们</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">联系合作</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">加入我们</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">隐私政策</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} 全球营销案例库. All rights reserved. 
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            Powered by <span className="font-semibold text-gray-500">Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
