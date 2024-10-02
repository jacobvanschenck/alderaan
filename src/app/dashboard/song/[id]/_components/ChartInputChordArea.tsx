"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { Song } from "@/server/queries";
import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from "react";

export default function ChartInputChordArea(props: { song: Song }) {
	const [input, setInput] = useState<string>(props.song?.sections?.map((s) => s?.content).join("\n\n") ?? "");
	const [song, setSong] = useState<Song>(props.song);

	const parseInput = useCallback((input: string | undefined) => {
		if (!input) return;
		const inputSections = input.split("\n\n");
		const sections = [];
		const songData: Song = {};
		for (const s of inputSections) {
			const lines = s.split("\n");
			let title: string | undefined;
			let content = "";
			for (const line of lines) {
				if (line[0] === "{") {
					const { key, value } = parseDirective(line);
					switch (key) {
						case "title":
							songData.title = value;
							continue;
						case "artist":
							songData.artist = value;
							continue;
						case "tempo":
							songData.tempo = value;
							continue;
						case "key":
							songData.key = value;
							continue;
						case "label":
							title = value;
							break;
						default:
							break;
					}
				} else {
					content += `${line}\n`;
				}
			}
			if (content.trim() || title) {
				sections.push({ title, content });
			}
		}
		songData.sections = sections;
		setSong(songData);
	}, []);

	function parseDirective(directive: string) {
		const regex = /{(\w+):\s*([^}]+)}/;
		const matches = directive.match(regex);
		if (!matches) return { key: undefined, value: undefined };
		const key = matches[1];
		const value = matches[2];
		if (!key || !value) return { key: undefined, value: undefined };
		return { key, value };
	}

	useEffect(() => {
		parseInput(input);
	}, [parseInput, input]);
	return (
		<div className="flex gap-4">
			<ChartInputArea input={input} setInput={setInput} />
			<ChordChart song={song} />
		</div>
	);
}

function ChartInputArea(props: { input: string | undefined; setInput: Dispatch<SetStateAction<string | undefined>> }) {
	return (
		<div className="flex-1">
			<form className="grid gap-2 w-full">
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
							{s.content?.split("\n").map((l, i) => (
								<div key={i} className="flex">
									{l.split("[").map((split, splitIndex) => {
										if (!split) return;
										let pair: Array<string | undefined> = [undefined, undefined];
										if (!split.includes("]")) {
											pair = [
												undefined,
												split
													.split("")
													.map((char) => (char === " " ? "\xA0" : char))
													.join(""),
											];
										} else {
											let [chord, lyric, ...rest] = split.split("]");
											if (lyric?.trim().length) {
												lyric = lyric
													?.split("")
													.map((char) => (char === " " ? "\xA0" : char))
													.join("");
											}
											pair = [chord, lyric];
										}
										return (
											<div className="flex flex-col pt-2" key={`pair-div-${i}-group-${splitIndex}`}>
												<p className="font-bold leading-4" key={`pair-span-1-group-${splitIndex}`}>
													{pair[0] ?? <span>&nbsp;</span>}
												</p>
												<p className="leading-4" key={`pair-span-2-group-${splitIndex}`}>
													{pair[1] ?? <span>&nbsp;</span>}
												</p>
											</div>
										);
									})}
								</div>
							))}
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
