import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atom/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";

function Song({ track, order }) {
	const spotifyApi = useSpotify();
	const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

	const playSong = () => {
		setCurrentTrackId(track.id);
		setIsPlaying(true);
		spotifyApi.play({
			uris: [track.uri],
		});
	};

	return (
		<div
			onClick={playSong}
			className="grid grid-cols-2 text-gray-500 text-xs md:text-sm py-3 px-5 hover:bg-gray-900 rounded-lg cursor-pointer">
			<div className="flex items-center space-x-4">
				<p>{order + 1}</p>
				<img src={track.album.images?.[0].url} alt={track.album.name} className="h-10 w-10" />
				<div>
					<p
						className={`${
							currentTrackId === track.id ? "text-green-500" : "text-white"
						} font-semibold text-sm w-36 lg:w-64 truncate`}>
						{track.name}
					</p>
					<p className="text-xs w-40 truncate">{track.artists?.[0].name}</p>
				</div>
			</div>
			<div className="flex items-center justify-between ml-auto md:ml-0">
				<p className="hidden md:block w-40">{track.album.name}</p>
				<p className="">{millisToMinutesAndSeconds(track.duration_ms)}</p>
			</div>
		</div>
	);
}

export default Song;
