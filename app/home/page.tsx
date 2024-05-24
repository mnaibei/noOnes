"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import PaymentMethods from "../payment/page";
import CreateOffer from "../create-offer/page";
import Offers from "../fetch-offers/page";
import OffersList from "../list-users-offers/page";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    Cookies.get("access_token")
  );
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();

  const logout = () => {
    Cookies.remove("access_token");
    setAccessToken(undefined);
    router.push("/login");
  };

  const api = axios.create();

  // api.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     console.error("API error:", error.response?.data);
  //     if (error.response?.data) {
  //       console.log("WTF!!!!!!!!");
  //       console.error("Server error. Logging out.");
  //       // logout();
  //       alert("Your session has expired. Please log in again.");
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!accessToken && code) {
      api
        .post("/api/auth/getAccessToken", { code })
        .then((response) => {
          const accessToken = response.data.access_token;
          Cookies.set("access_token", accessToken);
          setAccessToken(accessToken);
        })
        .catch((error) => console.error("Error fetching access token:", error));
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    api
      .post("/api/auth/getUserInfo", { accessToken })
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => console.error("Error fetching user info:", error));
  }, [accessToken]);

  return (
    <>
      <div>
        {userInfo && (
          <div>
            <div className="flex justify-between p-2 m-2">
              <h1 className="font-bold text-2xl flex items-center justify-center gap-4">
                <img
                  src={userInfo.data.avatar_url}
                  alt={userInfo.data.username}
                  className="w-16 h-16 rounded-full"
                />
                <span className="text-green-500 ">
                  {userInfo.data.username}
                </span>
              </h1>
              <button
                onClick={logout}
                className="border-2 border-red-500 w-36 rounded">
                Logout
              </button>
            </div>
            <div className="p-2 m-2 flex justify-between">
              <p>
                Last seen: {userInfo.data.last_seen}{" "}
                <span>
                  <sup>{userInfo.data.last_ip_country}</sup>
                </span>
              </p>
              <ul className="flex gap-4">
                {" "}
                <li>BTC: {userInfo.data.total_btc}</li>{" "}
                <li>ETH: {userInfo.data.total_eth}</li>{" "}
                <li>USDT: {userInfo.data.total_usdt}</li>{" "}
                <li>USDC: {userInfo.data.total_usdc}</li>
              </ul>
            </div>
            {/* <pre>{JSON.stringify(userInfo, null, 2)}</pre> */}
          </div>
        )}
      </div>
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
