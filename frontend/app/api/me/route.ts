import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const JWT_SECRET = "abcdefghijkl";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Access token directly from cookies

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = verify(token, JWT_SECRET);

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("JWT verification error:", err); // Log the error for debugging
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
