import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { shuffle } from "lodash";
import Image from "next/image";
import { ChevronDownIcon, LogoutIcon } from "@heroicons/react/outline";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistAtom, playlistIdState } from "../atom/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import { MenuAlt2Icon } from "@heroicons/react/solid";
import { sidebarState } from "../atom/sidebarAtom";

const colors = [
	"from-indigo-500",
	"from-blue-500",
	"from-green-500",
	"from-red-500",
	"from-yellow-500",
	"from-pink-500",
	"from-purple-500",
];

function Center() {
	const [color, setColor] = useState(null);
	const playlistId = useRecoilValue(playlistIdState);
	const [playlist, setPlaylist] = useRecoilState(playlistAtom);
	const [showMenu, setShowMenu] = useRecoilState(sidebarState);
	const spotifyApi = useSpotify();
	const { data: session } = useSession();

	useEffect(() => {
		setColor(shuffle(colors).pop());
	}, [playlistId]);

	useEffect(() => {
		if (spotifyApi.getAccessToken()) {
			if (playlistId === "liked") {
				spotifyApi.getMySavedTracks().then((data) => {
					setPlaylist(data.body);
				});
			} else {
				spotifyApi
					.getPlaylist(playlistId)
					.then((data) => {
						setPlaylist(data.body);
					})
					.catch((err) => console.log("Something went wrong: ", err));
			}
		}
	}, [spotifyApi, playlistId, setPlaylist]);

	return (
		<div className="flex-grow text-white h-screen scrollbar-hide overflow-y-scroll">
			<div
				className={`flex md:hidden items-center justify-center rounded-full bg-black absolute top-5 left-8 z-100 p-3 shadow-xl ${
					showMenu ? "ml-[11rem]" : ""
				} transition duration-500`}
				onClick={() => setShowMenu(!showMenu)}>
				<MenuAlt2Icon className="w-6 h-6 text-white" />
			</div>
			<header className="group absolute top-5 right-4 md:right-8 z-100">
				<div className="flex items-center space-x-3 bg-black opacity-90 hover:opacity-80 rounded-full p-1 pr-2 shadow-xl cursor-pointer">
					<img className="rounded-full w-10 h-10 border-2 border-white" src={session?.user.image} alt="" />
					<h2 className="hidden md:block">{session?.user.name}</h2>
					<ChevronDownIcon className="w-5 h-5" />
				</div>
				<button
					className="hidden group-hover:flex duration-300 items-center justify-end bg-black opacity-80 mt-1 space-x-2 p-2 w-full rounded-lg"
					onClick={() => signOut()}>
					<p>Log Out</p>
					<LogoutIcon className="h-5 w-5" />
				</button>
			</header>

			<section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 p-8 text-white`}>
				{playlist?.images ? (
					<>
						<img src={playlist?.images?.[0]?.url} alt="" className="h-44 w-44 shadow-2xl" />
						<div>
							<p>PLAYLIST</p>
							<h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
						</div>
					</>
				) : (
					<h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">Liked Songs</h1>
				)}
			</section>

			<div>
				<Songs />
			</div>
		</div>
	);
}

export default Center;
