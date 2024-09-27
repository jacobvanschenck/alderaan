import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardNav() {
	return (
		<nav className="border-b">
			<div className="flex justify-between items-center p-4">
				<h1 className="font-semibold">Dashboard</h1>
				<Avatar>
					<AvatarFallback>JV</AvatarFallback>
				</Avatar>
			</div>
		</nav>
	);
}
