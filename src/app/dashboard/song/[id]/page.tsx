"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
// import { song } from "mock-data";
import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from "react";

type Song = {
	title?: string;
	artist?: string;
	key?: string;
	tempo?: string;
	sections?: Array<SongSection>;
};

type SongSection = {
	title?: string;
	content?: string;
	lyrics?: string;
};

const mock_input = `{title: No Longer Slaves}
{artist: Jonathan and Melissa Helser}
{key: E}
{tempo: 74}

{label: Verse 1}
You unr[1]avel me with a melody 
You surr[4]ound me w[5]ith a s[1]ong
Of deli[1]verance from my enemies
'Til a[4]ll my fe[5]ars are g[1]one

{label: Chorus}
I'm no l[4]onger a s[5]lave to f[1]ear
I a[6m]m a c[5]hild of G[1]od

{label: Verse 2}
From my m[1]other's womb
You have chosen me
L[4]ove has c[5]alled my n[1]ame
I've been b[1]orn again into a family
Your b[4]lood flows t[5]hrough my v[1]eins

{label: Instrumental}
[6m][5][1][4]

{label: Bridge}
[6m]       You split the s[5]ea, so I could w[1]alk right t[4]hrough it
[6m]       My fears are d[5]rowned in perfect l[1]ov[4]e
[6m]       You rescued m[5]e and I will s[1]tand and s[1/3]ing
I a[6m]m a c[5]hild of G[1]od
`;

export default function SongPage(props: { params: { id: string } }) {
	const [input, setInput] = useState<string>(mock_input);
	const [song, setSong] = useState<Song>();

	console.log({ song });

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

function ChartInputArea(props: { input: string | undefined; setInput: Dispatch<SetStateAction<string>> }) {
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
