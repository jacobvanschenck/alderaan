import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SelectSong } from "@/server/db/schema";
import { getSongsList } from "@/server/queries";
import Link from "next/link";
import AddNewCard from "@/components/AddNewCard";

export default async function Songs() {
	const songs = await getSongsList();

	return (
		<div className="flex flex-wrap gap-4">
			<AddNewCard link="/add-song" />
			{songs.map((song) => (
				<SongCard key={song.songId} song={song} />
			))}
		</div>
	);
}

function SongCard(props: { song: SelectSong }) {
	return (
		<Link href={`/song/${props.song.songId}`}>
			<Card className="transition duration-75 w-[300px] hover:border-muted-foreground">
				<CardHeader>
					<CardTitle>{props.song.title}</CardTitle>
					<CardDescription>{props.song.artist}</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
}
