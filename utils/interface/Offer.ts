export interface Offer {
  offer_id: string;
  offer_type: string;
  payment_window: number;
  currency_code: string;
  fiat_price_per_btc: number;
  payment_method_name: string;
  fiat_amount_range_min: number;
  fiat_amount_range_max: number;
  offer_owner_username: string;
  offer_link: string;
  crypto_currency_code: string;
}
