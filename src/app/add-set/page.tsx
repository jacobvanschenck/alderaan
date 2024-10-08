import { getSongsList } from "@/server/queries";
import { SetFormAddSong } from "./_components/SetFormAddSong";

export default async function AddSet() {
	const songs = await getSongsList();

	return <SetFormAddSong songs={songs} />;
}
