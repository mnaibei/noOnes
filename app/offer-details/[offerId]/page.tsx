"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { UserContext } from "@/utils/UserContext";
import { OffersDetails } from "@/utils/interface/OfferDetails";

export default function OfferDetails() {
  const params = useParams();
  const offerId = params?.offerId as string;
  const [offerDetails, setOfferDetails] = useState<OffersDetails | null>(null);
  const access_token = Cookies.get("access_token");
  const { userInfo } = useContext(UserContext);
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

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

  const handleStartTrade = async () => {
    try {
      const payload = {
        offer_hash: offerDetails.offer_hash,
        fiat: Number(payAmount),
      };

      console.log("Sending to API:", payload);

      const response = await axios.post("/api/trade/startTrade", payload, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log(response.data);
      router.push(
        `/trade/${offerDetails.offer_hash}?payAmount=${payAmount}&receiveAmount=${receiveAmount}`
      );
    } catch (error) {
      console.error("Failed to start trade:", error);
    }
  };

  console.log("offer hash", offerDetails.offer_hash);
  console.log("user info", userInfo);

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
              <button
                onClick={handleStartTrade}
                className="border-2 border-green-500 p-2 rounded w-1/2">
                Start Trade
              </button>
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
