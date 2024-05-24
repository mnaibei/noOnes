"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const CreateOffer = () => {
  const [showForm, setShowForm] = useState(false);
  const [offerData, setOfferData] = useState({
    offer_type_field: "",
    currency: "",
    margin: "",
    range_min: "",
    range_max: "",
    payment_window: "",
    offer_terms: "",
    payment_method: "",
    crypto_currency: "",
    predefined_amount: "2000",
    payment_method_group: "",
    show_only_trusted_user: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event: any) => {
    setOfferData({
      ...offerData,
      [event.target.name]: event.target.value,
    });
  };

  const access_token = Cookies.get("access_token");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/offers/createOffer", {
        accessToken: access_token,
        offerData,
      });
      console.log(response.data);
      setIsSubmitted(true);
      setOfferData({
        offer_type_field: "",
        currency: "",
        margin: "",
        range_min: "",
        range_max: "",
        payment_window: "",
        offer_terms: "",
        payment_method: "",
        crypto_currency: "",
        predefined_amount: "2000",
        payment_method_group: "",
        show_only_trusted_user: "",
      });
    } catch (error) {
      console.error("Failed to create offer:", error);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="p-2 m-2 border-2 border-blue-500 flex flex-col gap-4">
      <button onClick={() => setShowForm(!showForm)}>Create Offer</button>
      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            Offer Type Field:
            <select
              name="offer_type_field"
              value={offerData.offer_type_field}
              onChange={handleChange}
              className="border-2 border-gray-500 w-46 rounded">
              <option value="">Select an offer type</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </label>
          <label>
            Currency:
            <select
              name="currency"
              value={offerData.currency}
              onChange={handleChange}
              className="border-2 border-gray-500 w-46 rounded">
              <option value="">Select a currency</option>
              <option value="USD">USD</option>
              <option value="KES">KES</option>
            </select>
          </label>
          <label>
            Margin:
            <input
              type="text"
              name="margin"
              value={offerData.margin}
              onChange={handleChange}
              className="border-2 border-gray-500 w-46 rounded"
            />
          </label>
          <label>
            Range Min:
            <input
              type="text"
              name="range_min"
              value={offerData.range_min}
              onChange={handleChange}
              className="border-2 border-gray-500 w-46 rounded"
            />
          </label>
          <label>
            Range Max:
            <input
              type="text"
              name="range_max"
              value={offerData.range_max}
              onChange={handleChange}
              className="border-2 border-gray-500 w-46 rounded"
            />
          </label>
          <label>
            Payment Window:
            <select
              name="payment_window"
              value={offerData.payment_window}
              onChange={handleChange}
              className="border-2 border-gray-500 w-46 rounded">
              <option value="">Select a time scale</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="180">3 hours</option>
            </select>
          </label>
          <label>
            Offer Terms:
            <textarea
              name="offer_terms"
              value={offerData.offer_terms}
              onChange={handleChange}
              className="border-2 border-gray-500 w-46 rounded"
            />
          </label>
          <label>
            Payment Method:
            <select
              name="payment_method"
              value={offerData.payment_method}
              onChange={handleChange}
              className="border-2 border-gray-500 w-46 rounded">
              <option value="">Select a payment method</option>
              <option value="m-pesa">M-Pesa</option>
              <option value="airtel-money">Airtel Money</option>
            </select>
          </label>
          <label>
            Crypto Currency:
            <select
              name="crypto_currency"
              value={offerData.crypto_currency}
              onChange={handleChange}
              className="border-2 border-gray-500 w-46 rounded">
              <option value="">Select a crypto currency</option>
              <option value="btc">Bitcoin</option>
              <option value="usdt">Tether</option>
              <option value="usdc">USD Coin</option>
              <option value="eth">Ethereum</option>
            </select>
          </label>
          <label>
            Predefined Amount:
            <input
              type="text"
              name="predefined_amount"
              value={offerData.predefined_amount}
              onChange={handleChange}
              className="border-2 border-gray-500 w-46 rounded"
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
      {isSubmitted && <p>Offer successfully created!</p>}
    </div>
  );
};

export default CreateOffer;
