import { sql } from "drizzle-orm";
import { pgTableCreator, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `alderaan_${name}`);

export const songsTable = createTable("songs", {
	songId: uuid("song_id").primaryKey().defaultRandom(),
	title: varchar("title", { length: 256 }),
	artist: varchar("artist", { length: 256 }),
	tempo: varchar("tempo", { length: 256 }),
	content: text("content"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
});

export type SelectSong = typeof songsTable.$inferSelect;
export type InsertSong = typeof songsTable.$inferInsert;

export const setsTable = createTable("sets", {
	setId: uuid("set_id").primaryKey().defaultRandom(),
	date: timestamp("date", { withTimezone: true }).notNull(),
	title: varchar("title", { length: 256 }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
});

export type SelectSet = typeof setsTable.$inferSelect;
export type InsertSet = typeof setsTable.$inferInsert;

export const songSetsTable = createTable(
	"song_sets",
	{
		setId: uuid("set_id").references(() => setsTable.setId),
		songId: uuid("song_id").references(() => songsTable.songId),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.setId, table.songId] }),
	}),
);
