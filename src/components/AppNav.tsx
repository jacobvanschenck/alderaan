import Link from "next/link";
import SignIn from "./SigninButton";

export default function AppNav() {
	return (
		<nav className="flex justify-between items-center px-4 pt-4 pb-2">
			<Link href="/dashboard">
				<h1 className="text-xl font-semibold">Hallal</h1>
			</Link>
			<SignIn />
		</nav>
	);
}
