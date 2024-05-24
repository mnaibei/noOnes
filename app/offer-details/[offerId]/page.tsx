"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import axios from "axios";
import Cookies from "js-cookie";

interface OfferDetails {
  offer_hash: string;
  offer_type: string;
  payment_window: number;
  currency_code: string;
  fiat_price_per_btc: number;
  payment_method_name: string;
  fiat_amount_range_min: number;
  fiat_amount_range_max: number;
  offer_owner_username: string;
  offer_terms: string;
  offer_link: string;
}

export default function OfferDetails() {
  const params = useParams();
  const offerId = params?.offerId as string;
  const [offerDetails, setOfferDetails] = useState<OfferDetails | null>(null);
  const access_token = Cookies.get("access_token");

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

  console.log("Offer details from server:", offerDetails.offer_type);

  return (
    <>
      <div className="border-2 border-red-500 p-2 m-2">
        <h1>Offer Details</h1>
        <p>Offer Type: {offerDetails.offer_type}</p>
        <p>Payment Window: {offerDetails.payment_window} Min</p>
        <p>Currency Code: {offerDetails.currency_code}</p>
        <p>Price per BTC: {offerDetails.fiat_price_per_btc}</p>
        <p>Payment Method: {offerDetails.payment_method_name}</p>
        <p>Minimum Amount: KES {offerDetails.fiat_amount_range_min}</p>
        <p>Maximum Amount: KES {offerDetails.fiat_amount_range_max}</p>
        <p>Offer Owner: {offerDetails.offer_owner_username}</p>
        <p>Offer Terms: {offerDetails.offer_terms}</p>
        <a
          href={offerDetails.offer_link}
          target="_blank"
          rel="noopener noreferrer">
          View Offer
        </a>
      </div>
    </>
  );
}
