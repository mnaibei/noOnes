"use client";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "@/utils/UserContext";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function ActiveTrades() {
  const { userInfo } = useContext(UserContext);
  const [activeTrades, setActiveTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const accessToken = Cookies.get("access_token");
  const fetchActiveTrades = async () => {
    if (accessToken) {
      try {
        const response = await axios.post(
          "/api/trade/activeTrade",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("active trades", response.data);
        setActiveTrades(response.data.data.trades);
      } catch (error) {
        console.error("Error fetching active trades:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchActiveTrades(); // fetch immediately on component mount

    const intervalId = setInterval(fetchActiveTrades, 45000); // fetch every 5 seconds

    return () => {
      clearInterval(intervalId); // clear interval on component unmount
    };
  }, [accessToken]);

  return (
    <div className="p-2 m-2 border-2 border-red-500 flex flex-col">
      <h1 className="text-2xl font-bold self-center">Active Trades</h1>
      {loading ? (
        <div>Loading...</div>
      ) : activeTrades.length === 0 ? (
        <div>No active trades available.</div>
      ) : (
        userInfo &&
        activeTrades.map((trade) => (
          <div
            key={trade.trade_hash}
            className="p-4 m-2 border-2 border-gray-300 rounded flex flex-col justify-center gap-2">
            <h2 className="text-xl font-bold">Trade ID: {trade.trade_hash}</h2>
            <p>Trade Type: {trade.offer_type}</p>
            <p>Trade Status: {trade.trade_status}</p>
            <p>
              Fiat Amount:{" "}
              {`${trade.fiat_amount_requested} ${trade.fiat_currency_code}`}
            </p>
            <p>
              Crypto Amount:{" "}
              {(
                trade.fiat_amount_requested / trade.fiat_price_per_crypto
              ).toFixed(4)}
            </p>
            <p>Buyer: {trade.responder_username}</p>
            <p>Owner: {trade.owner_username}</p>
            <p>Payment Method: {trade.payment_method_name}</p>
            <button
              className="border-2 rounded border-green-200 bg-green-500 p-2 text-center"
              onClick={() =>
                router.push(
                  `/trade/${trade.trade_hash}?buyer=${trade.responder_username}`
                )
              }>
              View Trade
            </button>
          </div>
        ))
      )}
    </div>
  );
}
