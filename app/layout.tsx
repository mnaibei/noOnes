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
  const [affiliateSummary, setAffiliateSummary] = useState<any>(null);
  const router = useRouter();

  const logout = async () => {
    await router.push("/login");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("token_expiry");
    setAccessToken(undefined);
    setUserInfo(null);
    setWalletSummary(null);
    setAffiliateSummary(null);
  };

  const api = axios.create();

  useEffect(() => {
    const refreshToken = async () => {
      const storedRefreshToken = Cookies.get("refresh_token");
      console.log("Stored refresh token:", storedRefreshToken);
      if (!storedRefreshToken) return;

      try {
        const response = await api.post("/api/auth/refreshAccessToken", {
          refreshToken: storedRefreshToken,
        });
        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token; // get new refresh token if available
        const expiresIn = response.data.expires_in;
        const tokenExpiry = Date.now() + expiresIn * 1000;
        Cookies.set("access_token", newAccessToken);
        Cookies.set("token_expiry", tokenExpiry.toString());
        if (newRefreshToken) {
          Cookies.set("refresh_token", newRefreshToken); // update refresh token if a new one is provided
        }
        setAccessToken(newAccessToken);
      } catch (error) {
        console.error("Failed to refresh access token:", error);
        logout();
      }
    };

    const fetchData = async () => {
      const code = new URL(window.location.href).searchParams.get("code");

      if (!accessToken && code) {
        try {
          const response = await api.post("/api/auth/getAccessToken", { code });
          const accessToken = response.data.access_token;
          const refreshToken = response.data.refresh_token;
          const expiresIn = response.data.expires_in;
          const tokenExpiry = Date.now() + expiresIn * 1000;
          Cookies.set("access_token", accessToken);
          Cookies.set("refresh_token", refreshToken);
          Cookies.set("token_expiry", tokenExpiry.toString());
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
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          setWalletSummary(walletSummaryResponse.data);

          const affiliateSummaryResponse = await api.post(
            "/api/affiliate/getAffiliateSummary",
            {},
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          setAffiliateSummary(affiliateSummaryResponse.data);
        } catch (error: any) {
          if (error.response?.status === 401) {
            await refreshToken();
          } else {
            console.error("Error fetching data:", error);
          }
        }
      }
    };

    fetchData();

    const intervalId = setInterval(async () => {
      const tokenExpiry = parseInt(Cookies.get("token_expiry") || "0");
      if (Date.now() >= tokenExpiry - 5 * 60 * 1000) {
        // Refresh token 5 minutes before expiry
        await refreshToken();
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
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
              affiliateSummary={affiliateSummary}
            />
          )}
          {children}
        </UserContext.Provider>
      </body>
    </html>
  );
}
