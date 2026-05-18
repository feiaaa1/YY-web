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
    raw_text: "瑞幸咖啡联合罗永浩，在品牌周年之际复刻了15年前星巴克点单的经典名场面。\n剧情以熟悉的公共记忆开场，再通过价格对比和品牌态度形成反转。",
    raw_text_cn: "瑞幸咖啡联合罗永浩，在品牌周年之际复刻了15年前星巴克点单的经典名场面。\n剧情以熟悉的公共记忆开场，再通过价格对比和品牌态度形成反转。",
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
        virality_reasons: ["罗永浩自带流量", "星巴克对标引发讨论", "情怀牌精准触达"],
        virality_detail: "这次传播的核心不是简单借名人声量，而是把一个已有公共记忆的商业场景重新搬到当下。罗永浩自带争议和讨论度，星巴克对标又天然生成话题张力，让用户不只是在看广告，而是在参与一次关于价格、品牌和时代变化的讨论。",
        creative_detail: "创意上采用复刻名场面加剧情反转的结构，先用怀旧感降低理解成本，再用品牌立场完成记忆锚定。故事化表达让价格优势不显得生硬，人物、场景和冲突共同承担了卖点传达。",
        strategy_detail: "策略重点在品牌认知层，通过热点人物和周年节点放大声量，再用限时联名推动社交讨论向购买转化。微博适合承接争议话题，小红书和短视频平台则适合沉淀二创内容。",
        key_takeaways: ["借势有争议的公众人物放大传播", "历史事件再演绎制造情怀共鸣", "对标行业老大获得免费流量"],
        takeaway_detail: "可借鉴之处在于先找到用户已经熟悉的社会记忆，再用品牌的新立场重新解释它。中小品牌未必需要同等量级代言人，也可以借助行业典型场景、经典梗或用户痛点制造讨论入口。",
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
    raw_text: "Nike's Find Your Greatness campaign focused on ordinary people rather than elite athletes, reframing greatness as something that can happen anywhere.",
    raw_text_cn: "耐克 Find Your Greatness 战役聚焦普通人而非精英运动员，把“伟大”重新定义为任何地点、任何人都能发生的日常行动。",
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
        virality_reasons: ["精准洞察普通人心理", "高水准的视听语言"],
        virality_detail: "它出圈的原因在于把大型体育赛事期间的注意力从明星和冠军身上移开，转向每个普通人的行动感。这个洞察足够普适，也足够反直觉，让观众在品牌价值观里看见自己。",
        creative_detail: "创意没有堆砌胜利瞬间，而是用素人故事和克制镜头传达一种更开放的伟大定义。反转视角让品牌精神从口号变成可以被感知的生活场景。",
        strategy_detail: "营销策略服务于品牌认知，强调长期价值认同而非即时销售。跨平台视频传播与社交标签共同扩散，让内容在奥运语境中获得持续讨论。",
        key_takeaways: ["找到社会情绪的最大公约数", "埋伏式营销的教科书操作"],
        takeaway_detail: "品牌如果要复制这类价值观表达，需要先确认自身资产能否支撑宏大命题。更轻量的做法，是把抽象价值落在具体人群和真实场景上，让用户先共情，再接受品牌主张。",
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
    raw_text: "喜茶携手 FENDI 推出联名饮品及周边，用强烈反差制造了“年轻人的第一件 FENDI”的社交话题。",
    raw_text_cn: "喜茶携手 FENDI 推出联名饮品及周边，用强烈反差制造了“年轻人的第一件 FENDI”的社交话题。",
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
        virality_reasons: ["强烈的品牌反差感", "黄黑视觉体系极具冲击力", "极低的奢侈品体验门槛"],
        virality_detail: "强烈的品牌落差是这次传播的第一推动力。奢侈品的稀缺感与茶饮的高频消费结合，瞬间降低了参与门槛，也放大了用户晒图和排队的动机。",
        creative_detail: "创意核心是把 FENDI 的视觉符号完整迁移到茶饮消费场景中，让杯身、周边和门店打卡形成统一记忆点。黄黑配色足够醒目，天然适合社交平台传播。",
        strategy_detail: "策略更靠近转化阶段，用联名周边、限量体验和线下排队制造 FOMO。小红书承担视觉种草，朋友圈承担身份展示，门店现场则把讨论转化为购买。",
        key_takeaways: ["反差感是最好的流量密码", "视觉符号的统一能极大降低传播成本"],
        takeaway_detail: "可借鉴的不是一定要绑定顶级奢侈 IP，而是寻找两个品牌资产之间的高反差关系，并把这种反差变成用户愿意展示的视觉证据。联名成功往往来自参与门槛、身份感和传播素材的同时成立。",
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
