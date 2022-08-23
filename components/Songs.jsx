import { useRecoilValue } from "recoil";
import { playlistAtom } from "../atom/playlistAtom";
import Song from "./Song";

function Songs() {
	const playlist = useRecoilValue(playlistAtom);
	return (
		<div className="md:px-8 flex flex-col space-y-1 pb-28">
			{playlist?.tracks
				? playlist?.tracks.items.map((item, idx) => <Song key={item.track.id} track={item.track} order={idx} />)
				: playlist?.items.map((item, idx) => <Song key={item.track.id} track={item.track} order={idx} />)}
		</div>
	);
}

export default Songs;
