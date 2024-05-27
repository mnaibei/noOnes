export interface ChatMessage {
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
