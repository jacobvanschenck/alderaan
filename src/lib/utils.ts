import type { Song } from "@/server/queries";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateInput(song: Song | undefined) {
	if (!song) return;

	const metaDataBuff = [];
	for (const key in song) {
		if (key === "sections") continue;
		const value = song[key as keyof typeof song];
		if (value) metaDataBuff.push(`{${key}: ${value}}`);
	}

	const inputBuff = [metaDataBuff.join("\n")];
	if (!song.sections) return inputBuff[0];

	for (const section of song.sections) {
		const sectionBuff = [];
		if (section.title) sectionBuff.push(`{label: ${section.title}}`);
		if (section.content) sectionBuff.push(section.content);

		const sectionContent = sectionBuff.join("\n");

		if (sectionContent) inputBuff.push(sectionContent);
	}

	const data = inputBuff.join("\n\n");
	return data;
}

export function parseChordLyricLine(line: string) {
	return line.split("[").map((split) => {
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
		return pair;
	});
}
