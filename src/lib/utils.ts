import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORY_MAP: Record<string, string> = {
  copywriting: '优质文案',
  creative_poster: '创意海报',
  campaign_plan: '营销策划',
  video_ad: '视频广告',
  social_content: '社交内容',
  integrated_campaign: '整合营销',
  event_marketing: '事件营销',
  kol_collaboration: 'KOL合作',
};

export const REGION_MAP: Record<string, string> = {
  cn: '中国区',
  global: '全球海外',
};

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
