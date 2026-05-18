# 营销案例知识库 — 前端接入文档

> **数据库**: Supabase (PostgreSQL)  
> **接入方式**: Supabase JS Client 或直接 REST API  
> **权限**: 所有表均开放匿名只读（anon key），写入需 service_role key

---

## 1. 快速接入

### 安装依赖

```bash
npm install @supabase/supabase-js
```

### 初始化客户端

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://sqptjbsoyghacmvgtecz.supabase.co',
  'YOUR_ANON_KEY'  // Supabase Dashboard → Project Settings → API → anon public
)
```

---

## 2. 数据模型

### 核心表关系

```
sources (来源平台)
    └── cases (营销案例)  ←→  brands (品牌)
              ├── case_analysis (AI分析)
              ├── case_assets (素材附件)
              ├── case_tags → tags (标签)
              └── engagement_history (互动历史)
```

---

## 3. 主要接口

### 3.1 获取案例列表

**场景**: 首页/列表页，支持分页、筛选、排序

```typescript
const { data, error, count } = await supabase
  .from('cases')
  .select(`
    id,
    title,
    title_cn,
    summary,
    content_type,
    source_url,
    brand_name,
    published_at,
    region,
    language,
    country,
    engagement_likes,
    engagement_views,
    engagement_score,
    quality_score,
    is_featured,
    raw_media_urls,
    source:sources(id, name, name_cn),
    brand:brands(id, name, logo_url, industry)
  `, { count: 'exact' })
  .order('published_at', { ascending: false })
  .range(0, 19)  // 第1页，每页20条
```

**返回字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string (uuid)` | 案例唯一ID |
| `title` | `string` | 案例标题（原文） |
| `title_cn` | `string \| null` | 中文标题（海外案例AI翻译） |
| `summary` | `string \| null` | 摘要，200字以内 |
| `content_type` | `enum` | 内容类型，见下方枚举 |
| `source_url` | `string` | 原始来源链接 |
| `brand_name` | `string \| null` | 品牌名称（冗余字段，方便展示） |
| `published_at` | `string (ISO8601)` | 原始发布时间 |
| `region` | `'cn' \| 'global'` | 地区 |
| `language` | `string` | 语言代码，如 `zh` / `en` |
| `country` | `string \| null` | 目标市场国家 |
| `engagement_likes` | `number` | 点赞数 |
| `engagement_views` | `number` | 播放/浏览量 |
| `engagement_score` | `number` | 综合互动得分（系统计算） |
| `quality_score` | `number (0-100)` | 内容质量评分（AI评定） |
| `is_featured` | `boolean` | 是否精选 |
| `raw_media_urls` | `string[]` | 媒体资源URL数组（图片/视频封面） |
| `source` | `object` | 来源平台信息 |
| `brand` | `object \| null` | 品牌信息 |

**`content_type` 枚举值**

| 值 | 含义 |
|----|------|
| `copywriting` | 优质文案 |
| `creative_poster` | 创意海报 |
| `campaign_plan` | 营销策划案 |
| `video_ad` | 视频广告 |
| `social_content` | 社交内容 |
| `integrated_campaign` | 整合营销 |
| `event_marketing` | 事件营销 |
| `kol_collaboration` | KOL合作 |

---

### 3.2 获取案例详情

**场景**: 案例详情页，包含完整信息和AI分析

```typescript
const { data, error } = await supabase
  .from('cases')
  .select(`
    *,
    source:sources(*),
    brand:brands(*),
    analysis:case_analysis(*),
    assets:case_assets(id, type, url, description, sort_order),
    tags:case_tags(tag:tags(id, name, name_cn, category))
  `)
  .eq('id', caseId)
  .single()
```

---

### 3.3 获取AI分析结果

**场景**: 案例详情页的「出圈分析」模块

```typescript
const { data, error } = await supabase
  .from('case_analysis')
  .select('*')
  .eq('case_id', caseId)
  .order('analysis_version', { ascending: false })
  .limit(1)
  .single()
```

