"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface PaymentMethod {
  name: string;
  slug: string;
  group_slug: string;
}

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const access_token = Cookies.get("access_token");

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.post("/api/getPaymentMethod", {
          accessToken: access_token,
        });
        setPaymentMethods(response.data.data.methods);
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Define the names of the payment methods you want to display
  const paymentMethodNames = [
    "Airtel Money",
    "Equitel Mobile Money",
    "M-Pesa",
    "T-kash",
  ];

  return (
    <div className="p-2 m-2 flex gap-4">
      {paymentMethods
        .filter((method) => paymentMethodNames.includes(method.name))
        .map((method) => (
          <div key={method.slug}>
            <h2>{method.name}</h2>
          </div>
        ))}
    </div>
  );
};

export default PaymentMethods;
