"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function DashboardLayout(props: { children: ReactNode; songs: ReactNode; setlists: ReactNode }) {
	const pathname = usePathname();

	return (
		<>
			<nav className="flex gap-4 border-b">
				<Link
					className={cn(pathname === "/dashboard" ? "font-semibold " : "text-muted-foreground", "w-24")}
					href="/dashboard"
				>
					Dashboard
				</Link>
				<Link
					className={cn(pathname.includes("dashboard/setlists") ? "font-semibold " : "text-muted-foreground", "w-24")}
					href="/dashboard/setlists"
				>
					Setlists
				</Link>
				<Link
					className={cn(pathname.includes("dashboard/songs") ? "font-semibold " : "text-muted-foreground", "w-24")}
					href="/dashboard/songs"
				>
					Songs
				</Link>
			</nav>
			<main className="pt-4">{props.children}</main>
		</>
	);
}
