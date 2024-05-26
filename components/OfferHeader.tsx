import React from "react";

interface OfferHeaderProps {
  offerType: string;
  cryptoCurrencyName: string;
  offerOwnerUsername: string;
}

const OfferHeader: React.FC<OfferHeaderProps> = ({
  offerType,
  cryptoCurrencyName,
  offerOwnerUsername,
}) => (
  <h1 className="text-2xl font-extrabold self-center">
    {offerType === "sell" ? "Buy" : "Sell"} {cryptoCurrencyName}{" "}
    {offerType === "buy" ? "to" : "from"} {offerOwnerUsername}
  </h1>
);

export default OfferHeader;
