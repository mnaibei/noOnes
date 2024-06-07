import React from "react";
import { Offer } from "@/utils/interface/Offer";

interface OfferDetailsSectionProps {
  offerDetails: Offer;
}

const OfferDetailsSection: React.FC<OfferDetailsSectionProps> = ({
  offerDetails,
}) => (
  <div className="border-2 border-green-500 p-2 m-2 gap-4">
    <h2 className="p-2">About this offer</h2>
    <div className="p-2 grid grid-cols-6">
      <p>
        Seller rate
        <br />
        {Number(offerDetails.fiat_price_per_crypto).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
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
        Min - {Number(offerDetails.fiat_amount_range_min).toLocaleString()}{" "}
        {offerDetails.currency_code}
        <br />
        Max - {Number(offerDetails.fiat_amount_range_max).toLocaleString()}{" "}
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
  </div>
);

export default OfferDetailsSection;
