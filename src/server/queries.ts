"use server";

import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type InsertSet, setsTable, songSetsTable, songsTable } from "./db/schema";
import { buildSongFromContentString } from "./utilities";
import { asc, ilike } from "drizzle-orm";

export type Song = {
	title?: string | null;
	artist?: string | null;
	tempo?: string | null;
	content?: string | null;
	sections?: Array<SongSection>;
	songId?: string | null;
};

export type SongSection = {
	title?: string;
	content?: string;
	lyrics?: string;
};

export async function getSong(id: string) {
	const songData = await db.query.songsTable.findFirst({
		where: (model, { eq }) => eq(model.songId, id),
	});

	if (!songData) throw new Error("Song not found.");

	const song = buildSongFromContentString(songData.content);

	return song ? { ...song, songId: songData.songId } : songData;
}

export async function insertSong(newSong: Song) {
	if (!newSong) throw new Error("No song given.");
	if (!newSong.title) throw new Error("Song must contain a title");
	if (!newSong.content) throw new Error("Song has no content");

	const returning = await db
		.insert(songsTable)
		.values({
			songId: newSong.songId ?? undefined,
			title: newSong.title,
			artist: newSong.artist,
			tempo: newSong.tempo,
			content: newSong.content,
		})
		.onConflictDoUpdate({
			target: songsTable.songId,
			set: { title: newSong.title, artist: newSong.artist, tempo: newSong.tempo, content: newSong.content },
		})
		.returning({ songId: songsTable.songId });

	revalidatePath("/dashboard/songs");
	redirect("/dashboard/songs");
}

export async function getSongsList() {
	const songsData = await db.select().from(songsTable).orderBy(asc(songsTable.title));

	if (!songsData) throw new Error("No songs for this user");

	return songsData;
}

export async function getSetsList() {
	const setsData = await db.select().from(setsTable).orderBy(asc(setsTable.date));

	if (!setsData) throw new Error("No sets for this user");

	return setsData;
}

export async function filterSongs(term: string | undefined) {
	const songsData = await db
		.select()
		.from(songsTable)
		.where(ilike(songsTable.title, `%${term}%`));

	if (!songsData) throw new Error("No songs found");

	return songsData;
}

export async function getSet(id: string) {
	const setData = await db.query.setsTable.findFirst({
		where: (model, { eq }) => eq(model.setId, id),
	});

	if (!setData) throw new Error("Set not found.");

	return setData;
}

export async function insertSet(newSet: InsertSet, songIds: Array<{ songId: string }>) {
	const returning = await db
		.insert(setsTable)
		.values({
			setId: newSet.setId,
			title: newSet.title,
			date: newSet.date,
		})
		.onConflictDoUpdate({
			target: setsTable.setId,
			set: {
				title: newSet.title,
				date: newSet.date,
			},
		})
		.returning({ setId: setsTable.setId });

	await db.insert(songSetsTable).values(songIds.map((obj) => ({ songId: obj.songId, setId: returning[0]?.setId })));
}
