"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    Cookies.get("access_token")
  );
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!accessToken && code) {
      axios
        .post("/api/getAccessToken", { code })
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

    axios
      .post("/api/getUserInfo", { accessToken })
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }, [accessToken]);

  return (
    <div>
      <h1>Success Login</h1>
      {userInfo && (
        <div>
          <h2>User Info</h2>
          <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
