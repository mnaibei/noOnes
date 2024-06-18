"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { Offer } from "@/utils/interface/Offer";
import { UserContext } from "@/utils/UserContext";

function Offers() {
  const [offerType, setOfferType] = useState("buy");
  const [currency, setCurrency] = useState("KES");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [coin, setCoin] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const access_token = Cookies.get("access_token");
  const router = useRouter();

  const [selectedUsername, setSelectedUsername] = useState("");
  const [userNames, setUserNames] = useState<string[]>([
    "COIN_X",
    "JovialCrane953",
    "Meruchiq",
  ]);

  const { userInfo } = useContext(UserContext);

  const fetchOffers = async () => {
    try {
      const response = await axios.post("/api/offers/getOffers", {
        accessToken: access_token,
        offerParams: {
          offer_type: offerType,
          currency_code: currency,
          payment_method: paymentMethod,
          crypto_currency_code: coin,
          offer_owner_username: selectedUsername,
          limit: 300,
        },
      });
      let fetchedOffers = response.data.data.offers;

      // Filter offers based on selectedUsername
      if (selectedUsername) {
        fetchedOffers = fetchedOffers.filter(
          (offer: { offer_owner_username: string }) =>
            offer.offer_owner_username === selectedUsername
        );
      }

      setOffers(fetchedOffers);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    }
  };

  return (
    <>
      <h1 className="font-bold text-2xl flex justify-center">Marketplace</h1>
      <div className="p-2 m-2 flex gap-4 items-center justify-center">
        <label>
          Offer Type:
          <select
            value={offerType}
            onChange={(e) => setOfferType(e.target.value)}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
        <label>
          Currency:
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}>
            <option value="KES">KES</option>
            <option value="USD">USD</option>
          </select>
        </label>
        <label>
          Payment Method:
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="">Select</option>
            <option value="m-pesa">M-Pesa</option>
            <option value="airtel-money">Airtel Money</option>
          </select>
        </label>
        <label>
          Coin:
          <select value={coin} onChange={(e) => setCoin(e.target.value)}>
            <option value="">Select</option>
            <option value="btc">Bitcoin</option>
            {/* <option value="usdt">Tether</option>
            <option value="usdc">USD Coin</option>
            <option value="eth">Ethereum</option> */}
          </select>
        </label>
        <label>
          Username:
          <select
            value={selectedUsername}
            onChange={(e) => setSelectedUsername(e.target.value)}>
            <option value="">Select</option>
            {userNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={fetchOffers}
          className="border-2 rounded border-green-200 bg-green-500 p-2">
          Fetch Offers
        </button>
      </div>
      <div className=" p-2 m-2 grid grid-cols-3">
        {offers.map((offer) => (
          <div
            key={offer.offer_id}
            className="border-4 border-red-500 p-2 m-2 flex flex-col gap-2">
            {/* <h2>{offer.offer_type}</h2> */}
            <p>Payment Window: {offer.payment_window} Min</p>
            <p>Currency Code: {offer.currency_code}</p>
            <p>Token: {offer.crypto_currency_code}</p>
            <p>
              Price per BTC:{" "}
              {Number(offer.fiat_price_per_btc).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p>Payment Method: {offer.payment_method_name}</p>
            <p>
              Minimum amount: KES{" "}
              {Number(offer.fiat_amount_range_min).toLocaleString()}
            </p>
            <p>
              Maximum amount: KES{" "}
              {Number(offer.fiat_amount_range_max).toLocaleString()}
            </p>
            <p>Offer Owner: {offer.offer_owner_username}</p>
            <button
              onClick={() => router.push(`/offer-details/${offer.offer_id}`)}
              className="border-2 rounded border-green-200 bg-green-500 p-2 text-center">
              View Offer
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Offers;
