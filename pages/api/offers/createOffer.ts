import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { accessToken, offerData } = req.body;

  try {
    const response = await axios.post(
      "https://api.noones.com/noones/v1/offer/create",
      offerData,
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
      "Error creating offer:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to create offer" });
  }
}
