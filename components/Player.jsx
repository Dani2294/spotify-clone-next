import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
	FastForwardIcon,
	PauseIcon,
	PlayIcon,
	ReplyIcon,
	RewindIcon,
	SwitchHorizontalIcon,
	VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atom/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
	const spotifyApi = useSpotify();
	const { data: session } = useSession();
	const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
	const [volume, setVolume] = useState(50);

	const songInfo = useSongInfo();

	// fetch the current playing song
	const fetchCurrentSong = useCallback(() => {
		if (!songInfo) {
			spotifyApi.getMyCurrentPlayingTrack().then((data) => {
				setCurrentTrackId(data.body?.item?.id);
			});

			spotifyApi.getMyCurrentPlaybackState().then((data) => {
				setIsPlaying(data.body?.is_playing);
			});
		}
	}, [spotifyApi, songInfo]);

	useEffect(() => {
		if (spotifyApi.getAccessToken() && !currentTrackId) {
			fetchCurrentSong();
			setVolume(50);
		}
	}, [currentTrackId, spotifyApi, fetchCurrentSong, session]);

	const debouncedAdjustVolume = useCallback(
		debounce((volume) => {
			spotifyApi.setVolume(volume);
		}, 500),
		[]
	);

	useEffect(() => {
		if (volume > 0 && volume < 100) {
			debouncedAdjustVolume(volume);
		}
	}, [volume, debouncedAdjustVolume]);

	const handlePlayPause = () => {
		spotifyApi.getMyCurrentPlaybackState().then((data) => {
			if (data.body?.is_playing) {
				spotifyApi.pause();
				setIsPlaying(false);
			} else {
				spotifyApi.play();
				setIsPlaying(true);
			}
		});
	};

	return (
		<div className="grid md:grid-cols-3 grid-rows-3 md:grid-rows-1 md:h-24 bg-gradient-to-b from-black to-gray-900 text-white text-xs md:text-base px-2 md:px-8 border-t border-gray-900">
			{/* Left */}
			<div className="flex items-center space-x-4 justify-center text-center md:justify-start md:text-left">
				<img src={songInfo?.album.images?.[0].url} alt={songInfo?.name} className="hidden md:inline-block h-10 w-10" />
				<div className="flex items-center md:block space-x-2 md:space-x-0">
					<h3 className="font-semibold text-sm truncate">{songInfo?.name}</h3>
					{songInfo && <span className="md:hidden bg-gray-500 h-2 w-2 rounded-full" />}
					<p className="text-gray-500 text-base">{songInfo?.artists?.[0].name}</p>
				</div>
			</div>

			{/* Center */}
			<div className="flex items-center justify-between px-4 md:px-0 my-[3px]">
				<SwitchHorizontalIcon className="player-btn" />
				<RewindIcon
					/* onClick={() => spotifyApi.skipToPrevious()} -- The API call is not working */ className="player-btn"
				/>
				{isPlaying ? (
					<PauseIcon onClick={handlePlayPause} className="player-btn h-12 w-12" />
				) : (
					<PlayIcon onClick={handlePlayPause} className="player-btn h-12 w-12" />
				)}

				<FastForwardIcon
					/* onClick={() => spotifyApi.skipToNext()} -- The API call is not working */ className="player-btn"
				/>
				<ReplyIcon className="player-btn" />
			</div>

			{/* Right */}
			<div className="flex items-center justify-center md:justify-end space-x-4 md:pr-5">
				<VolumeDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className="player-btn" />
				<input
					className="w-28 accent-green-500"
					type="range"
					min="0"
					max="100"
					value={volume}
					onChange={(e) => setVolume(Number(e.target.value))}
				/>
				<VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className="player-btn" />
			</div>
		</div>
	);
}

export default Player;
