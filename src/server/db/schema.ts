import { relations, sql } from "drizzle-orm";
import { integer, pgTableCreator, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `alderaan_${name}`);

export const songs = createTable("songs", {
	songId: serial("song_id").primaryKey(),
	title: varchar("title", { length: 256 }),
	artist: varchar("artist", { length: 256 }),
	key: varchar("key", { length: 256 }),
	tempo: varchar("tempo", { length: 256 }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
});

export const sections = createTable("sections", {
	sectionId: serial("section_id").primaryKey(),
	songId: integer("song_id"),
	title: varchar("title", { length: 256 }),
	content: text("content"),
	lyrics: text("lyrics"),
	order: integer("order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
});

export const sectionRelations = relations(sections, ({ one }) => ({
	song: one(songs, {
		fields: [sections.songId],
		references: [songs.songId],
	}),
}));

export const songRelations = relations(songs, ({ many }) => ({
	sections: many(sections),
}));

export type SelectSong = typeof songs.$inferSelect;
export type InsertSong = typeof songs.$inferInsert;

export type SelectSection = typeof sections.$inferSelect;
export type InsertSection = typeof sections.$inferInsert;
