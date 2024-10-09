"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { SelectSong } from "@/server/db/schema";
import { insertSet } from "@/server/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Title must be at least 2 characters",
	}),
	date: z.date().min(new Date(), {
		message: "Date must be in the future",
	}),
	songs: z.array(z.object({ songId: z.string() })).nonempty({
		message: "Must add at least one song",
	}),
});

export default function CreateSetDialog(props: { songs: Array<SelectSong> }) {
	const [term, setTerm] = useState("");
	const [filteredSongs, setFilteredSong] = useState<Array<SelectSong>>([]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			date: new Date(),
			songs: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "songs",
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await insertSet({ title: values.name, date: values.date }, values.songs);
	}

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
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="flex gap-4 items-center">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Young Adults" {...field} />
										</FormControl>
										<FormDescription>This is the title of the set</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-[240px] pl-3 text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
														<CalendarIcon className="ml-auto w-4 h-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="p-0 w-auto" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) => date < new Date()}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormDescription>Used for organzing your sets</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormItem className="flex flex-col">
							<FormLabel>Add Songs</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button variant="outline" className="justify-start w-[250px]">
											<Search className="mr-2 w-4 h-4" />
											Search songs
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent>
									<div className="flex flex-col gap-4">
										<Input
											className="border-none focus-visible:outline-none"
											placeholder="Search songs..."
											onChange={(e) => setTerm(e.target.value)}
										/>
										<ul className="flex flex-col gap-4">
											{props.songs.map((song) => (
												<li key={song.songId}>
													<button
														type="button"
														onClick={() => {
															append({ songId: song.songId });
														}}
													>
														{song.title}
													</button>
												</li>
											))}
										</ul>
									</div>
								</PopoverContent>
							</Popover>
							<FormMessage />
							<ul>
								{fields.map((field, index) => (
									<li key={field.songId} className="flex gap-4">
										<p>{props.songs.find((s) => s.songId === field.songId)?.title}</p>
										<button type="button" onClick={() => remove(index)}>
											<X className="w-4 h-4" />
										</button>
									</li>
								))}
							</ul>
						</FormItem>
						<DialogFooter>
							<Button type="submit">Create Set</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
