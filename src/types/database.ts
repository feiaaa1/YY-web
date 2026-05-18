export type Region = 'cn' | 'global';
export type ContentType =
  | 'copywriting'
  | 'creative_poster'
  | 'campaign_plan'
  | 'video_ad'
  | 'social_content'
  | 'integrated_campaign'
  | 'event_marketing'
  | 'kol_collaboration';
export type FunnelStage = 'awareness' | 'consideration' | 'conversion';

export interface Source {
  id: string;
  name: string;
  name_cn: string | null;
  url: string;
  region?: Region;
  type?: string;
  authority_score?: number;
}

export interface Brand {
  id: string;
  name: string;
  name_cn: string | null;
  logo_url: string | null;
  industry: string | null;
  country: string | null;
}

export interface Case {
  id: string;
  title: string;
  title_cn: string | null;
  summary: string | null;
  content_type: ContentType;
  source_url: string;
  brand_name: string | null;
  published_at: string | null;
  collected_at?: string;
  region: Region;
  language?: string;
  country?: string | null;
  engagement_likes?: number;
  engagement_comments?: number;
  engagement_shares?: number;
  engagement_views?: number;
  engagement_saves?: number;
  is_featured?: boolean;
  raw_text?: string | null;
  raw_text_cn?: string | null;
  raw_media_urls: string[] | null;
  metadata?: Record<string, unknown>;
  // joined relations
  source?: Source;
  brand?: Brand | null;
}

export interface CaseAnalysis {
  id?: string;
  case_id: string;
  emotional_triggers: string[];
  spread_mechanism: string[];
  creative_technique: string[];
  target_audience: string[];
  timing_factors: string[];
  platform_fit_reason: string | null;
  hook_type: string | null;
  cta_strategy: string | null;
  funnel_stage: FunnelStage | null;
  differentiation: string | null;
  virality_reasons: string[];
  virality_detail: string | null;
  creative_detail: string | null;
  strategy_detail: string | null;
  takeaway_detail: string | null;
  key_takeaways: string[];
  applicable_industries: string[];
  applicable_scenarios: string[];
  model_used: string | null;
  confidence_score: number | null;
  analysis_version?: number;
  created_at?: string;
}

export interface Tag {
  id: string;
  name: string;
  name_cn: string | null;
  category: string | null;
  usage_count?: number;
}

export interface CaseDetail extends Case {
  engagement_likes: number;
  engagement_comments: number;
  engagement_shares: number;
  engagement_views: number;
  source: Source;
  brand: Brand | null;
  analysis: CaseAnalysis[];
  assets: { id: string; type: string; url: string; description: string; sort_order: number }[];
  tags: { tag: Tag }[];
}
