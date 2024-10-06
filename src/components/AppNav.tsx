import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AppNav() {
	return (
		<nav className="">
			<div className="flex justify-between items-center px-4 pt-4">
				<h1 className="font-semibold">App Nav</h1>
				<Avatar>
					<AvatarFallback>JV</AvatarFallback>
				</Avatar>
			</div>
		</nav>
	);
}
