import ChartInputChordArea from "@/components/ChartInputChordArea";
import { getSong } from "@/server/queries";

export default async function SongPage(props: { params: { id: string } }) {
	const song = await getSong(props.params.id);

	return <ChartInputChordArea song={song} />;
}
