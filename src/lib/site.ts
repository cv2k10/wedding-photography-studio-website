/** 工作室基础信息：修改这里即可更新全站的名称、联系方式与导航 */
export const siteConfig = {
  name: "拾光婚纱摄影",
  nameEn: "SHIGUANG WEDDING",
  slogan: "用镜头，收藏你们最美的瞬间",
  description:
    "拾光婚纱摄影工作室，专注婚纱摄影、婚礼跟拍与定制影像，十余年匠心服务，陪伴每一对新人。",
  phone: "138-0000-0000",
  wechat: "shiguang_wedding",
  email: "hello@shiguang-wedding.com",
  address: "上海市静安区示例路 88 号 3 楼",
  hours: "每日 10:00 – 20:00（建议提前预约）",
  stats: [
    { value: "10+", label: "年专注经验" },
    { value: "8000+", label: "对新人的信赖" },
    { value: "20+", label: "专业摄影师" },
    { value: "15+", label: "外景拍摄基地" },
  ],
  nav: [
    { href: "/", label: "首页" },
    { href: "/portfolio", label: "作品展示" },
    { href: "/packages", label: "套系价格" },
    { href: "/about", label: "关于我们" },
  ],
  cta: { href: "/booking", label: "立即预约" },
} as const;

export const portfolioCategories = ["全部", "外景", "内景", "中式", "韩式", "教堂", "旅拍"] as const;
