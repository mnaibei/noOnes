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

  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const accessToken = authorizationHeader.split(" ")[1];
  const { trade_hash } = req.body;

  try {
    const response = await axios.post(
      "https://api.noones.com/noones/v1/trade/paid",
      new URLSearchParams({
        trade_hash,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.status(200).json({ message: "Trade completed", data: response.data });
  } catch (error) {
    console.error("Error completing trade:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
