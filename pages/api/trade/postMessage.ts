import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify that the request method is POST
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // Verify the request authorization header
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const accessToken = authorizationHeader.split(" ")[1];
  const { tradeHash, message } = req.body;

  // Verify that tradeHash and message are provided
  if (!tradeHash || !message) {
    res.status(400).json({ message: "Missing tradeHash or message" });
    return;
  }

  try {
    // Send the message to the Noones API
    const response = await axios.post(
      "https://api.noones.com/noones/v1/trade-chat/post",
      new URLSearchParams({ trade_hash: tradeHash, message }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Respond with the data from the Noones API
    res.status(200).json({ message: "Message sent", data: response.data });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
