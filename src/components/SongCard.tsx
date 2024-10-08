import type { SelectSong } from "@/server/db/schema";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function SongCard(props: { song: SelectSong }) {
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
