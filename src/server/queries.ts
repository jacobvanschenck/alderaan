"use server";

import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { songs } from "./db/schema";
import { buildSongFromContentString } from "./utilities";

export type Song = {
	title?: string | null;
	artist?: string | null;
	tempo?: string | null;
	content?: string | null;
	sections?: Array<SongSection>;
	songId?: number | null;
};

export type SongSection = {
	title?: string;
	content?: string;
	lyrics?: string;
};

export async function getSong(id: number) {
	const songData = await db.query.songs.findFirst({
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
		.insert(songs)
		.values({
			songId: newSong.songId ?? undefined,
			title: newSong.title,
			artist: newSong.artist,
			tempo: newSong.tempo,
			content: newSong.content,
		})
		.onConflictDoUpdate({
			target: songs.songId,
			set: { title: newSong.title, artist: newSong.artist, tempo: newSong.tempo, content: newSong.content },
		})
		.returning({ songId: songs.songId });

	revalidatePath("/dashboard/songs");
	redirect("/dashboard/songs");
}

export async function getSongsList() {
	const songsData = await db.query.songs.findMany({
		orderBy: (fields, { asc }) => asc(fields.title),
	});

	if (!songsData) throw new Error("No songs for this user");

	return songsData;
}
