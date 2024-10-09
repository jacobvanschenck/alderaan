import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getSetsList, getSongsList } from "@/server/queries";
import type { SelectSet } from "@/server/db/schema";
import CreateSetDialog from "./_components/CreateSetDialog";

export default async function Setlists() {
	const setsList = await getSetsList();
	const songs = await getSongsList();

	return (
		<div className="flex flex-wrap gap-4">
			<CreateSetDialog songs={songs} />
			{setsList.map((set) => (
				<SetCard key={set.setId} set={set} />
			))}
		</div>
	);
}

function SetCard(props: { set: SelectSet }) {
	return (
		<Link href={`/set/${props.set.setId}`}>
			<Card className="transition duration-75 w-[300px] hover:border-muted-foreground">
				<CardHeader>
					<CardTitle>{props.set.title}</CardTitle>
					<CardDescription>{props.set.date.toLocaleString()}</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
}
