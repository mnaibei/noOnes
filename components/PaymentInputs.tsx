import React from "react";

interface PaymentInputsProps {
  payAmount: string;
  receiveAmount: string;
  currencyCode: string;
  cryptoCurrencyCode: string;
  errorMessage: string;
  onPayAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStartTrade: () => void;
}

const PaymentInputs: React.FC<PaymentInputsProps> = ({
  payAmount,
  receiveAmount,
  currencyCode,
  cryptoCurrencyCode,
  errorMessage,
  onPayAmountChange,
  onStartTrade,
}) => (
  <div className="border-2 border-red-500 p-2 m-2 flex justify-evenly items-center">
    <div className="w-full">
      <label>I will pay</label>
      <br />
      <input
        type="number"
        value={payAmount}
        onChange={onPayAmountChange}
        className="border-2 border-gray-500 w-3/4"
      />{" "}
      {currencyCode}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
    <div className="w-full">
      <label>and receive</label>
      <br />
      <input
        type="number"
        value={receiveAmount}
        className="border-2 border-gray-500 w-3/4"
        readOnly
      />{" "}
      {cryptoCurrencyCode}
    </div>
    <button
      onClick={onStartTrade}
      className="border-2 border-green-500 p-2 rounded w-1/2">
      Start Trade
    </button>
  </div>
);

export default PaymentInputs;
