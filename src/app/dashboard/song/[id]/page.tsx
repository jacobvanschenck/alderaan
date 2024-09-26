export default function SongPage(props: { params: { id: string } }) {
	return <div>Song: {props.params.id}</div>;
}
