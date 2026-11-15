'use client'

import { type Song } from "@/server/queries";
import { parseChordLyricLine } from "@/utils";

export function ChordChart(props: { song: Song | undefined }) {
	return (
		<div className="w-full h-[calc(100vh-8rem)] px-12">
			<div className="h-full w-full rounded-md border p-4" style={{ columnFill: 'auto', columnCount: 2 }}>
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
		</div>
	);
}