import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function deleteOffer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { accessToken, offer_hash } = req.body;

  try {
    const response = await axios.post(
      `https://api.noones.com/noones/v1/offer/delete`,
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
    console.log(response.data);
  } catch (error: any) {
    console.error(
      "Error deleting offer:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to delete offer" });
  }
}
