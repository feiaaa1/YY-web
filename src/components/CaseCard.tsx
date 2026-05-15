import React from 'react';
import { Link } from 'react-router-dom';
import { cn, CATEGORY_MAP, REGION_MAP } from '@/lib/utils';
import { Case } from '@/types/database';
import { Sparkles, Globe, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface CaseCardProps {
  caseData: Case;
  className?: string;
  index?: number;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseData, className, index = 0 }) => {
  const imageUrl = caseData.raw_media_urls?.[0] || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link 
        to={`/case/${caseData.id}`}
        className={cn(
          "group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full",
          className
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img 
            src={imageUrl} 
            alt={caseData.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold rounded-full shadow-sm text-gray-800">
              {CATEGORY_MAP[caseData.content_type] || caseData.content_type}
            </span>
          </div>
          
          <div className="absolute top-4 right-4 flex gap-2">
            {caseData.is_featured && (
              <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
                <Sparkles className="w-3 h-3" />
                精选
              </span>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-grow p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {REGION_MAP[caseData.region] || caseData.region}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                质量分 {caseData.quality_score}
              </span>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {caseData.title}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
            {caseData.summary}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
            <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {/* Fallback to first letter if no logo */}
                <span className="text-xs font-bold text-gray-500">{caseData.brand_name?.charAt(0) ?? '?'}</span>
              </div>
              {caseData.brand_name ?? '未知品牌'}
            </span>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {caseData.engagement_score?.toFixed(1) ?? '0.0'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
