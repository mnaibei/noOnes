export interface OffersDetails {
  offer_hash: string;
  fiat_price_per_crypto: number;
  offer_type: string;
  payment_window: number;
  currency_code: string;
  payment_method_name: string;
  fiat_amount_range_min: number;
  fiat_amount_range_max: number;
  offer_owner_username: string;
  offer_terms: string;
  crypto_currency_code: string;
  payment_method_label: string;
  offer_owner_feedback_positive: number;
  offer_owner_feedback_negative: number;
  monthly_trade_stats: {
    trades_count_total: number;
    trades_percent_success: number;
  };
}
