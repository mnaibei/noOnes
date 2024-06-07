"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/utils/UserContext";
import Cookies from "js-cookie";
import axios from "axios";
import { ChatMessage } from "@/utils/interface/ChatMessage";

export default function TradePage() {
  const params = useParams();
  const tradeId = params?.tradeId as string;
  const { userInfo } = useContext(UserContext);
  const searchParams = useSearchParams();
  const buyer = searchParams?.get("buyer");
  const receiveAmount = searchParams?.get("receiveAmount");
  const access_token = Cookies.get("access_token");
  const router = useRouter();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [twoFaToken, setTwoFaToken] = useState(""); // Assuming 2FA token has been set by the user

  console.log("buyer sent from active trade component", buyer);
  console.log("Current user username", userInfo.data.username);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await axios.post(
          "/api/trade/chat/getMessage",
          { tradeId },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log("chats response", response.data);
        setChatMessages(response.data.data.messages);
      } catch (error) {
        console.error("Failed to fetch chat messages:", error);
      }
    };

    if (tradeId && access_token) {
      fetchChatMessages();

      // Fetch chat messages periodically
      const intervalId = setInterval(fetchChatMessages, 5000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [tradeId, access_token]);

  const handleCancelTrade = async () => {
    try {
      const response = await axios.post(
        "/api/trade/cancelTrade",
        { trade_hash: tradeId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log(response.data);
      router.push("/");
    } catch (error) {
      console.error("Failed to cancel trade:", error);
    }
  };

  const handleCompletedTrade = async () => {
    try {
      const response = await axios.post(
        "/api/trade/completeTrade",
        { trade_hash: tradeId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to complete trade:", error);
    }
  };

  const handleReleaseCrypto = async () => {
    try {
      const response = await axios.post(
        "/api/trade/releaseToken",
        { trade_hash: tradeId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "x-paxful-2fa": twoFaToken, // Include 2FA token
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to release crypto:", error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        "/api/trade/chat/postMessage",
        { tradeHash: tradeId, message },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Message sent successfully:", response.data);

      // Update chat messages state with the new message
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          ...response.data,
          timestamp: Date.now() / 1000,
          trade_hash: tradeId,
          text: message,
        },
      ]);

      // Clear the message input
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <>
      {userInfo && (
        <div className="p-2 m-2 flex flex-col gap-2">
          <h1 className="font-bold text-2xl self-center">Trade Page</h1>
          <p className="font-bold">Trade ID: {tradeId}</p>

          {userInfo.data.username === buyer ? (
            <>
              <button
                className="border-2 rounded border-red-200 bg-red-500 p-2 text-center"
                onClick={handleCancelTrade}>
                Cancel Trade
              </button>
              <button
                className="border-2 rounded border-green-200 bg-green-500 p-2 text-center"
                onClick={handleCompletedTrade}>
                Mark Trade as Paid
              </button>
            </>
          ) : (
            <>
              <button
                className="border-2 rounded border-green-200 bg-green-500 p-2 text-center"
                onClick={handleReleaseCrypto}>
                Send Token
              </button>
              <p className="mt-2">
                If you have Two Factor Authentication enabled please enter the
                code below
              </p>
              <input
                type="text"
                value={twoFaToken}
                onChange={(e) => setTwoFaToken(e.target.value)}
                placeholder="Enter 2FA Token"
                className="border p-2 rounded mt-2"
              />
            </>
          )}

          <div>
            <h2 className="font-bold self-center">Chat Messages</h2>
            {chatMessages.length > 0 ? (
              chatMessages.map((msg, index) => (
                <div key={index} className="border-2 border-gray-300 py-2">
                  <p>
                    <strong>Message Type:</strong> {msg.type}
                  </p>
                  <p className="text-yellow-500">
                    <strong>Message:</strong> {msg.text}
                  </p>
                  <p>
                    <em>{new Date(msg.timestamp * 1000).toLocaleString()}</em>
                  </p>
                </div>
              ))
            ) : (
              <p>No chat messages available.</p>
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here"
              className="w-full h-24 border-2 border-gray-300 p-2 rounded"
            />
            <button
              className="border-2 rounded border-green-200 bg-green-500 p-2 text-center"
              onClick={handleSendMessage}>
              Send Message
            </button>
          </div>
        </div>
      )}
    </>
  );
}
