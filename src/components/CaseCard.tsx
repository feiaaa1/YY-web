import React from 'react';
import { Link } from 'react-router-dom';
import { cn, CATEGORY_MAP, REGION_MAP } from '@/lib/utils';
import { Case } from '@/types/database';
import { motion } from 'framer-motion';

interface CaseCardProps {
  caseData: Case;
  className?: string;
  index?: number;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseData, className, index = 0 }) => {
  const imageUrl =
    caseData.raw_media_urls?.[0] ||
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        to={`/case/${caseData.id}`}
        className={cn('group flex flex-col h-full rounded-2xl overflow-hidden', className)}
        style={{
          background: 'var(--ink-soft)',
          border: '1px solid var(--border)',
          transition: 'border-color 0.25s, transform 0.25s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-warm)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        {/* Image */}
        <div className="relative aspect-video overflow-hidden" style={{ background: 'var(--ink-muted)' }}>
          <img
            src={imageUrl}
            alt={caseData.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Overlay gradient */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(13,0,24,0.7) 0%, transparent 50%)' }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className="px-2.5 py-1 text-xs font-medium rounded-full"
              style={{
                background: 'color-mix(in srgb, var(--ink) 70%, transparent)',
                color: 'var(--text-secondary)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border)',
              }}
            >
              {CATEGORY_MAP[caseData.content_type] || caseData.content_type}
            </span>
          </div>

          {caseData.is_featured && (
            <div className="absolute top-3 right-3">
              <span
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full"
                style={{
                  background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
                  color: 'var(--ink)',
                }}
              >
                ★ 精选
              </span>
            </div>
          )}

          {/* Score overlay at bottom */}
          <div className="absolute bottom-3 right-3">
            <span
              className="text-xs font-mono-custom font-medium px-2 py-0.5 rounded"
              style={{
                background: 'rgba(0,0,0,0.55)',
                color: 'var(--gold)',
                fontFamily: 'DM Mono, monospace',
                backdropFilter: 'blur(8px)',
              }}
            >
              {caseData.quality_score}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-5">
          {/* Meta row */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs"
              style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}
            >
              {REGION_MAP[caseData.region] || caseData.region}
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}
            >
              ♥ {caseData.engagement_score?.toFixed(1) ?? '0.0'}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-base font-bold leading-snug mb-2 line-clamp-2 transition-colors duration-200"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            {caseData.title}
          </h3>

          {/* Summary */}
          <p
            className="text-sm line-clamp-2 mb-4 flex-grow leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {caseData.summary}
          </p>

          {/* Brand row */}
          <div
            className="flex items-center gap-2 pt-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: 'var(--ink-muted)',
                color: 'var(--gold)',
              }}
            >
              {caseData.brand_name?.charAt(0) ?? '?'}
            </div>
            <span
              className="text-sm font-medium truncate"
              style={{ color: 'var(--text-secondary)' }}
            >
              {caseData.brand_name ?? '未知品牌'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
