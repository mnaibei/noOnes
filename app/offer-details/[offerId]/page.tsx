"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { UserContext } from "@/utils/UserContext";

interface OfferDetails {
  fiat_price_per_crypto: number;
  offer_type: string;
  payment_window: number;
  currency_code: string;
  payment_method_name: string;
  fiat_amount_range_min: number;
  fiat_amount_range_max: number;
  offer_owner_username: string;
  offer_terms: string;
  crypto_currency_code: string;
  payment_method_label: string;
  offer_owner_feedback_positive: number;
  offer_owner_feedback_negative: number;
  monthly_trade_stats: {
    trades_count_total: number;
    trades_percent_success: number;
  };
}

export default function OfferDetails() {
  const params = useParams();
  const offerId = params?.offerId as string;
  const [offerDetails, setOfferDetails] = useState<OfferDetails | null>(null);
  const access_token = Cookies.get("access_token");
  const { userInfo } = useContext(UserContext);
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (offerId) {
      axios
        .post("/api/offers/getOfferDetails", {
          accessToken: access_token,
          offer_hash: offerId,
        })
        .then((response) => {
          console.log(response);
          setOfferDetails(response.data.data);
        })
        .catch((error) => {
          console.error("Failed to fetch offer details:", error);
        });
    }
  }, [offerId, access_token]);

  if (!offerDetails) {
    return <div>Loading...</div>;
  }

  const cryptoCurrencyNames = {
    USDT: "Tether",
    BTC: "Bitcoin",
    ETH: "Ethereum",
    USDC: "USD Coin",
  };

  // This function will be called when the user types in the "I will pay" input box
  const handlePayAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setPayAmount(value);

    // Calculate the "I will receive" value
    const receiveValue = (
      Number(value) / offerDetails.fiat_price_per_crypto
    ).toFixed(2);
    setReceiveAmount(receiveValue);

    // Check if the entered amount is less than fiat_amount_range_min
    if (Number(value) < offerDetails.fiat_amount_range_min) {
      setErrorMessage(
        `Please match the minimum amount of ${offerDetails.fiat_amount_range_min}`
      );
    } else {
      setErrorMessage(""); // Clear the error message if the value is valid
    }
  };

  if (userInfo.data.username === offerDetails.offer_owner_username) {
    return (
      <p className="text-red-500 p-2 m-2">
        Oops! You can&apos;t start a trade on your own offer.
      </p>
    );
  }

  return (
    <>
      {userInfo && (
        <>
          <div className=" p-2 m-2 flex flex-col gap-4">
            <h1 className="text-2xl font-extrabold self-center">
              {offerDetails.offer_type === "sell" ? "Buy" : "Sell"}{" "}
              {
                cryptoCurrencyNames[
                  offerDetails.crypto_currency_code as keyof typeof cryptoCurrencyNames
                ]
              }{" "}
              {offerDetails.offer_type === "buy" ? "to" : "from"}{" "}
              {offerDetails.offer_owner_username}
            </h1>
            <div className="border-2 border-red-500 p-2 m-2 flex justify-evenly items-center">
              <div className=" w-full">
                <label>I will pay</label>
                <br />
                <input
                  type="number"
                  value={payAmount}
                  onChange={handlePayAmountChange}
                  className="border-2 border-gray-500 w-3/4"
                />{" "}
                {offerDetails.currency_code}
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              </div>
              <div className=" w-full ">
                <label>and receive</label>
                <br />
                <input
                  type="number"
                  value={receiveAmount}
                  className="border-2 border-gray-500 w-3/4"
                  readOnly
                />{" "}
                {offerDetails.crypto_currency_code}
              </div>
            </div>
            <div className="border-2 border-green-500 p-2 m-2 gap-4">
              <h2 className="p-2">About this offer</h2>
              <div className="p-2 grid grid-cols-6">
                <p>
                  Seller rate
                  <br />
                  {Number(offerDetails.fiat_price_per_crypto).toFixed(2)}{" "}
                  {offerDetails.currency_code}
                </p>
                <p>
                  Payment Method
                  <br />
                  {offerDetails.payment_method_name}
                </p>
                <p>
                  Offer Label
                  <br />
                  {offerDetails.payment_method_label}
                </p>
                <p>
                  Buy limits
                  <br />
                  Min -{" "}
                  {Number(
                    offerDetails.fiat_amount_range_min
                  ).toLocaleString()}{" "}
                  {offerDetails.currency_code}
                  <br />
                  Max -{" "}
                  {Number(
                    offerDetails.fiat_amount_range_max
                  ).toLocaleString()}{" "}
                  {offerDetails.currency_code}
                </p>
                <p>
                  Trade time limit
                  <br />
                  {offerDetails.payment_window} Min
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h2>Offer Terms</h2>
                <p>{offerDetails.offer_terms}</p>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <h2 className="font-bold">About this Seller</h2>
                <p>@{offerDetails.offer_owner_username}</p>
                <h2 className="font-bold">Feedback</h2>
                <p>
                  Positive <br /> {offerDetails.offer_owner_feedback_positive}
                </p>
                <p>
                  Negative <br />
                  {offerDetails.offer_owner_feedback_negative}
                </p>
                <p>
                  Monthy trades released <br />
                  {offerDetails.monthly_trade_stats.trades_count_total}
                </p>
                <p>
                  Monthly trade success rate <br />
                  {offerDetails.monthly_trade_stats.trades_percent_success}%
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
