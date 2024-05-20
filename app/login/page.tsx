"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [clientId] = useState(
    "EWsZlpe6wctFVdSMc4Knt9V8Y4kCDzgYjrLFuhMA8pfZgKpx"
  ); // Replace with your NoOnes client ID
  const redirectUri = "https://mn20qvr9-3000.uks1.devtunnels.ms/home"; // Replace with your redirect URI

  // console.log("Client ID:", clientId);

  const handleLogin = () => {
    const authorizationUrl = `https://auth.noones.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=READ`; // Add desired scopes

    // Redirect the user for login
    window.location.href = authorizationUrl;
    console.log("Redirecting to:", authorizationUrl);
  };

  return (
    <div className=" h-screen flex items-center justify-center">
      <button
        className="noones-login-button border-2 border-red-500 w-300 h-300 w-56 p-2 rounded"
        onClick={handleLogin}>
        Sign up with NoOnes
      </button>
    </div>
  );
};

export default LoginPage;
