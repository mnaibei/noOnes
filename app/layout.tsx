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
  const router = useRouter();

  const logout = async () => {
    await router.push("/login");
    Cookies.remove("access_token");
    setAccessToken(undefined);
    setUserInfo(null); // clear user info
  };

  const api = axios.create();

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
    <html>
      <Head>
        <html lang="en" />
      </Head>
      <body>
        <UserContext.Provider value={{ userInfo, logout }}>
          {userInfo && <Nav userInfo={userInfo} onLogout={logout} />}
          {children}
        </UserContext.Provider>
      </body>
    </html>
  );
}
