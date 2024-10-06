"use server";

import { db } from "@/server/db";
import { sections, songs } from "./db/schema";

export type Song = {
	title?: string | null;
	artist?: string | null;
	key?: string | null;
	tempo?: string | null;
	sections?: Array<SongSection>;
};

export type SongSection = {
	title?: string | null;
	content?: string | null;
	lyrics?: string | null;
};

export async function getSong(id: number) {
	const songData = await db.query.songs.findFirst({
		where: (model, { eq }) => eq(model.songId, id),
	});

	const sectionsData = await db.query.sections.findMany({
		where: (model, { eq }) => eq(model.songId, id),
		orderBy: (model, { asc }) => asc(model.order),
	});

	const song: Song = {
		title: songData?.title,
		artist: songData?.artist,
		tempo: songData?.tempo,
		key: songData?.key,
		sections: sectionsData,
	};

	return song;
}

export async function insertSong(newSong: Song) {
	if (!newSong) throw new Error("No song given.");
	if (!newSong.title) throw new Error("Song must contain a title");
	if (!newSong.sections) throw new Error("Song has no content");

	const existingSong = await db.query.songs.findFirst({
		where: (model, { eq }) => eq(model.title, newSong.title ?? ""),
	});

	const returning = await db
		.insert(songs)
		.values({ songId: existingSong?.songId, title: newSong.title, artist: newSong.artist, tempo: newSong.tempo })
		.onConflictDoUpdate({
			target: songs.songId,
			set: { title: newSong.title, artist: newSong.artist, tempo: newSong.tempo },
		})
		.returning({ songId: songs.songId });

	const songId = returning?.[0]?.songId;

	const newSections = newSong.sections.map((section, index) => ({ ...section, songId, order: index }));

	await db.insert(sections).values(newSections);
}
