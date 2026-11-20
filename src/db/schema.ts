import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const packageCategories = ["photo", "wedding"] as const;
export const packageCategoryEnum = pgEnum("package_category", packageCategories);

export const bookingStatuses = ["pending", "contacted", "booked", "cancelled"] as const;
export const bookingStatusEnum = pgEnum("booking_status", bookingStatuses);
export type BookingStatus = (typeof bookingStatuses)[number];

const createdAtColumn = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

/** 拍摄套系（婚纱摄影 / 婚礼跟拍） */
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  category: packageCategoryEnum("category").notNull().default("photo"),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  badge: text("badge"),
  description: text("description").notNull().default(""),
  features: jsonb("features").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  coverImage: text("cover_image").notNull().default(""),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAtColumn(),
});

/** 作品集 */
export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull().default(""),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAtColumn(),
});

/** 新人好评 */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  coupleName: text("couple_name").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAtColumn(),
});

/** 摄影团队 */
export const photographers = pgTable("photographers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull().default(""),
  years: integer("years").notNull().default(0),
  bio: text("bio").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

/** 预约咨询线索 */
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  coupleName: text("couple_name").notNull(),
  phone: text("phone").notNull(),
  wechat: text("wechat").notNull().default(""),
  weddingDate: date("wedding_date", { mode: "string" }),
  packageId: integer("package_id").references(() => packages.id, { onDelete: "set null" }),
  packageName: text("package_name").notNull().default(""),
  city: text("city").notNull().default(""),
  message: text("message").notNull().default(""),
  status: bookingStatusEnum("status").notNull().default("pending"),
  createdAt: createdAtColumn(),
});

export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type NewPortfolioItem = typeof portfolioItems.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
export type Photographer = typeof photographers.$inferSelect;
export type NewPhotographer = typeof photographers.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
