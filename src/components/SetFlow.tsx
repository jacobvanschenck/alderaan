"use client";

import { ChordChart } from "@/components/ChordChart";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { type Song } from "@/server/queries";

export function SetFlow({ songs }: { songs: Array<Song> }) {
	const [currentSongIndex, setCurrentSongIndex] = useState(0);

	const goToNextSong = () => {
		setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
	};

	const goToPreviousSong = () => {
		setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
	};

	const currentSong = songs[currentSongIndex];

	if (!currentSong) return <div>No song to display</div>;

	return (
		<div className="flex items-center justify-center">
			<Button onClick={goToPreviousSong} className="absolute left-4 top-1/2 -translate-y-1/2">
				<ChevronLeftIcon className="h-8 w-8" />
			</Button>
			<ChordChart song={currentSong} />
			<Button onClick={goToNextSong} className="absolute right-4 top-1/2 -translate-y-1/2">
				<ChevronRightIcon className="h-8 w-8" />
			</Button>
		</div>
	);
}
