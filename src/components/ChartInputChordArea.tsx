"use client";

import { Button } from "@/components/ui/button";
import { ChordChart } from "@/components/ChordChart";
import { Textarea } from "@/components/ui/textarea";
import { type Song, insertSong } from "@/server/queries";
import { buildSongFromContentString } from "@/server/utilities";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export default function ChartInputChordArea(props: { song?: Song }) {
	const [input, setInput] = useState<string | undefined>(props.song?.content ?? undefined);
	const [song, setSong] = useState<Song | undefined>(props.song);

	useEffect(() => {
		const parsedSong = buildSongFromContentString(input);
		if (!parsedSong) return;
		setSong(parsedSong);
	}, [input]);

	return (
		<div className="flex gap-4">
			<ChartInputArea input={input} setInput={setInput} song={song} songId={props.song?.songId} />
			<ChordChart song={song} />
		</div>
	);
}

function ChartInputArea(props: {
	input: string | undefined;
	setInput: Dispatch<SetStateAction<string | undefined>>;
	song: Song | undefined;
	songId: string | undefined | null;
}) {
	return (
		<div className="flex-1">
			<form
				className="grid gap-2 w-full"
				action={async () => {
					if (!props.song) return;
					await insertSong({
						title: props.song.title,
						artist: props.song.artist,
						tempo: props.song.tempo,
						content: props.input,
						songId: props.songId,
					});
				}}
			>
				<Textarea
					rows={25}
					name="chord-text-area"
					placeholder="Type your message here."
					value={props.input}
					onChange={(e) => {
						props.setInput(e.target.value);
					}}
				/>
				<Button type="submit">save</Button>
			</form>
		</div>
	);
}


