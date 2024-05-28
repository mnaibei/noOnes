"use client";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "@/utils/UserContext";
import Cookies from "js-cookie";
import axios from "axios";

interface Trade {
  trade_status: string;
  trade_hash: string;
  offer_hash: string;
  fiat_amount_requested: number;
  payment_method_name: string;
  started_at: string;
  seller: string;
  buyer: string;
  fiat_currency_code: string;
  ended_at: string;
  completed_at: string | null;
  crypto_currency_code: string;
}

export default function UserTrades() {
  const { userInfo } = useContext(UserContext);
  const access_token = Cookies.get("access_token");
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await axios.post(
          "/api/trade/getUserTrades",
          {}, // Empty body since no parameters are required
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log("trades response in the component", response.data);
        setTrades(response.data.data.trades);
      } catch (error) {
        console.error("Failed to fetch user trades:", error);
      }
    };

    if (access_token) {
      fetchTrades();
    }
  }, [access_token]);

  const cryptoCurrencyNames = {
    USDT: "Tether",
    BTC: "Bitcoin",
    ETH: "Ethereum",
    USDC: "USD Coin",
  };

  return (
    <div className="p-2 m-2 flex flex-col">
      <h1 className="text-2xl font-bold self-center">My Trades</h1>
      <div className="grid grid-cols-4">
        {trades?.length > 0 ? (
          trades.map((trade, index) => (
            <div
              key={index}
              className="border-2 border-gray-400 flex flex-col gap-2 p-2 m-2">
              <h2>{trade.trade_status}</h2>
              <p>Seller: {trade.seller}</p>
              <p>Buyer: {trade.buyer}</p>
              <p>
                Token:{" "}
                {
                  cryptoCurrencyNames[
                    trade.crypto_currency_code as keyof typeof cryptoCurrencyNames
                  ]
                }
              </p>
              <p>
                Amount: {trade.fiat_amount_requested} {trade.fiat_currency_code}
              </p>
              <p>Payment Method: {trade.payment_method_name}</p>
              <p>Started at: {trade.started_at}</p>
              <p>Ended at: {trade.ended_at}</p>
              <p>Completed at: {trade.completed_at || "Not Completed"}</p>
            </div>
          ))
        ) : (
          <p>No trades</p>
        )}
      </div>
    </div>
  );
}
