import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import spotifyApi from "../lib/spotify-helper";

function useSpotify() {
	const { data: session } = useSession();

	useEffect(() => {
		if (session) {
			// If refresh acess token fails, direct the user to login...
			if (session.error === "RefreshAccessTokenError") {
				signIn();
			}

			spotifyApi.setAccessToken(session.user.accessToken);
		}
	}, [session]);

	return spotifyApi;
}

export default useSpotify;
