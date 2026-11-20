import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const packageCategories = ["photo", "wedding"] as const;

export const bookingStatuses = ["pending", "contacted", "booked", "cancelled"] as const;
export type BookingStatus = (typeof bookingStatuses)[number];

const createdAtColumn = () =>
  text("created_at").notNull().default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`);

/** 拍摄套系（婚纱摄影 / 婚礼跟拍） */
export const packages = sqliteTable("packages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  category: text("category", { enum: packageCategories }).notNull().default("photo"),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  badge: text("badge"),
  description: text("description").notNull().default(""),
  features: text("features", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  coverImage: text("cover_image").notNull().default(""),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAtColumn(),
}, (table) => [check("package_category", sql`${table.category} in ('photo', 'wedding')`)]);

/** 作品集 */
export const portfolioItems = sqliteTable("portfolio_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull().default(""),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAtColumn(),
});

/** 新人好评 */
export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  coupleName: text("couple_name").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAtColumn(),
});

/** 摄影团队 */
export const photographers = sqliteTable("photographers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  title: text("title").notNull().default(""),
  years: integer("years").notNull().default(0),
  bio: text("bio").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

/** 预约咨询线索 */
export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  coupleName: text("couple_name").notNull(),
  phone: text("phone").notNull(),
  wechat: text("wechat").notNull().default(""),
  weddingDate: text("wedding_date"),
  packageId: integer("package_id").references(() => packages.id, { onDelete: "set null" }),
  packageName: text("package_name").notNull().default(""),
  city: text("city").notNull().default(""),
  message: text("message").notNull().default(""),
  status: text("status", { enum: bookingStatuses }).notNull().default("pending"),
  createdAt: createdAtColumn(),
}, (table) => [check("booking_status", sql`${table.status} in ('pending', 'contacted', 'booked', 'cancelled')`)]);

export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type NewPortfolioItem = typeof portfolioItems.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
export type Photographer = typeof photographers.$inferSelect;
export type NewPhotographer = typeof photographers.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
