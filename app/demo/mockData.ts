import { Customer, BillItem } from "./types";

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    status: "Regular customer",
    visits: 8,
    totalSpent: 4280,
    usualGapDays: 9,
    lastVisitDaysAgo: 12,
    favoriteItem: "Cold Coffee",
    customerSince: "May 2024",
    availableReward: 100,
    isOverdue: true,
    defaultMessage:
      "Hi Rahul,\n\nIt's been a while!\nYour usual Cold Coffee is waiting.\n\nHere's ₹100 off your next visit this week.\n\nHope to see you soon!",
    history: [
      { id: "h1", timeAgo: "12 days ago", items: "Cold Coffee", amount: 180 },
      { id: "h2", timeAgo: "21 days ago", items: "Paneer Wrap", amount: 240 },
      { id: "h3", timeAgo: "30 days ago", items: "Cold Coffee", amount: 180 },
      { id: "h4", timeAgo: "1 month ago", items: "Cold Coffee + Sandwich", amount: 420 },
      { id: "h5", timeAgo: "2 months ago", items: "Cappuccino", amount: 160 },
    ],
  },
  {
    id: "c2",
    name: "Aman Verma",
    phone: "+91 87654 32109",
    status: "Regular customer",
    visits: 5,
    totalSpent: 2850,
    usualGapDays: 14,
    lastVisitDaysAgo: 18,
    favoriteItem: "Cappuccino + Croissant",
    customerSince: "Jun 2024",
    availableReward: 75,
    isOverdue: true,
    defaultMessage:
      "Hi Aman,\n\nMissing your morning Cappuccino at The Daily Brew? Drop in this week and take ₹75 off your bill on us!\n\nSee you soon!",
    history: [
      { id: "h21", timeAgo: "18 days ago", items: "Cappuccino + Croissant", amount: 320 },
      { id: "h22", timeAgo: "33 days ago", items: "Cappuccino", amount: 170 },
      { id: "h23", timeAgo: "46 days ago", items: "Avocado Toast + Latte", amount: 480 },
    ],
  },
  {
    id: "c3",
    name: "Simran Kaur",
    phone: "+91 96543 21098",
    status: "VIP customer",
    visits: 12,
    totalSpent: 6900,
    usualGapDays: 21,
    lastVisitDaysAgo: 20,
    favoriteItem: "Flat White + Cookie",
    customerSince: "Feb 2024",
    availableReward: 100,
    isOverdue: true,
    defaultMessage:
      "Hi Simran,\n\nYou're one of our top regulars! Bring a friend this weekend to The Daily Brew and enjoy ₹100 off your table.\n\nCheers!",
    history: [
      { id: "h31", timeAgo: "20 days ago", items: "Flat White + Cookie", amount: 310 },
      { id: "h32", timeAgo: "41 days ago", items: "Flat White + Truffle Pasta", amount: 560 },
      { id: "h33", timeAgo: "62 days ago", items: "Iced Latte", amount: 210 },
    ],
  },
  {
    id: "c4",
    name: "Neha Kapoor",
    phone: "+91 99876 54321",
    status: "Regular customer",
    visits: 4,
    totalSpent: 1950,
    usualGapDays: 10,
    lastVisitDaysAgo: 16,
    favoriteItem: "Iced Americano",
    customerSince: "Jul 2024",
    availableReward: 50,
    isOverdue: true,
    defaultMessage:
      "Hi Neha,\n\nWe haven't seen you in a couple of weeks! Your favorite Iced Americano is waiting — here's ₹50 off your next visit.\n\nHave a great day!",
    history: [
      { id: "h41", timeAgo: "16 days ago", items: "Iced Americano + Brownie", amount: 320 },
      { id: "h42", timeAgo: "27 days ago", items: "Iced Americano", amount: 160 },
    ],
  },
  {
    id: "c5",
    name: "Arjun Mehta",
    phone: "+91 91234 56789",
    status: "Regular customer",
    visits: 6,
    totalSpent: 3400,
    usualGapDays: 12,
    lastVisitDaysAgo: 15,
    favoriteItem: "Cold Brew",
    customerSince: "Apr 2024",
    availableReward: 50,
    isOverdue: true,
    defaultMessage:
      "Hey Arjun,\n\nTime for your Cold Brew refill at The Daily Brew! Take ₹50 off when you visit before Sunday.\n\nCatch you soon!",
    history: [
      { id: "h51", timeAgo: "15 days ago", items: "Cold Brew + Bagel", amount: 340 },
      { id: "h52", timeAgo: "28 days ago", items: "Cold Brew", amount: 190 },
    ],
  },
];

export const DEFAULT_BILL_ITEMS: BillItem[] = [
  { id: "b1", name: "Cold Coffee", price: 180, quantity: 1 },
  { id: "b2", name: "Paneer Wrap", price: 240, quantity: 1 },
];

export const AVAILABLE_MENU_ITEMS = [
  { name: "Cold Coffee", price: 180 },
  { name: "Paneer Wrap", price: 240 },
  { name: "Cappuccino", price: 160 },
  { name: "Sandwich", price: 200 },
  { name: "Flat White", price: 190 },
  { name: "Croissant", price: 150 },
];
