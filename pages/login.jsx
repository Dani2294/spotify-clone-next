import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
	return (
		<div className="flex flex-col items-center justify-center bg-black h-screen overflow-hidden">
			<img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="" />
			<div className="text-gray-300 text-lg text-center space-y-3 max-w-lg mt-3 mb-5 px-5">
				<p>You will need a active device running Spotify for this app to work properly.</p>
				<p>The shuffle, previous, next and back button do not work (api issue)</p>
			</div>
			{Object.values(providers).map((provider) => (
				<div key={provider.id}>
					<button
						className="bg-[#18D860] rounded-full p-5 font-semibold hover:text-white"
						onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
						Login with Spotify
					</button>
				</div>
			))}
		</div>
	);
}

export default Login;

export const getServerSideProps = async () => {
	const providers = await getProviders();

	return {
		props: {
			providers,
		},
	};
};
