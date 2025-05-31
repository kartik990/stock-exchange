import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie"; // You might need to install 'cookie' if not already installed (npm i cookie or yarn add cookie)

export async function POST() {
  try {
    const serializedCookie = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure: true in production (HTTPS)
      sameSite: "lax", // Must match the value used when setting the cookie
      path: "/", // Must match the value used when setting the cookie
      maxAge: 0, // Set maxAge to 0 to immediately expire the cookie
      // expires: new Date(0), // Alternative to maxAge: 0 - set to a past date
      domain: "localhost",
    });

    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
    response.headers.set("Set-Cookie", serializedCookie);

    return response;
  } catch (error: any) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { message: "Internal server error during logout" },
      { status: 500 }
    );
  }
}
