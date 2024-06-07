import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { trade_hash } = req.body;
  const authorizationHeader = req.headers.authorization;
  const twoFaToken = req.headers["x-paxful-2fa"];

  if (!authorizationHeader || !twoFaToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const accessToken = authorizationHeader.split(" ")[1];

  try {
    const response = await axios.post(
      "https://api.noones.com/noones/v1/trade/release",
      new URLSearchParams({ trade_hash }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-paxful-2fa": twoFaToken,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error releasing crypto:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
