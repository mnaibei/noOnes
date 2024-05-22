import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/dist/server/api-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { code } = req.body;

  const clientId = "EWsZlpe6wctFVdSMc4Knt9V8Y4kCDzgYjrLFuhMA8pfZgKpx";
  const clientSecret = "h1aFzTmth0JLP2HdzMvY0IfGZtSsS6A5xnGNN97MjdgOHajk";
  const redirectUri1 = "https://mn20qvr9-3000.uks1.devtunnels.ms/home"; // Replace with your redirect URI
  const redirect_uri2 = "https://no-ones.vercel.app/home";
  const redirect_uri3 = "http://localhost:3000/home";

  const redirectUri = redirectUri1;

  const body = new URLSearchParams();
  body.append("grant_type", "authorization_code");
  body.append("client_id", clientId);
  body.append("client_secret", clientSecret);
  body.append("code", code);
  body.append("redirect_uri", redirectUri);

  try {
    const response = await axios.post(
      "https://auth.noones.com/oauth2/token",
      body.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(
      "Error exchanging code for token:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to exchange code for token" });
  }
}
