import type { Song } from "@/server/queries";

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

export function parseInput(input: string | undefined) {
	if (!input) return;
	const inputSections = input.split("\n\n");
	const sections = [];
	const songData: Song = {};
	for (const s of inputSections) {
		const lines = s.split("\n");
		let title: string | undefined;
		const contentBuff = [];
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
						continue;
					default:
						continue;
				}
			}
			contentBuff.push(line);
		}
		const content = contentBuff.join("\n");
		if (content.trim() || title) {
			sections.push({ title, content });
		}
	}
	songData.sections = sections;
	return songData;
}

function parseDirective(directive: string) {
	const regex = /{(\w+):\s*([^}]+)}/;
	const matches = directive.match(regex);
	if (!matches) return { key: undefined, value: undefined };
	const key = matches[1];
	const value = matches[2];
	if (!key || !value) return { key: undefined, value: undefined };
	return { key, value };
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
