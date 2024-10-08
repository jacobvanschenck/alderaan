"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { SelectSong } from "@/server/db/schema";
import { Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function AddSong(props: { songs: Array<SelectSong>; onSelect: (song: SelectSong) => void }) {
	const [term, setTerm] = useState("");
	const [filteredSongs, setFilteredSongs] = useState<Array<SelectSong>>(props.songs);

	const songContainsTerm = useCallback((song: SelectSong, term: string) => {
		return song.title?.toLowerCase().includes(term) || song.artist?.toLowerCase().includes(term);
	}, []);

	useEffect(() => {
		setFilteredSongs(props.songs.filter((s) => songContainsTerm(s, term)));
	}, [term, props, songContainsTerm]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Add Song</Button>
			</DialogTrigger>
			<DialogContent className="flex flex-col justify-start h-[800px] sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Add Song</DialogTitle>
				</DialogHeader>
				<div className="flex items-center px-3 w-full text-sm rounded-md border focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-input bg-background ring-offset-background group focus-within:ring-ring">
					<Search className="mr-2 w-4 h-4 opacity-50 shrink-0 group-focus-within:opacity-100" />
					<Input
						className="border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
						onChange={(e) => setTerm(e.target.value)}
					/>
				</div>
				<ScrollArea className="flex-1">
					{filteredSongs?.map((song) => (
						<>
							<button
								type="button"
								className="py-2 w-full text-left cursor-pointer"
								onClick={() => props.onSelect(song)}
								key={song.songId}
							>
								<p>{song.title}</p>
								<p className="text-xs text-muted-foreground">{song.artist}</p>
							</button>
							<Separator key={song.songId} />
						</>
					))}
				</ScrollArea>
				<DialogFooter>
					<Link href="add-song">
						<Button variant="link">Add New Song</Button>
					</Link>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
