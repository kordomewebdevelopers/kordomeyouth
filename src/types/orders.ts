export type OrderStatus = "pending" | "queued" | "success" | "unmatched";

export type Order = {
  date: number;
  id: string;
  receiver: string;
  user_id: string;
  status: OrderStatus;
  pack: string;
  network: string;
  amount: string;
  transact_id: string;
};
