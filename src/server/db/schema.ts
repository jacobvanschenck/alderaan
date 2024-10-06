import { sql } from "drizzle-orm";
import { pgTableCreator, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `alderaan_${name}`);

export const songs = createTable("songs", {
	songId: serial("song_id").primaryKey(),
	title: varchar("title", { length: 256 }),
	artist: varchar("artist", { length: 256 }),
	tempo: varchar("tempo", { length: 256 }),
	content: text("content"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
});

export type SelectSong = typeof songs.$inferSelect;
export type InsertSong = typeof songs.$inferInsert;
