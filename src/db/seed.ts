import "dotenv/config";
import { count } from "drizzle-orm";
import { db, pool } from "@/db";
import {
  packages,
  photographers,
  portfolioItems,
  testimonials,
  type NewPackage,
  type NewPhotographer,
  type NewPortfolioItem,
  type NewTestimonial,
} from "@/db/schema";

/** Pexels 图片直链（按需裁切尺寸） */
const photo = (id: number, width: number, height: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${width}&h=${height}`;

const packageSeed: NewPackage[] = [
  {
    name: "轻奢经典",
    subtitle: "入门首选 · 精致留念",
    category: "photo",
    price: 2999,
    originalPrice: 3699,
    badge: null,
    description: "经典取景与自然光线，适合初次拍摄婚纱照的新人，轻松留下甜蜜合影。",
    features: ["外景 1 场（市内任选）", "服装 2 套 + 基础造型 1 次", "精修底片 20 张", "电子版婚纱影像 1 套"],
    coverImage: photo(9376816, 1200, 900),
    isFeatured: true,
    sortOrder: 1,
  },
  {
    name: "挚爱时光",
    subtitle: "最受欢迎 · 全景记录",
    category: "photo",
    price: 5999,
    originalPrice: 7299,
    badge: "最受欢迎",
    description: "多场景、多造型，兼顾风格与性价比，完整记录你们从相识到相守的故事。",
    features: ["外景 2 场（含 1 场跨城）", "服装 4 套 + 造型 2 次", "精修底片 50 张", "20P 婚纱实体相册 1 本", "专属化妆师全程跟拍"],
    coverImage: photo(20831563, 1200, 900),
    isFeatured: true,
    sortOrder: 2,
  },
  {
    name: "星河定制",
    subtitle: "私人订制 · 独家风格",
    category: "photo",
    price: 12999,
    originalPrice: 15999,
    badge: "高端定制",
    description: "从主题策划、场景选址到造型服装，由资深团队为你量身打造专属影像作品。",
    features: ["外景不限场次", "服装 6 套 + 造型 3 次", "精修底片 80 张", "30P 高端实体相册 + 水晶相册", "摄影师 + 助理双人团队", "赠送 4K 婚纱花絮短片"],
    coverImage: photo(14350272, 1200, 900),
    isFeatured: true,
    sortOrder: 3,
  },
  {
    name: "婚礼全程跟拍",
    subtitle: "记录仪式每一刻",
    category: "wedding",
    price: 3999,
    originalPrice: 4500,
    badge: null,
    description: "完整记录婚礼当天的仪式与宾客互动，抓拍每一个真情流露的瞬间。",
    features: ["婚礼当日 8 小时跟拍", "双机位 + 专业摄影师 2 名", "精修底片 100 张", "60 秒婚礼 MV 一支"],
    coverImage: photo(38482000, 1200, 900),
    isFeatured: false,
    sortOrder: 1,
  },
  {
    name: "婚礼纪实·至尊版",
    subtitle: "全天候 + 影片",
    category: "wedding",
    price: 8800,
    originalPrice: 9900,
    badge: "全天候",
    description: "从晨间准备到婚宴落幕全程陪伴，用照片与电影级短片还原你们最珍贵的一天。",
    features: ["婚礼全天 12 小时跟拍", "电影级婚礼短片 3–5 分钟", "精修底片 200 张", "赠送婚礼纪念相册 1 本", "迎宾、仪式、宴会全场景覆盖"],
    coverImage: photo(17529930, 1200, 900),
    isFeatured: false,
    sortOrder: 2,
  },
];

const portfolioSeed: NewPortfolioItem[] = [
  { title: "落日阳台 · 暖金时光", category: "外景", imageUrl: photo(15524745, 900, 1200), description: "黄昏时分的阳台，暖光勾勒出新人的轮廓。", isFeatured: true, sortOrder: 1 },
  { title: "湖畔烟火 · 相守", category: "外景", imageUrl: photo(20831563, 900, 1200), description: "湖边的落日与烟雾，写满浪漫的情绪。", isFeatured: false, sortOrder: 2 },
  { title: "林间暖阳", category: "外景", imageUrl: photo(3369163, 900, 1200), description: "自然光下的温柔对视，不需要太多摆拍。", isFeatured: false, sortOrder: 3 },
  { title: "花海拥吻", category: "外景", imageUrl: photo(34530271, 900, 1200), description: "被鲜花包围的拥抱，是属于春天的誓言。", isFeatured: false, sortOrder: 4 },
  { title: "晨光新娘", category: "内景", imageUrl: photo(38711980, 900, 1200), description: "晨光透过窗帘，记录新娘出嫁前的宁静时刻。", isFeatured: true, sortOrder: 5 },
  { title: "窗边的心事", category: "内景", imageUrl: photo(31118294, 900, 1200), description: "婚纱挂在窗边，属于新娘的私密仪式感。", isFeatured: false, sortOrder: 6 },
  { title: "黑白 · 婚纱之美", category: "内景", imageUrl: photo(5564225, 900, 1200), description: "黑白影调突出婚纱的质感与线条。", isFeatured: false, sortOrder: 7 },
  { title: "红墙之下", category: "中式", imageUrl: photo(18573869, 900, 1200), description: "国风服饰与古朴红墙，演绎东方婚礼的韵味。", isFeatured: true, sortOrder: 8 },
  { title: "红妆 · 喜庆", category: "中式", imageUrl: photo(33059912, 900, 1200), description: "大红主色调，喜庆又不失高级感。", isFeatured: false, sortOrder: 9 },
  { title: "古寺晨光", category: "中式", imageUrl: photo(34689412, 900, 1200), description: "在古刹的石阶上，静听时光流动。", isFeatured: false, sortOrder: 10 },
  { title: "釜山海边 · 清晨", category: "韩式", imageUrl: photo(34093683, 900, 1200), description: "海风与浪花，韩式清透色调的海边拍摄。", isFeatured: false, sortOrder: 11 },
  { title: "百合与你", category: "韩式", imageUrl: photo(29613057, 900, 1200), description: "一束白色百合，清新纯净的韩式风格。", isFeatured: true, sortOrder: 12 },
  { title: "十指相扣", category: "韩式", imageUrl: photo(30934241, 900, 1200), description: "特写的牵手，温柔又有力量。", isFeatured: false, sortOrder: 13 },
  { title: "圣洁之路", category: "教堂", imageUrl: photo(38482000, 900, 1200), description: "挽着父亲走过的红毯，是每个新娘最动人的瞬间。", isFeatured: true, sortOrder: 14 },
  { title: "誓言", category: "教堂", imageUrl: photo(17529930, 900, 1200), description: "教堂里的庄严时刻，见证彼此的承诺。", isFeatured: false, sortOrder: 15 },
  { title: "海边旅拍 · 城市微光", category: "旅拍", imageUrl: photo(14350272, 900, 1200), description: "海边与城市天际线，一次说走就走的旅行婚纱。", isFeatured: true, sortOrder: 16 },
  { title: "复古老爷车", category: "旅拍", imageUrl: photo(34677207, 900, 1200), description: "一辆老爷车，开启一段复古的爱情故事。", isFeatured: false, sortOrder: 17 },
];

const testimonialSeed: NewTestimonial[] = [
  {
    coupleName: "许佳 & 周航",
    content: "拍摄过程特别轻松，摄影师很会引导，我们就像在约会一样。成片的光线和色调超出预期，朋友圈被疯狂点赞！",
    rating: 5,
    sortOrder: 1,
  },
  {
    coupleName: "小鱼 & 阿哲",
    content: "从选套系到拿到底片，顾问全程耐心解答，没有任何隐形消费。化妆师手艺很好，妈妈看到照片时红了眼眶。",
    rating: 5,
    sortOrder: 2,
  },
  {
    coupleName: "Jessica & Ryan",
    content: "中式主题的服装和布景很有质感，修图自然，没有过度磨皮。非常推荐给喜欢真实感的新人。",
    rating: 5,
    sortOrder: 3,
  },
  {
    coupleName: "晓晓 & 明轩",
    content: "婚礼跟拍很细致，宾客互动的抓拍特别多，现在每次翻相册都会笑出声，谢谢拾光记录下我们的婚礼。",
    rating: 5,
    sortOrder: 4,
  },
];

const photographerSeed: NewPhotographer[] = [
  {
    name: "陈墨",
    title: "首席摄影师",
    years: 12,
    bio: "擅长自然光人像与纪实风格，作品多次入选国内婚纱摄影大赛。相信每一次快门，都是为了还原最真实的爱。",
    sortOrder: 1,
  },
  {
    name: "林小雨",
    title: "资深摄影师",
    years: 8,
    bio: "专注韩式清新与户外外景，镜头下的情绪温柔细腻，是许多新人心中的首选摄影师。",
    sortOrder: 2,
  },
  {
    name: "周延",
    title: "婚礼纪实摄影师",
    years: 9,
    bio: "累计拍摄数百场婚礼，擅长捕捉仪式中的情绪与细节，节奏把控稳，抓拍率高。",
    sortOrder: 3,
  },
];

/** 仅在对应数据表为空时写入示例数据，避免重复执行时覆盖真实数据 */
async function main() {
  const [{ value: packageCount }] = await db.select({ value: count() }).from(packages);
  if (packageCount === 0) {
    await db.insert(packages).values(packageSeed);
    console.log(`已写入 ${packageSeed.length} 个套系`);
  }

  const [{ value: portfolioCount }] = await db.select({ value: count() }).from(portfolioItems);
  if (portfolioCount === 0) {
    await db.insert(portfolioItems).values(portfolioSeed);
    console.log(`已写入 ${portfolioSeed.length} 件作品`);
  }

  const [{ value: testimonialCount }] = await db.select({ value: count() }).from(testimonials);
  if (testimonialCount === 0) {
    await db.insert(testimonials).values(testimonialSeed);
    console.log(`已写入 ${testimonialSeed.length} 条好评`);
  }

  const [{ value: photographerCount }] = await db.select({ value: count() }).from(photographers);
  if (photographerCount === 0) {
    await db.insert(photographers).values(photographerSeed);
    console.log(`已写入 ${photographerSeed.length} 位摄影师`);
  }

  console.log("种子数据检查完成");
}

main()
  .catch((error: unknown) => {
    console.error("种子数据写入失败：", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
