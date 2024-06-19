"use client";
import { useContext } from "react";
import CreateOffer from "./create-offer/page";
import Offers from "./fetch-offers/page";
import OffersList from "./list-users-offers/page";
import { UserContext } from "@/utils/UserContext";
import UserTrades from "./get-user-trades/page";
import ActiveTrades from "./active-trades/page";
import { QRCodeSVG } from "qrcode.react";

export default function Home() {
  const { userInfo } = useContext(UserContext);

  console.log("userInfo", userInfo);

  return (
    <>
      {userInfo && (
        <>
          {/* Display Referral Link and QR Code */}
          {userInfo.data.referral_link && (
            <div className="referral-section flex flex-col justify-center items-center p-2 m-2 gap-2">
              <h2>Invite Your Friends</h2>
              <p>
                Share your referral link to invite friends and earn rewards:
              </p>
              <a
                href={userInfo.data.referral_link}
                target="_blank"
                rel="noopener noreferrer"></a>
              <QRCodeSVG value={userInfo?.data?.referral_link} size={200} />
            </div>
          )}
          <Offers />
          <OffersList />
          <ActiveTrades />
          <CreateOffer />
          <UserTrades />
        </>
      )}
    </>
  );
}
