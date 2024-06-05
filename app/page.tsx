"use client";
import { useEffect, useState, useContext } from "react";
import CreateOffer from "./create-offer/page";
import Offers from "./fetch-offers/page";
import OffersList from "./list-users-offers/page";
import { UserContext } from "@/utils/UserContext";
import UserTrades from "./get-user-trades/page";
import ActiveTrades from "./active-trades/page";

export default function Home() {
  const { userInfo } = useContext(UserContext);

  console.log("userInfo", userInfo);

  return (
    <>
      {userInfo && (
        <>
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
