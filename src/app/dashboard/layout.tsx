import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ReactNode } from "react";

function DashboardNav() {
	return (
		<nav className="border-b">
			<div className="flex justify-between items-center p-4">
				<h1 className="text-xl font-semibold">Dashboard</h1>
				<Avatar>
					<AvatarFallback>JV</AvatarFallback>
				</Avatar>
			</div>
		</nav>
	);
}

export default function DashboardLayout(props: { children: ReactNode }) {
	return (
		<>
			<DashboardNav />
			<section>{props.children}</section>
		</>
	);
}
