import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, signIn, signOut } from "@/server/auth";
import { Button } from "./ui/button";

export default async function SignIn() {
	const session = await auth();

	return (
		<>
			{!session?.user ? (
				<form
					action={async () => {
						"use server";
						await signIn("google");
					}}
				>
					<Button type="submit">Signin with Google</Button>
				</form>
			) : (
				<form
					action={async () => {
						"use server";
						await signOut();
					}}
				>
					<Button type="submit" variant="ghost">
						<Avatar>
							<AvatarImage src={session.user.image ?? ""} alt={`@${session.user.name}`} />
							<AvatarFallback>{`${session?.user.name?.[0]}${session?.user.name?.split(" ")?.[1]?.[0]}`}</AvatarFallback>
						</Avatar>
					</Button>
				</form>
			)}
		</>
	);
}
