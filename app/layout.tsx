"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import "./globals.css";
import Head from "next/head";
import Nav from "@/components/Nav";
import { UserContext } from "@/utils/UserContext";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    Cookies.get("access_token")
  );
  const [userInfo, setUserInfo] = useState<any>(null);
  const [walletSummary, setWalletSummary] = useState<any>(null);
  const router = useRouter();

  const logout = async () => {
    await router.push("/login");
    Cookies.remove("access_token");
    setAccessToken(undefined);
    setUserInfo(null); // clear user info
    setWalletSummary(null); // clear wallet summary
  };

  const api = axios.create();

  useEffect(() => {
    const fetchData = async () => {
      const code = new URL(window.location.href).searchParams.get("code");

      if (!accessToken && code) {
        try {
          const response = await api.post("/api/auth/getAccessToken", { code });
          const accessToken = response.data.access_token;
          Cookies.set("access_token", accessToken);
          setAccessToken(accessToken);
        } catch (error) {
          console.error("Error fetching access token:", error);
        }
      }

      if (accessToken) {
        try {
          const userInfoResponse = await api.post("/api/auth/getUserInfo", {
            accessToken,
          });
          setUserInfo(userInfoResponse.data);

          const walletSummaryResponse = await api.get(
            "/api/wallet/getWalletSummary",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setWalletSummary(walletSummaryResponse.data);
          console.log("Wallet summary:", walletSummaryResponse.data);
        } catch (error) {
          console.error("Error fetching user info or wallet summary:", error);
        }
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <html>
      <Head>
        <html lang="en" />
      </Head>
      <body>
        <UserContext.Provider value={{ userInfo, logout }}>
          {userInfo && (
            <Nav
              userInfo={userInfo}
              onLogout={logout}
              walletSummary={walletSummary}
            />
          )}
          {children}
        </UserContext.Provider>
      </body>
    </html>
  );
}
