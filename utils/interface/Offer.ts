export interface Offer {
  offer_hash: string;
  offer_id: string;
  offer_type: string;
  fiat_price_per_btc: number;
  fiat_price_per_crypto: number;
  payment_method_name: string;
  offer_terms: string;
  offer_link: string;
  crypto_currency: string;
  crypto_currency_code: string;
  payment_window: number;
  currency_code: string;
  fiat_amount_range_min: number;
  fiat_amount_range_max: number;
  offer_owner_username: string;
  payment_method_label: string;
  offer_owner_feedback_positive: number;
  offer_owner_feedback_negative: number;
  monthly_trade_stats: {
    trades_count_total: number;
    trades_percent_success: number;
  };
}
