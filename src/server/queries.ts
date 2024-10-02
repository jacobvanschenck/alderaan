import { db } from "@/server/db";

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

export async function getSong(id: number): Promise<Song> {
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
