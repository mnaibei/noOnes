"use client";
import { useEffect, useState, useContext } from "react";
import CreateOffer from "./create-offer/page";
import Offers from "./fetch-offers/page";
import OffersList from "./list-users-offers/page";
import { UserContext } from "./layout";

export default function Home() {
  const { userInfo } = useContext(UserContext);

  return (
    <>
      {userInfo && (
        <>
          <Offers />
          <OffersList />
          <CreateOffer />
        </>
      )}
    </>
  );
}
