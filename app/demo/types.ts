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

export type TriggerType = "visits_milestone" | "days_overdue" | "total_spend" | "inactivity";
export type RewardType = "flat_discount" | "percent_discount" | "free_item";

export interface OfferRule {
  id: string;
  name: string;
  triggerType: TriggerType;
  triggerValue: number;
  rewardType: RewardType;
  rewardValue: number | string;
  minBill: number;
  expiryDays: number;
  isActive: boolean;
  description: string;
}

export interface CafeSettings {
  deadHoursEnabled: boolean;
  deadHoursDays: string;
  deadHoursStartTime: string;
  deadHoursEndTime: string;
  deadHoursTime: string;
  googleMapsReviewUrl: string;
  autoGoogleReviewTriggerVisits: number;
}

