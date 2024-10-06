import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SelectSong } from "@/server/db/schema";
import { getSongsList } from "@/server/queries";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function Songs() {
	const songs = await getSongsList();

	return (
		<div className="flex flex-wrap gap-4">
			{songs.map((song) => (
				<SongCard key={song.songId} song={song} />
			))}
			<AddSongCard />
		</div>
	);
}

function SongCard(props: { song: SelectSong }) {
	return (
		<Link href={`/song/${props.song.songId}`}>
			<Card className="transition duration-75 w-[250px] hover:border-muted-foreground">
				<CardHeader>
					<CardTitle>{props.song.title}</CardTitle>
					<CardDescription>{props.song.artist}</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
}

function AddSongCard() {
	return (
		<Link href="/add-song">
			<div className="flex justify-center items-center h-full rounded-md border-2 border-dashed transition duration-75 w-[250px] hover:border-muted-foreground">
				<Plus className="stroke-muted-foreground" />
			</div>
		</Link>
	);
}
