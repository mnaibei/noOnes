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
  const { offer_hash, fiat, satoshi, bank_accounts_to, crypto_amount } =
    req.body;

  try {
    const response = await axios.post(
      "https://api.noones.com/noones/v1/trade/start",
      new URLSearchParams({
        offer_hash,
        fiat: String(fiat),
        satoshi: String(satoshi),
        "bank_accounts[to]": bank_accounts_to,
        crypto_amount: String(crypto_amount),
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json({ message: "Trade started", data: response.data });
  } catch (error) {
    console.error("Error starting trade:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
