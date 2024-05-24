import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getOfferDetails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { accessToken, offer_hash } = req.body;

  try {
    console.log(offer_hash);
    const response = await axios.post(
      `https://api.noones.com/noones/v1/offer/get`,
      { offer_hash },
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
      "Error fetching offer details:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch offer details" });
  }
}
