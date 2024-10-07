"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { parseChordLyricLine } from "@/lib/utils";
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

function ChordChart(props: { song: Song | undefined }) {
	return (
		<div className="flex-1">
			<ScrollArea className="flex flex-col gap-4 rounded-md border max-h-[80dvh] min-h-[80dvh]">
				<div className="p-4">
					<div>
						<p className="text-lg font-semibold">{props.song?.title}</p>
						<p className="text-xs italic">{props.song?.artist}</p>
					</div>
					{props.song?.sections?.map((s, i) => (
						<div key={i}>
							<p className="pt-6 font-semibold">{s.title}</p>
							{s.content?.split("\n").map((l, i) => {
								const pairs = parseChordLyricLine(l);
								return (
									<div key={i} className="flex">
										{pairs.map((p, index) => (
											<div className="flex flex-col pt-2" key={`pair-div-${i}-group-${index}`}>
												<p className="font-bold leading-4" key={`pair-span-1-group-${index}`}>
													{p?.[0] ?? <span>&nbsp;</span>}
												</p>
												<p className="leading-4" key={`pair-span-2-group-${index}`}>
													{p?.[1] ?? <span>&nbsp;</span>}
												</p>
											</div>
										))}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
