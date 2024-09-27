import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { song } from "mock-data";

export default function SongPage(props: { params: { id: string } }) {
	return (
		<div className="flex gap-4">
			<ChartInputArea />
			<ChordChart song={song} />
		</div>
	);
}

function ChartInputArea() {
	return (
		<div className="flex-1">
			<form className="grid gap-2 w-full">
				<Textarea rows={25} name="chord-text-area" placeholder="Type your message here." />
				<Button type="submit">save</Button>
			</form>
		</div>
	);
}

function ChordChart(props: { song: any }) {
	return (
		<div className="flex-1">
			<ScrollArea className="flex flex-col gap-4 rounded-md border max-h-[80dvh]">
				<div className="p-4">
					<div>
						<p className="text-lg font-semibold">{song.title}</p>
						<p className="text-xs italic">{song.artist}</p>
					</div>
					{song.sections.map((s, i) => (
						<div key={i}>
							<p className="pt-6 font-semibold">{s.title}</p>
							{s.content.split("\n").map((l, i) => (
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
