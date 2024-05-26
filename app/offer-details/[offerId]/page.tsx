"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { UserContext } from "@/utils/UserContext";
import { OffersDetails } from "@/utils/interface/OfferDetails";
import OfferHeader from "@/components/OfferHeader";
import PaymentInputs from "@/components/PaymentInputs";
import OfferDetailsSection from "@/components/OfferDetailsSection";
import SellerInfoSection from "@/components/SellerInfoSection";

export default function OfferDetails() {
  const params = useParams();
  const offerId = params?.offerId as string;
  const [offerDetails, setOfferDetails] = useState<OffersDetails | null>(null);
  const access_token = Cookies.get("access_token");
  const { userInfo } = useContext(UserContext);
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (offerId) {
      axios
        .post("/api/offers/getOfferDetails", {
          accessToken: access_token,
          offer_hash: offerId,
        })
        .then((response) => {
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

  const cryptoCurrencyNames = {
    USDT: "Tether",
    BTC: "Bitcoin",
    ETH: "Ethereum",
    USDC: "USD Coin",
  };

  const handlePayAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setPayAmount(value);

    const receiveValue = (
      Number(value) / offerDetails.fiat_price_per_crypto
    ).toFixed(2);
    setReceiveAmount(receiveValue);

    if (Number(value) < offerDetails.fiat_amount_range_min) {
      setErrorMessage(
        `Please match the minimum amount of ${offerDetails.fiat_amount_range_min}`
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleStartTrade = async () => {
    try {
      const payload = {
        offer_hash: offerDetails.offer_hash,
        fiat: Number(payAmount),
      };

      const response = await axios.post("/api/trade/startTrade", payload, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log("offer details response", response.data);

      console.log(
        "offer details trade_hash? this will be fucked up",
        response.data.data.trade_hash
      );

      const tradeHash = response.data.data.trade_hash;

      router.push(
        `/trade/${tradeHash}?payAmount=${payAmount}&receiveAmount=${receiveAmount}`
      );
    } catch (error) {
      console.error("Failed to start trade:", error);
    }
  };

  if (userInfo.data.username === offerDetails.offer_owner_username) {
    return (
      <p className="text-red-500 p-2 m-2">
        Oops! You can&apos;t start a trade on your own offer.
      </p>
    );
  }

  return (
    <>
      {userInfo && (
        <div className="p-2 m-2 flex flex-col gap-4">
          <OfferHeader
            offerType={offerDetails.offer_type}
            cryptoCurrencyName={
              cryptoCurrencyNames[
                offerDetails.crypto_currency_code as keyof typeof cryptoCurrencyNames
              ]
            }
            offerOwnerUsername={offerDetails.offer_owner_username}
          />
          <PaymentInputs
            payAmount={payAmount}
            receiveAmount={receiveAmount}
            currencyCode={offerDetails.currency_code}
            cryptoCurrencyCode={offerDetails.crypto_currency_code}
            errorMessage={errorMessage}
            onPayAmountChange={handlePayAmountChange}
            onStartTrade={handleStartTrade}
          />
          <OfferDetailsSection offerDetails={offerDetails} />
          <SellerInfoSection offerDetails={offerDetails} />
        </div>
      )}
    </>
  );
}
