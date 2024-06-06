import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const accessToken = authorizationHeader.split(" ")[1];

  try {
    const response = await axios.get(
      "https://api.noones.com/wallet/v3/summary",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error getting user's wallet summary:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