**返回字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| `emotional_triggers` | `string[]` | 情感触点，如 `["怀旧", "共鸣", "惊喜"]` |
| `spread_mechanism` | `string[]` | 传播机制，如 `["UGC二创", "社交货币"]` |
| `creative_technique` | `string[]` | 创意手法，如 `["反转", "拟人", "极简"]` |
| `target_audience` | `string[]` | 目标人群，如 `["Z世代", "新中产"]` |
| `timing_factors` | `string[]` | 时机因素，如 `["母亲节", "五一假期"]` |
| `platform_fit_reason` | `string` | 平台适配原因说明 |
| `hook_type` | `string` | 钩子类型，如 `"情绪"` / `"悬念"` / `"利益"` |
| `cta_strategy` | `string` | CTA策略说明 |
| `funnel_stage` | `'awareness' \| 'consideration' \| 'conversion'` | 营销漏斗阶段 |
| `differentiation` | `string` | 差异化卖点 |
| `virality_score` | `number (0-100)` | 出圈指数 |
| `virality_reasons` | `string[]` | 出圈核心原因（top 3） |
| `replicability_score` | `number (0-100)` | 可复制性评分 |
| `replicability_notes` | `string` | 可复制性说明 |
| `key_takeaways` | `string[]` | 关键启示 |
| `applicable_industries` | `string[]` | 适用行业 |
| `applicable_scenarios` | `string[]` | 适用场景，如 `["新品上市", "品牌焕新"]` |
| `model_used` | `string` | 分析使用的AI模型 |
| `confidence_score` | `number (0-1)` | 分析置信度 |

---

### 3.4 筛选与搜索

#### 按内容类型筛选

```typescript
.eq('content_type', 'video_ad')
```

#### 按地区筛选

```typescript
.eq('region', 'cn')  // 或 'global'
```

#### 按品牌筛选

```typescript
.ilike('brand_name', '%耐克%')
```

#### 关键词搜索（标题 + 正文）

```typescript
// 方式1: 标题模糊搜索
.ilike('title', `%${keyword}%`)

// 方式2: 全文搜索（需要 pg_trgm 扩展，已启用）
.or(`title.ilike.%${keyword}%,raw_text.ilike.%${keyword}%`)
```

#### 按出圈指数排序（需 join case_analysis）

```typescript
const { data } = await supabase
  .from('case_analysis')
  .select(`
    virality_score,
    case:cases(id, title, summary, brand_name, raw_media_urls, published_at)
  `)
  .order('virality_score', { ascending: false })
  .range(0, 19)
```

#### 按标签筛选

```typescript
// 先查标签ID
const { data: tag } = await supabase
  .from('tags')
  .select('id')
  .eq('name', '母亲节')
  .single()

// 再查关联案例
const { data: caseTags } = await supabase
  .from('case_tags')
  .select('case_id')
  .eq('tag_id', tag.id)

const caseIds = caseTags.map(ct => ct.case_id)

const { data: cases } = await supabase
  .from('cases')
  .select('*')
  .in('id', caseIds)
```

---

### 3.5 获取来源平台列表

**场景**: 筛选器下拉菜单

```typescript
const { data } = await supabase
  .from('sources')
  .select('id, name, name_cn, region, type, authority_score')
  .eq('is_active', true)
  .order('authority_score', { ascending: false })
```

---

### 3.6 获取标签列表

**场景**: 标签云、筛选器

```typescript
const { data } = await supabase
  .from('tags')
  .select('id, name, name_cn, category, usage_count')
  .order('usage_count', { ascending: false })
  .limit(50)
```

---

### 3.7 精选案例

```typescript
const { data } = await supabase
  .from('cases')
  .select('id, title, summary, brand_name, raw_media_urls, content_type, published_at')
  .eq('is_featured', true)
  .order('quality_score', { ascending: false })
  .limit(10)
```

---

## 4. 分页

Supabase 使用 `range(from, to)` 分页，索引从 0 开始：

```typescript
const PAGE_SIZE = 20

async function getCases(page: number) {
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, count } = await supabase
    .from('cases')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(from, to)

  return {
    data,
    total: count,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
    currentPage: page,
  }
}
```

---

## 5. TypeScript 类型定义

