import { Plus } from "lucide-react";
import Link from "next/link";

export default function AddNewCard(props: { link: string }) {
	return (
		<Link href={props.link}>
			<div className="flex justify-center items-center h-24 rounded-md border-2 border-dashed transition duration-75 w-[300px] hover:border-muted-foreground">
				<Plus className="stroke-muted-foreground" />
			</div>
		</Link>
	);
}
