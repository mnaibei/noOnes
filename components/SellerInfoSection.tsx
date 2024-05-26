import React from "react";
import { OffersDetails } from "@/utils/interface/OfferDetails";

interface SellerInfoSectionProps {
  offerDetails: OffersDetails;
}

const SellerInfoSection: React.FC<SellerInfoSectionProps> = ({
  offerDetails,
}) => (
  <div className="border-2 border-green-500 p-2 m-2 gap-4 ">
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
      Monthly trades released <br />
      {offerDetails.monthly_trade_stats.trades_count_total}
    </p>
    <p>
      Monthly trade success rate <br />
      {offerDetails.monthly_trade_stats.trades_percent_success}%
    </p>
  </div>
);

export default SellerInfoSection;