```typescript
export type Region = 'cn' | 'global'

export type ContentType =
  | 'copywriting'
  | 'creative_poster'
  | 'campaign_plan'
  | 'video_ad'
  | 'social_content'
  | 'integrated_campaign'
  | 'event_marketing'
  | 'kol_collaboration'

export type FunnelStage = 'awareness' | 'consideration' | 'conversion'

export interface Source {
  id: string
  name: string
  name_cn: string | null
  url: string
  region: Region
  type: string
  authority_score: number
}

export interface Brand {
  id: string
  name: string
  name_cn: string | null
  logo_url: string | null
  industry: string | null
  country: string | null
}

export interface Case {
  id: string
  title: string
  title_cn: string | null
  summary: string | null
  content_type: ContentType
  source_url: string
  brand_name: string | null
  published_at: string | null
  collected_at: string
  region: Region
  language: string
  country: string | null
  engagement_likes: number
  engagement_comments: number
  engagement_shares: number
  engagement_views: number
  engagement_saves: number
  engagement_score: number
  quality_score: number
  is_featured: boolean
  raw_media_urls: string[] | null
  metadata: Record<string, unknown>
  // 关联数据（按需 join）
  source?: Source
  brand?: Brand | null
  analysis?: CaseAnalysis[]
  tags?: { tag: Tag }[]
}

export interface CaseAnalysis {
  id: string
  case_id: string
  emotional_triggers: string[]
  spread_mechanism: string[]
  creative_technique: string[]
  target_audience: string[]
  timing_factors: string[]
  platform_fit_reason: string | null
  hook_type: string | null
  cta_strategy: string | null
  funnel_stage: FunnelStage | null
  differentiation: string | null
  virality_score: number
  virality_reasons: string[]
  replicability_score: number
  replicability_notes: string | null
  key_takeaways: string[]
  applicable_industries: string[]
  applicable_scenarios: string[]
  model_used: string | null
  confidence_score: number | null
  analysis_version: number
  created_at: string
}

export interface Tag {
  id: string
  name: string
  name_cn: string | null
  category: string | null
  usage_count: number
}
```

---

## 6. 常见场景示例

### 首页：精选 + 最新

```typescript
// 并行请求
const [featured, latest] = await Promise.all([
  supabase
    .from('cases')
    .select('id, title, summary, brand_name, raw_media_urls, content_type, quality_score')
    .eq('is_featured', true)
    .order('quality_score', { ascending: false })
    .limit(6),

  supabase
    .from('cases')
    .select('id, title, title_cn, brand_name, raw_media_urls, content_type, published_at, region')
    .order('published_at', { ascending: false })
    .limit(20),
])
```

### 案例详情页

```typescript
async function getCaseDetail(id: string) {
  const { data } = await supabase
    .from('cases')
    .select(`
      *,
      source:sources(id, name, name_cn, url),
      brand:brands(id, name, name_cn, logo_url, industry),
      analysis:case_analysis(
        virality_score, virality_reasons,
        emotional_triggers, spread_mechanism, creative_technique,
        target_audience, timing_factors,
        hook_type, funnel_stage, differentiation,
        key_takeaways, applicable_industries, applicable_scenarios,
        replicability_score, replicability_notes
      ),
      tags:case_tags(tag:tags(id, name, name_cn, category))
    `)
    .eq('id', id)
    .single()

  return data
}
```

### 搜索页

```typescript
async function searchCases(keyword: string, filters: {
  region?: Region
  contentType?: ContentType
  page?: number
}) {
  let query = supabase
    .from('cases')
    .select('id, title, title_cn, summary, brand_name, raw_media_urls, content_type, published_at, region', { count: 'exact' })
    .or(`title.ilike.%${keyword}%,raw_text.ilike.%${keyword}%`)

  if (filters.region) query = query.eq('region', filters.region)
  if (filters.contentType) query = query.eq('content_type', filters.contentType)

  const page = filters.page ?? 0
  query = query.order('quality_score', { ascending: false }).range(page * 20, page * 20 + 19)

  return query
}
```

---

## 7. 注意事项

**anon key 权限**: 所有表只读，无需登录即可查询。不要在前端使用 service_role key。

**`raw_media_urls`**: 直接来自爬虫，部分 URL 可能失效或有防盗链。建议前端做图片加载失败的降级处理。

**`quality_score` 为 0**: 表示该案例尚未完成 AI 分析，`case_analysis` 表中可能没有对应记录。

**时间字段**: 均为 ISO 8601 格式，带时区（UTC）。前端展示时注意转换为本地时区。

**数组字段**: `emotional_triggers`、`spread_mechanism` 等均为 PostgreSQL 数组，JS 中直接作为 `string[]` 使用。