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

  try {
    const response = await axios.post(
      "https://api.noones.com/noones/v1/user/affiliate",
      {}, // Empty object for POST request body
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
    console.error("Error getting user's affiliate summary:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
