"use client";
import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface MyOffer {
  offer_hash: string;
  offer_id: string;
  offer_type: string;
  fiat_price_per_btc: number;
  payment_method_name: string;
  offer_terms: string;
  offer_link: string;
  crypto_currency: string;
  payment_window: number;
}

function OffersList() {
  const [offers, setOffers] = useState<MyOffer[]>([]);
  const [offerType, setOfferType] = useState<"buy" | "sell">("buy");
  const accessToken = Cookies.get("access_token");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.post("/api/listOffers", {
          accessToken: accessToken,
        });

        if (response.data.status === "success") {
          setOffers(response.data.data.offers);
        }
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      }
    };

    fetchOffers(); // Fetch offers immediately on component mount

    const intervalId = setInterval(fetchOffers, 60000); // Fetch offers every 60 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const deleteOffer = async (offer_hash: string) => {
    try {
      console.log("Deleting offer:", offer_hash);
      const response = await axios.post("/api/deleteOffer", {
        accessToken: accessToken,
        offer_hash: offer_hash,
      });

      if (response.data.status === "success") {
        console.log("Offer deleted successfully");
        // Remove the deleted offer from the state
        setOffers((prevOffers) =>
          prevOffers.filter((offer) => offer.offer_hash !== offer_hash)
        );
      }
    } catch (error) {
      console.error("Failed to delete offer:", error);
    }
  };

  const filteredOffers = offers.filter(
    (offer) => offer.offer_type === offerType
  );

  return (
    <>
      <div className="border-2 border-red-500 p-2 m-2 flex flex-col gap-4">
        <h1>My Offers</h1>
        <div className="flex gap-4">
          <button onClick={() => setOfferType("buy")}>Show Buy Offers</button>
          <button onClick={() => setOfferType("sell")}>Show Sell Offers</button>
        </div>
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <div key={offer.offer_hash} className="p-2 m-2 flex flex-col gap-2">
              <p>Type: {offer.offer_type}</p>
              <p>Payment Window: {offer.payment_window} Min</p>
              <p>Price per BTC: {offer.fiat_price_per_btc}</p>
              <p>Token: {offer.crypto_currency}</p>
              <p>Payment Method: {offer.payment_method_name}</p>
              <p>Terms: {offer.offer_terms}</p>
              <a
                href={offer.offer_link}
                className="border-2 rounded border-green-200 bg-green-500 p-2 text-center">
                View Offer
              </a>
              <button
                onClick={() => deleteOffer(offer.offer_hash)}
                className="border-2 rounded border-red-500 bg-red-500 p-2 text-center">
                Delete Offer
              </button>
            </div>
          ))
        ) : (
          <p>You have no offers yet.</p>
        )}
      </div>
    </>
  );
}

export default OffersList;
