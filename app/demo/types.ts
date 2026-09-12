export interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface VisitHistoryItem {
  id: string;
  timeAgo: string;
  items: string;
  amount: number;
  isToday?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  status: "Regular customer" | "VIP customer" | "New customer";
  visits: number;
  totalSpent: number;
  usualGapDays: number;
  lastVisitDaysAgo: number;
  favoriteItem: string;
  customerSince: string;
  availableReward: number;
  isOverdue: boolean;
  history: VisitHistoryItem[];
  defaultMessage: string;
  returned?: boolean;
}
