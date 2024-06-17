type ChordLyricPair = {
	chord: string | null;
	lyric: string | null;
};

type Section = {
	name: string | null;
	lines: Array<Array<ChordLyricPair>> | null;
};

type ChartType = {
	title: string | null;
	artist: string | null;
	tempo: string | null;
	sections: Array<Section> | null;
};

function parseDirective(line: string | undefined) {
	if (!line) return [];
	return line
		.trim()
		.replace("{", "")
		.replace("}", "")
		.split(":")
		.map((v) => v.trim());
}

function parseChordLyricPairs(line: string) {
	const pairs = [];
	for (const item of line.split("[")) {
		if (!item.includes("]")) {
			pairs.push({ chord: null, lyric: item });
			continue;
		}
		const [chord, lyric] = item.split("]");
		pairs.push({ chord, lyric });
	}
	return pairs;
}

export function parseDoc(doc: string | null) {
	const Chart: ChartType = {
		title: null,
		artist: null,
		tempo: null,
		sections: null,
	};
	if (!doc) return Chart;
	let sectionIndex = 0;
	for (const line of doc.split("\n")) {
		const directive = line.match(/\s*\{[^{}:]+:\s*[^{}]+\}\s*/);
		const [key, value] = parseDirective(directive?.[0]);
		switch (key) {
			case "title":
				Chart.title = value;
				break;
			case "artist":
				Chart.artist = value;
				break;
			case "tempo":
				Chart.tempo = value;
				break;
			case "section":
				if (Chart.sections) {
					sectionIndex++;
					Chart.sections.push({ name: value, lines: null });
				} else {
					Chart.sections = [{ name: value, lines: null }];
				}
				break;
			default: {
				if (!line.trim().length) break;
				const pairs = parseChordLyricPairs(line);
				const section = Chart.sections?.[sectionIndex];
				if (!section) {
					Chart.sections = [{ name: null, lines: [pairs] }];
					break;
				}
				if (!section?.lines) {
					section.lines = [pairs];
					break;
				}
				section.lines.push(pairs);
			}
		}
	}

	return Chart;
}
