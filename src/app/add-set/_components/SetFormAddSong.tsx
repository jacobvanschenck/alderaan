"use client";

import SongCard from "@/components/SongCard";
import type { SelectSong } from "@/server/db/schema";
import { useState } from "react";
import AddSong from "../_components/AddSong";
import SetForm from "../_components/SetForm";

export function SetFormAddSong(props: { songs: Array<SelectSong> }) {
	const [filteredSongs, setFilteredSongs] = useState<Array<SelectSong>>([]);

	return (
		<div className="flex gap-8">
			<SetForm filteredSongs={filteredSongs} />
			<div className="flex flex-wrap flex-1 gap-4">
				<AddSong songs={props.songs} onSelect={(song) => setFilteredSongs((state) => [...state, song])} />
				{filteredSongs?.map((song) => (
					<SongCard key={song.songId} song={song} />
				))}
			</div>
		</div>
	);
}
