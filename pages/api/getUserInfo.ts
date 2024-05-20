import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { accessToken } = req.body;

  try {
    const response = await axios.post(
      "https://api.noones.com/noones/v1/user/me",
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(
      "Error fetching user info:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch user info" });
  }
}
