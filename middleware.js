import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const middleware = async (req) => {
	const url = req.nextUrl.clone();
	// token will exists if user is logged in
	const token = await getToken({ req, secret: process.env.JWT_SECRET });

	const { pathname } = req.nextUrl;

	if (pathname.startsWith("/_next/") || pathname.includes(".")) {
		// static files
		return;
	}

	if (token && pathname === "/login") {
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	// Check if the request is for next-auth and if the token exists
	// if so le the request continue
	if (pathname.includes("/api/auth") || token) {
		return NextResponse.next();
	}

	// Redirect them to the login page if the token doesn't exists AND the request is for a protected route
	if (!token && pathname !== "/login") {
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}
};
