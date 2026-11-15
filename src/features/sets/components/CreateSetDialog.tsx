"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { SelectSong } from "@/server/db/schema";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateSetForm from "../forms/CreateSetForm";

export default function CreateSetDialog(props: { songs: Array<SelectSong> }) {
	const [term, setTerm] = useState("");
	const [filteredSongs, setFilteredSong] = useState<Array<SelectSong>>([]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="flex justify-center items-center h-24 rounded-md border-2 border-dashed transition duration-75 hover:cursor-pointer w-[300px] group hover:border-muted-foreground">
					<Plus className="stroke-muted-foreground group-hover:stroke-foreground" />
				</div>
			</DialogTrigger>
			<DialogContent className="flex flex-col justify-start">
				<DialogHeader>
					<DialogTitle>Create New Setlist</DialogTitle>
					<DialogDescription>setlist description</DialogDescription>
				</DialogHeader>
				<CreateSetForm songs={props.songs} />
				<DialogFooter>
					<Button type="submit">Create Set</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
