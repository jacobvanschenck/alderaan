import DashboardNav from "@/components/DashboardNav";
import type { ReactNode } from "react";

export default function DashboardLayout(props: { children: ReactNode }) {
	return (
		<>
			<DashboardNav />
			<main className="p-4">{props.children}</main>
		</>
	);
}
