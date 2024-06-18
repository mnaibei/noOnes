import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { refreshToken } = req.body;

  console.log("Refresh token being fetched?", refreshToken);

  const clientId = "EWsZlpe6wctFVdSMc4Knt9V8Y4kCDzgYjrLFuhMA8pfZgKpx";
  const clientSecret = "h1aFzTmth0JLP2HdzMvY0IfGZtSsS6A5xnGNN97MjdgOHajk";

  const body = new URLSearchParams();
  body.append("grant_type", "refresh_token");
  body.append("client_id", clientId);
  body.append("client_secret", clientSecret);
  body.append("refresh_token", refreshToken);

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
    console.log("Refreshed access token:", response.data);
  } catch (error: any) {
    console.error(
      "Error refreshing access token:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to refresh access token" });
  }
}
