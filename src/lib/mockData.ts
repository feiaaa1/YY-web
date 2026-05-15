import { CaseDetail, Tag } from '../types/database';

export const MOCK_CASES: CaseDetail[] = [
  {
    id: "case-1",
    title: "瑞幸×罗永浩：15年后，再现星巴克名场面",
    title_cn: null,
    summary: "瑞幸咖啡联合罗永浩，在品牌周年之际复刻了15年前星巴克点单的经典名场面。通过剧情反转和强烈的社交货币属性，引发全网热议与二次创作，成功传递了品牌价格优势。",
    content_type: "integrated_campaign",
    region: "cn",
    brand_name: "瑞幸咖啡",
    source_url: "https://www.digitaling.com",
    published_at: "2026-04-01T00:00:00Z",
    engagement_likes: 120000,
    engagement_comments: 34000,
    engagement_shares: 89000,
    engagement_views: 21000000,
    engagement_score: 96.5,
    quality_score: 92,
    raw_media_urls: ["https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=1200&h=800"],
    is_featured: true,
    brand: {
      id: "brand-1",
      name: "瑞幸咖啡",
      name_cn: null,
      logo_url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=100",
      industry: "餐饮",
      country: "CN"
    },
    source: {
      id: "src-1",
      name: "数英 DIGITALING",
      name_cn: "数英",
      url: "https://www.digitaling.com"
    },
    analysis: [
      {
        case_id: "case-1",
        emotional_triggers: ["怀旧", "共鸣", "争议"],
        spread_mechanism: ["社交货币", "话题争议", "UGC二创"],
        creative_technique: ["反转", "跨界", "故事化"],
        target_audience: ["80后", "职场人", "咖啡爱好者"],
        timing_factors: ["品牌周年", "热点人物"],
        platform_fit_reason: "微博话题属性强，适合争议性内容发酵",
        hook_type: "情绪",
        cta_strategy: "限时联名款，制造稀缺感",
        funnel_stage: "awareness",
        differentiation: "用历史事件制造戏剧张力，强化品牌记忆点",
        virality_score: 95,
        virality_reasons: ["罗永浩自带流量", "星巴克对标引发讨论", "情怀牌精准触达"],
        replicability_score: 72,
        replicability_notes: "需要有话题性代言人，中小品牌可借鉴争议性对标策略",
        key_takeaways: ["借势有争议的公众人物放大传播", "历史事件再演绎制造情怀共鸣", "对标行业老大获得免费流量"],
        applicable_industries: ["餐饮", "快消", "零售"],
        applicable_scenarios: ["品牌焕新", "新品上市", "周年营销"],
        model_used: "deepseek",
        confidence_score: 0.92,
        analysis_version: 1
      }
    ],
    assets: [
      {
        id: "asset-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=1200&h=800",
        description: "主视觉海报",
        sort_order: 1
      }
    ],
    tags: []
  },
  {
    id: "case-2",
    title: "Nike: 'Find Your Greatness' Global Campaign",
    title_cn: "耐克：发现你的伟大",
    summary: "围绕普通人而非专业运动员，展现日常运动中的伟大瞬间。反其道而行之的奥运赞助策略，赢得了比官方赞助商更多的社交讨论度。",
    content_type: "video_ad",
    region: "global",
    brand_name: "Nike",
    source_url: "https://www.canneslions.com",
    published_at: "2026-03-15T00:00:00Z",
    engagement_likes: 540000,
    engagement_comments: 89000,
    engagement_shares: 210000,
    engagement_views: 45000000,
    engagement_score: 98.2,
    quality_score: 95,
    raw_media_urls: ["https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=1200&h=800"],
    is_featured: true,
    brand: {
      id: "brand-2",
      name: "Nike",
      name_cn: null,
      logo_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100",
      industry: "运动服饰",
      country: "US"
    },
    source: {
      id: "src-2",
      name: "Cannes Lions",
      name_cn: "戛纳国际创意节",
      url: "https://www.canneslions.com"
    },
    analysis: [
      {
        case_id: "case-2",
        emotional_triggers: ["激励", "共情", "自我认同"],
        spread_mechanism: ["价值认同", "社会共识"],
        creative_technique: ["素人故事", "反转视角"],
        target_audience: ["泛运动人群", "年轻群体"],
        timing_factors: ["奥林匹克期间"],
        platform_fit_reason: "跨平台视频传播矩阵结合社交媒体的话题标签挑战",
        hook_type: "价值观共振",
        cta_strategy: "激发行动而非直接销售",
        funnel_stage: "awareness",
        differentiation: "打破『伟大属于精英』的刻板印象",
        virality_score: 92,
        virality_reasons: ["精准洞察普通人心理", "高水准的视听语言"],
        replicability_score: 60,
        replicability_notes: "需要深厚的品牌资产支撑价值观层面的诉求",
        key_takeaways: ["找到社会情绪的最大公约数", "埋伏式营销的教科书操作"],
        applicable_industries: ["全行业"],
        applicable_scenarios: ["重大体育赛事", "品牌重塑"],
        model_used: "deepseek",
        confidence_score: 0.95,
        analysis_version: 1
      }
    ],
    assets: [
      {
        id: "asset-2",
        type: "video",
        url: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=1200&h=800",
        description: "核心视频广告",
        sort_order: 1
      }
    ],
    tags: []
  },
  {
    id: "case-3",
    title: "喜茶 × FENDI：奢侈品与新茶饮的史诗级联名",
    title_cn: null,
    summary: "喜茶携手奢侈品牌FENDI推出联名饮品及周边，以极高的反差感和『年轻人的第一件FENDI』为话题，引发了现象级的排队与社交网络刷屏。",
    content_type: "kol_collaboration",
    region: "cn",
    brand_name: "喜茶 HEYTEA",
    source_url: "https://www.digitaling.com",
    published_at: "2026-05-10T00:00:00Z",
    engagement_likes: 250000,
    engagement_comments: 56000,
    engagement_shares: 120000,
    engagement_views: 32000000,
    engagement_score: 97.0,
    quality_score: 89,
    raw_media_urls: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=800"],
    is_featured: true,
    brand: {
      id: "brand-3",
      name: "喜茶 HEYTEA",
      name_cn: null,
      logo_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=100",
      industry: "餐饮",
      country: "CN"
    },
    source: {
      id: "src-1",
      name: "数英 DIGITALING",
      name_cn: "数英",
      url: "https://www.digitaling.com"
    },
    analysis: [
      {
        case_id: "case-3",
        emotional_triggers: ["猎奇", "炫耀", "稀缺"],
        spread_mechanism: ["社交货币", "视觉符号", "FOMO心理"],
        creative_technique: ["极端跨界", "视觉统一", "限量周边"],
        target_audience: ["Z世代", "白领", "时尚爱好者"],
        timing_factors: ["夏季新品期"],
        platform_fit_reason: "小红书视觉导向和微信朋友圈炫耀需求",
        hook_type: "视觉与身份标签",
        cta_strategy: "买茶送FENDI联名周边",
        funnel_stage: "conversion",
        differentiation: "高客单奢侈品与低客单快消的破壁结合",
        virality_score: 98,
        virality_reasons: ["强烈的品牌反差感", "黄黑视觉体系极具冲击力", "极低的奢侈品体验门槛"],
        replicability_score: 40,
        replicability_notes: "极其依赖顶级IP资源，难以复制",
        key_takeaways: ["反差感是最好的流量密码", "视觉符号的统一能极大降低传播成本"],
        applicable_industries: ["餐饮", "快消", "美妆"],
        applicable_scenarios: ["IP联名", "新品发售"],
        model_used: "deepseek",
        confidence_score: 0.88,
        analysis_version: 1
      }
    ],
    assets: [
      {
        id: "asset-3",
        type: "image",
        url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=800",
        description: "联名杯身及周边",
        sort_order: 1
      }
    ],
    tags: []
  }
];

export const MOCK_TAGS: Tag[] = [
  { id: "tag-1", name: "整合营销", name_cn: null, category: "手法" },
  { id: "tag-2", name: "视频营销", name_cn: null, category: "手法" },
  { id: "tag-3", name: "快消", name_cn: null, category: "行业" },
  { id: "tag-4", name: "跨界联名", name_cn: null, category: "手法" },
  { id: "tag-5", name: "社交货币", name_cn: null, category: "机制" },
];
