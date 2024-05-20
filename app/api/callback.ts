// app/api/callback.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
// import { serialize } from "cookie";
import Cookies from "js-cookie";

export async function GET(req: NextRequest) {
  const clientId = "EWsZlpe6wctFVdSMc4Knt9V8Y4kCDzgYjrLFuhMA8pfZgKpx";
  const clientSecret = "h1aFzTmth0JLP2HdzMvY0IfGZtSsS6A5xnGNN97MjdgOHajk";
  const redirectUri = "https://mn20qvr9-3000.uks1.devtunnels.ms/api/callback";

  console.log(clientId);

  const tokenEndpoint = "https://auth.noones.com/oauth2/token";
  const code = req.nextUrl.searchParams.get("code");

  console.log(req.nextUrl.pathname);

  console.log("Authorization Code:", code);

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code not provided" },
      { status: 400 }
    );
  }

  const body = new URLSearchParams();
  body.append("grant_type", "authorization_code");
  body.append("client_id", clientId || "");
  body.append("client_secret", clientSecret || "");
  body.append("redirect_uri", redirectUri || "");
  body.append("code", code);

  try {
    const response = await axios.post(tokenEndpoint, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log(response.data);

    const accessToken = response.data.access_token;
    localStorage.setItem("access_token", accessToken);

    // Store the access token in a secure cookie
    // const cookie = serialize("access_token", accessToken, {
    //   path: "/",
    //   httpOnly: false,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 3600, // 1 hour
    // });

    const cookie = Cookies.set("access_token", accessToken) || "";

    const res = NextResponse.redirect(new URL("/home", req.url));
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching access token" },
      { status: 500 }
    );
  }
}
