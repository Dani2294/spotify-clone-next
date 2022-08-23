import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, RssIcon } from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atom/playlistAtom";
import { sidebarState } from "../atom/sidebarAtom";

function Sidebar() {
	const spotifyApi = useSpotify();
	const [playlists, setPlaylists] = useState([]);
	const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
	const [showMenu, setShowMenu] = useRecoilState(sidebarState);
	const { data: session, status } = useSession();

	useEffect(() => {
		if (spotifyApi.getAccessToken()) {
			spotifyApi.getUserPlaylists().then((data) => {
				setPlaylists(data.body.items);
			});
		}
	}, [session, spotifyApi]);

	const handleLikedSong = () => {
		setPlaylistId("liked");
		setShowMenu(!showMenu);
	};

	const handlePlaylistBtn = (id) => {
		setPlaylistId(id);
		setShowMenu(!showMenu);
	};

	return (
		<div
			className={`text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem]  md:inline-flex z-10 absolute md:relative bg-black transform ${
				!showMenu ? "-translate-x-[110%]" : ""
			} md:-translate-x-0 transition duration-200`}>
			<div className="space-y-4 h-full">
				<Link href="/">
					<button className="flex items-center space-x-2 hover:text-white">
						<HomeIcon className="h-5 w-5" />
						<a>Home</a>
					</button>
				</Link>
				<button className="flex items-center space-x-2 hover:text-white">
					<SearchIcon className="h-5 w-5" />
					<p>Search</p>
				</button>
				<button className="flex items-center space-x-2 hover:text-white">
					<LibraryIcon className="h-5 w-5" />
					<p>Your Library</p>
				</button>
				<hr className="border-t-[0.1px] border-gray-900" />
				<button className="flex items-center space-x-2 hover:text-white">
					<PlusCircleIcon className="h-5 w-5" />
					<p>Create Playlist</p>
				</button>
				<button className="flex items-center space-x-2 hover:text-white" onClick={handleLikedSong}>
					<HeartIcon className="h-5 w-5 text-green-500" />
					<p>Liked Songs</p>
				</button>
				<button className="flex items-center space-x-2 hover:text-white">
					<RssIcon className="h-5 w-5" />
					<p>Your Episodes</p>
				</button>
				<hr className="border-t-[0.1px] border-gray-900" />

				{/* Playlist */}
				<p className="text-white">Your Playlist</p>
				<div className="pb-52 md:pb-36 space-y-4">
					{playlists.map((playlist) => (
						<p
							key={playlist.id}
							className="cursor-pointer hover:text-white"
							onClick={() => handlePlaylistBtn(playlist.id)}>
							{playlist.name}
						</p>
					))}
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
