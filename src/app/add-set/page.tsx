import { getSongsList } from "@/server/queries";
import AddSong from "./_components/AddSong";

export default async function AddSet() {
	const songs = await getSongsList();
	return (
		<div>
			<AddSong songs={songs} />
		</div>
	);
}
