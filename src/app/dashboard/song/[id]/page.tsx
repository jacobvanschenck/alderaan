import { getSong } from "@/server/queries";
import ChartInputChordArea from "./_components/ChartInputChordArea";

export default async function SongPage(props: { params: { id: string } }) {
	const idAsNumber = Number(props.params.id);
	if (Number.isNaN(idAsNumber)) throw new Error("Invalid song id");

	const song = await getSong(Number(idAsNumber));

	return <ChartInputChordArea song={song} />;
}
