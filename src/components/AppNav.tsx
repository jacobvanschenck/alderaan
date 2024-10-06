import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function AppNav() {
	return (
		<nav className="">
			<div className="flex justify-between items-center px-4 pt-4 pb-2">
				<Link href="/dashboard">
					<h1 className="text-xl font-semibold">Hallal</h1>
				</Link>
				<Avatar>
					<AvatarFallback>JV</AvatarFallback>
				</Avatar>
			</div>
		</nav>
	);
}
