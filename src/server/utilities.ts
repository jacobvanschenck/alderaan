import type { Song } from "./queries";

export function buildSongFromContentString(input: string | undefined | null) {
	if (!input) return;
	const inputSections = input.split("\n\n");
	const sections = [];
	const updatedSong: Song = { content: input };
	for (const s of inputSections) {
		const lines = s.split("\n");
		let title: string | undefined;
		const contentBuff = [];
		for (const line of lines) {
			if (line[0] === "{") {
				const { key, value } = parseDirective(line);
				switch (key) {
					case "title":
						updatedSong.title = value;
						continue;
					case "artist":
						updatedSong.artist = value;
						continue;
					case "tempo":
						updatedSong.tempo = value;
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
	updatedSong.sections = sections;
	return updatedSong;
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
