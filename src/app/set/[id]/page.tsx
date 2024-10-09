import { getSet } from "@/server/queries";

export default async function SetPage(props: { params: { id: string } }) {
	const set = await getSet(props.params.id);

	return <p>{set.title}</p>;
}
