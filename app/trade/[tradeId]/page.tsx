"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/utils/UserContext";
import Cookies from "js-cookie";
import axios from "axios";

interface ChatMessage {
  id: string;
  timestamp: number;
  type: string;
  trade_hash: string;
  is_for_moderator: boolean;
  author: string | null;
  security_awareness: string | null;
  mark_as_read: boolean;
  status: number;
  text: string;
  author_uuid: string | null;
  sent_by_moderator: boolean;
}

export default function TradePage() {
  const params = useParams();
  const tradeId = params?.tradeId as string;
  const { userInfo } = useContext(UserContext);
  const searchParams = useSearchParams();
  const payAmount = searchParams?.get("payAmount");
  const receiveAmount = searchParams?.get("receiveAmount");
  const access_token = Cookies.get("access_token");
  const router = useRouter();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [Message, setMessage] = useState("");

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
        console.log("chats response", response.data);
        setChatMessages(response.data.data.messages);
      } catch (error) {
        console.error("Failed to fetch chat messages:", error);
      }
    };

    if (tradeId && access_token) {
      fetchChatMessages();
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

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        "/api/trade/postMessage",
        { tradeHash: tradeId, message: Message },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Message sent successfully:", response.data);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <>
      {userInfo && (
        <div className="p-2 m-2 flex flex-col gap-2">
          <h1>Trade Page</h1>
          <p>Trade Hash: {tradeId}</p>
          <p>Pay Amount: {payAmount}</p>
          <p>Receive Amount: {receiveAmount}</p>
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

          <div>
            <h2>Chat Messages</h2>
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
          <div>
            <textarea
              value={Message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here"
            />
            <button onClick={handleSendMessage}>Send Message</button>
          </div>
        </div>
      )}
    </>
  );
}
