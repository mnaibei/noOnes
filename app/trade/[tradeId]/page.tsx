"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/utils/UserContext";
import Cookies from "js-cookie";
import axios from "axios";

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

export default function TradePage() {
  const params = useParams();
  const tradeId = params?.tradeId as string;
  const { userInfo } = useContext(UserContext);
  const searchParams = useSearchParams();
  const payAmount = searchParams?.get("payAmount");
  const receiveAmount = searchParams?.get("receiveAmount");
  const access_token = Cookies.get("access_token");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await axios.post(
          "/api/trade/webhook",
          { tradeId },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log("response", response);
        setChatMessages(response.data.data);
      } catch (error) {
        console.error("Failed to fetch chat messages:", error);
      }
    };

    if (tradeId && access_token) {
      fetchChatMessages();
    }
  }, [tradeId, access_token]);

  return (
    <>
      {userInfo && (
        <div>
          <h1>Trade Page</h1>
          <p>Offer ID: {tradeId}</p>
          <p>Pay Amount: {payAmount}</p>
          <p>Receive Amount: {receiveAmount}</p>
          <div>
            <h2>Chat Messages</h2>
            {chatMessages?.length > 0 ? (
              chatMessages.map((msg, index) => (
                <div key={index}>
                  <p>
                    <strong>{msg.sender}:</strong> {msg.message}{" "}
                    <em>{msg.timestamp}</em>
                  </p>
                </div>
              ))
            ) : (
              <p>No chat messages available.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
