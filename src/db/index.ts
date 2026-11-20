import { drizzle } from "drizzle-orm/d1";

export const connect = (binding: D1Database) => drizzle(binding);
export type Database = ReturnType<typeof connect>;
