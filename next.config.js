/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["scontent-cdt1-1.xx.fbcdn.net", "links.papareact.com"],
	},
};

module.exports = nextConfig;
