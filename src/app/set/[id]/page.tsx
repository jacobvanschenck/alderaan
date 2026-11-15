import { SetFlow } from "@/components/SetFlow";
import { getSetSongs } from "@/server/queries";

export default async function SetPage({ params }: { params: { id: string } }) {
	const songs = await getSetSongs(params.id);

	return <SetFlow songs={songs} />;
}