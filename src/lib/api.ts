import { supabase } from './supabase';
import { Case, CaseDetail, Tag } from '../types/database';
import { MOCK_CASES, MOCK_TAGS } from './mockData';

export const api = {
  async getCases(params?: {
    region?: string;
    content_type?: string;
    brand_name?: string;
    is_featured?: boolean;
    order?: 'collected_at' | 'published_at' | 'engagement_views' | 'engagement_likes';
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<{ data: Case[]; count?: number }> {
    try {
      let query = supabase
        .from('cases')
        .select(
          `id, title, title_cn, summary, content_type, source_url, brand_name,
           published_at, collected_at, region, language, country,
           engagement_likes, engagement_comments, engagement_shares, engagement_views,
           is_featured, raw_media_urls,
           source:sources(id, name, name_cn),
           brand:brands(id, name, logo_url, industry)`,
          { count: 'exact' }
        );

      if (params?.region && params.region !== 'all') query = query.eq('region', params.region);
      if (params?.content_type && params.content_type !== 'all') query = query.eq('content_type', params.content_type);
      if (params?.is_featured) query = query.eq('is_featured', true);
      if (params?.search) {
        const q = params.search;
        query = query.or(`title.ilike.%${q}%,title_cn.ilike.%${q}%,summary.ilike.%${q}%,raw_text.ilike.%${q}%,raw_text_cn.ilike.%${q}%`);
      }

      if (params?.order) {
        query = query.order(params.order, { ascending: false });
      } else {
        query = query.order('collected_at', { ascending: false });
      }

      const limit = params?.limit || 20;
      const offset = params?.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;
      if (!error && data) {
        return { data: data as unknown as Case[], count: count || 0 };
      }
      console.warn('Supabase getCases error:', error?.message);
    } catch (e) {
      console.warn('Supabase getCases failed, falling back to mock.', e);
    }

    // Mock fallback
    let results = [...MOCK_CASES];
    if (params?.region && params.region !== 'all') results = results.filter(c => c.region === params.region);
    if (params?.content_type && params.content_type !== 'all') results = results.filter(c => c.content_type === params.content_type);
    if (params?.is_featured) results = results.filter(c => c.is_featured);
    if (params?.search) {
      const q = params.search.toLowerCase();
      results = results.filter(c => c.title.toLowerCase().includes(q) || (c.summary ?? '').toLowerCase().includes(q));
    }
    if (params?.order) {
      results.sort((a, b) => {
        const order = params.order!;
        if (order === 'collected_at' || order === 'published_at') {
          return new Date((b[order] as string | null | undefined) ?? 0).getTime() - new Date((a[order] as string | null | undefined) ?? 0).getTime();
        }
        return ((b[order] as number | undefined) ?? 0) - ((a[order] as number | undefined) ?? 0);
      });
    }
    return { data: results, count: results.length };
  },

  async getCaseDetail(id: string): Promise<CaseDetail | null> {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          source:sources(id, name, name_cn, url),
          brand:brands(id, name, name_cn, logo_url, industry),
          analysis:case_analysis(
            virality_reasons, virality_detail,
            emotional_triggers, spread_mechanism, creative_technique,
            target_audience, timing_factors,
            hook_type, funnel_stage, differentiation,
            creative_detail, strategy_detail, takeaway_detail,
            key_takeaways, applicable_industries, applicable_scenarios,
            platform_fit_reason, cta_strategy, confidence_score,
            model_used, analysis_version, case_id, created_at
          ),
          assets:case_assets(id, type, url, description, sort_order),
          tags:case_tags(tag:tags(id, name, name_cn, category))
        `)
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as CaseDetail;
      }
      console.warn('Supabase getCaseDetail error:', error?.message);
    } catch (e) {
      console.warn('Supabase getCaseDetail failed, falling back to mock.', e);
    }

    const mockDetail = MOCK_CASES.find(c => c.id === id);
    return mockDetail as unknown as CaseDetail || null;
  },

  async getRelatedCases(caseId: string, contentType: string, limit = 4): Promise<Case[]> {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`id, title, title_cn, summary, brand_name, raw_media_urls, content_type, region, engagement_likes, engagement_comments, engagement_shares, engagement_views, is_featured, source_url, published_at, collected_at`)
        .eq('content_type', contentType)
        .neq('id', caseId)
        .order('published_at', { ascending: false })
        .limit(limit);
      if (!error && data) return data as unknown as Case[];
      console.warn('Supabase getRelatedCases error:', error?.message);
    } catch (e) {
      console.warn('Supabase getRelatedCases failed, falling back to mock.', e);
    }
    return MOCK_CASES.filter(c => c.id !== caseId && c.content_type === contentType).slice(0, limit);
  },

  async getTags(): Promise<Tag[]> {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name, name_cn, category, usage_count')
        .order('usage_count', { ascending: false })
        .limit(50);
      if (!error && data) {
        return data as Tag[];
      }
      console.warn('Supabase getTags error:', error?.message);
    } catch (e) {
      console.warn('Supabase getTags failed, falling back to mock.', e);
    }
    return MOCK_TAGS;
  }
};
