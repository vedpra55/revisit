"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconLogo,
  IconSearch,
  IconGift,
  IconCoffee,
  IconClock,
  IconRupee,
  IconCheck,
  IconWhatsApp,
  IconArrowRight,
  IconCoins,
} from "../components/Icons";
import { Customer, BillItem } from "./types";
import {
  INITIAL_CUSTOMERS,
  DEFAULT_BILL_ITEMS,
  AVAILABLE_MENU_ITEMS,
} from "./mockData";

export default function DemoPage() {
  // Navigation tabs: 'counter' | 'retention'
  const [activeTab, setActiveTab] = useState<"counter" | "retention">("counter");

  // Global demo state
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchPhone, setSearchPhone] = useState("+91 98765 43210");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("c1");

  // Counter tab state
  const [billItems, setBillItems] = useState<BillItem[]>(DEFAULT_BILL_ITEMS);
  const [isRewardApplied, setIsRewardApplied] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Retention tab state
  const [activeRetentionCustomerId, setActiveRetentionCustomerId] = useState<string>("c1");
  const [customMessage, setCustomMessage] = useState<string>(
    INITIAL_CUSTOMERS[0].defaultMessage
  );
  const [returnSuccessMessage, setReturnSuccessMessage] = useState<string | null>(null);

  // Active customer in Counter
  const activeCustomer =
    customers.find((c) => c.phone.replace(/\s+/g, "") === searchPhone.replace(/\s+/g, "")) ||
    customers.find((c) => c.id === selectedCustomerId) ||
    customers[0];

  // Active customer in Retention
  const activeRetentionCustomer =
    customers.find((c) => c.id === activeRetentionCustomerId) || customers[0];

  // Bill calculations
  const subtotal = billItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = isRewardApplied && activeCustomer ? activeCustomer.availableReward : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Handlers for Bill Items
  const handleQuantityChange = (id: string, delta: number) => {
    setBillItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as BillItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setBillItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = (menuItem: { name: string; price: number }) => {
    setBillItems((prev) => {
      const existing = prev.find((item) => item.name === menuItem.name);
      if (existing) {
        return prev.map((item) =>
          item.name === menuItem.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        { id: `item-${Date.now()}`, name: menuItem.name, price: menuItem.price, quantity: 1 },
      ];
    });
  };

  // Quick customer select in counter
  const selectSampleCustomer = (c: Customer) => {
    setSearchPhone(c.phone);
    setSelectedCustomerId(c.id);
    setIsRewardApplied(false);
    setSaveSuccessMessage(null);
  };

  // Save Visit in Counter
  const handleSaveVisit = () => {
    if (!activeCustomer) return;

    const updatedHistory = [
      {
        id: `h-now-${Date.now()}`,
        timeAgo: "Just now",
        items: billItems.map((b) => `${b.quantity}x ${b.name}`).join(", "),
        amount: finalTotal,
        isToday: true,
      },
      ...activeCustomer.history,
    ];

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === activeCustomer.id
          ? {
              ...c,
              visits: c.visits + 1,
              totalSpent: c.totalSpent + finalTotal,
              lastVisitDaysAgo: 0,
              isOverdue: false,
              availableReward: 0,
              history: updatedHistory,
            }
          : c
      )
    );

    setIsRewardApplied(false);
    setSaveSuccessMessage(
      `✓ Visit saved to ${activeCustomer.name}'s history! Total spend updated to ₹${(
        activeCustomer.totalSpent + finalTotal
      ).toLocaleString("en-IN")}.`
    );

    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4500);
  };

  // Select customer in Retention view
  const handleSelectRetentionCustomer = (c: Customer) => {
    setActiveRetentionCustomerId(c.id);
    setCustomMessage(c.defaultMessage);
    setReturnSuccessMessage(null);
  };

  // WhatsApp open trigger
  const handleOpenWhatsApp = () => {
    const rawNumber = activeRetentionCustomer.phone.replace(/[^0-9]/g, "");
    const encoded = encodeURIComponent(customMessage);
    const url = `https://wa.me/${rawNumber}?text=${encoded}`;
    window.open(url, "_blank");
  };

  // Simulate Customer Return (Closes the loop)
  const handleSimulateReturn = () => {
    const returnBillAmount = 520;
    const rewardUsed = 100;
    const netPaid = returnBillAmount - rewardUsed;

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === activeRetentionCustomer.id
          ? {
              ...c,
              visits: c.visits + 1,
              totalSpent: c.totalSpent + netPaid,
              lastVisitDaysAgo: 0,
              isOverdue: false,
              returned: true,
              history: [
                {
                  id: `h-sim-${Date.now()}`,
                  timeAgo: "Today",
                  items: "Cold Coffee + Sandwich + Cappuccino",
                  amount: netPaid,
                  isToday: true,
                },
                ...c.history,
              ],
            }
          : c
      )
    );

    setReturnSuccessMessage(
      `🎉 Repeat visit recorded! ${activeRetentionCustomer.name} returned and spent ₹${netPaid}. Revisit tracked +₹${netPaid} repeat revenue!`
    );

    setTimeout(() => {
      setReturnSuccessMessage(null);
    }, 6000);
  };

  // Reset demo
  const handleResetDemo = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setSearchPhone("+91 98765 43210");
    setSelectedCustomerId("c1");
    setActiveRetentionCustomerId("c1");
    setCustomMessage(INITIAL_CUSTOMERS[0].defaultMessage);
    setBillItems(DEFAULT_BILL_ITEMS);
    setIsRewardApplied(false);
    setSaveSuccessMessage(null);
    setReturnSuccessMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0B] flex flex-col selection:bg-[#0A0A0B] selection:text-white">
      {/* Top Demo Header */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1340px] items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo & Cafe Brand */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-[17px] font-bold tracking-tight text-[#0A0A0B] hover:opacity-80 transition-opacity"
            >
              <IconLogo className="h-6 w-6" />
              <span>revisit</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 border-l border-black/[0.08] pl-4 text-[13px] text-[#71717A]">
              <span className="flex items-center gap-1.5 font-medium text-[#0A0A0B]">
                <IconCoffee className="h-3.5 w-3.5 text-[#A1A1AA]" />
                The Daily Brew
              </span>
              <span className="rounded-md bg-[#F4F4F5] px-2 py-0.5 text-[11px] font-medium text-[#71717A]">
                Indiranagar
              </span>
            </div>
          </div>

          {/* Center Navigation Switcher */}
          <div className="flex items-center rounded-xl bg-[#F4F4F5] p-1 text-[13px] font-semibold">
            <button
              onClick={() => setActiveTab("counter")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 transition-all ${
                activeTab === "counter"
                  ? "bg-white text-[#0A0A0B] shadow-xs"
                  : "text-[#71717A] hover:text-[#0A0A0B]"
              }`}
            >
              <IconCoins className="h-4 w-4" />
              <span>At the counter</span>
            </button>
            <button
              onClick={() => setActiveTab("retention")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 transition-all ${
                activeTab === "retention"
                  ? "bg-white text-[#0A0A0B] shadow-xs"
                  : "text-[#71717A] hover:text-[#0A0A0B]"
              }`}
            >
              <IconWhatsApp className="h-4 w-4 text-[#16A34A]" />
              <span>Bring them back</span>
              {customers.some((c) => c.isOverdue && !c.returned) && (
                <span className="flex h-2 w-2 rounded-full bg-[#EF4444]" />
              )}
            </button>
          </div>

          {/* Right Status & Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11.5px] font-semibold text-[#047857]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Live Demo Mode
            </span>

            <button
              onClick={handleResetDemo}
              className="text-[12px] font-medium text-[#71717A] hover:text-[#0A0A0B] transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-black/[0.04]"
              title="Reset all customer records to initial state"
            >
              Reset demo
            </button>
          </div>
        </div>
      </header>

      {/* Main Demo Workspace */}
      <main className="flex-1 mx-auto w-full max-w-[1340px] px-4 py-6 sm:px-6 sm:py-8">
        {/* ========================================================================= */}
        {/* TAB 1: AT THE COUNTER                                                      */}
        {/* ========================================================================= */}
        {activeTab === "counter" && (
          <div className="space-y-6">
            {/* Quick Context Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
              <div>
                <h1 className="text-[22px] sm:text-[24px] font-bold tracking-tight text-[#0A0A0B]">
                  A customer just arrived.
                </h1>
                <p className="text-[14px] text-[#71717A]">
                  Enter their phone number at the counter to see their history and available reward.
                </p>
              </div>

              {/* Sample Quick Picks */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-medium text-[#71717A]">Sample customer:</span>
                {customers.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectSampleCustomer(c)}
                    className={`rounded-lg px-2.5 py-1 text-[12px] font-medium transition-all ${
                      searchPhone === c.phone
                        ? "bg-[#0A0A0B] text-white"
                        : "bg-white border border-black/[0.08] text-[#0A0A0B] hover:bg-black/[0.02]"
                    }`}
                  >
                    {c.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Success Notification */}
            {saveSuccessMessage && (
              <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 text-[14px] font-semibold text-[#047857] flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <IconCheck className="h-5 w-5 shrink-0" />
                  <span>{saveSuccessMessage}</span>
                </div>
                <button
                  onClick={() => setActiveTab("retention")}
                  className="rounded-lg bg-[#047857] px-3 py-1 text-[12px] font-bold text-white hover:bg-[#065F46] transition-colors"
                >
                  View Retention Queue →
                </button>
              </div>
            )}

            {/* 3-Column Pure Grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 items-start">
              {/* Left Column: Search & Current Bill */}
              <div className="space-y-5">
                {/* Search Box */}
                <div className="rounded-[22px] bg-white p-5 border border-black/[0.06] shadow-xs">
                  <label className="text-[13px] font-bold text-[#0A0A0B] block mb-2">
                    Search customer
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchPhone}
                      onChange={(e) => setSearchPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-black/[0.08] bg-[#FAFAFA] px-3.5 py-2.5 text-[14px] font-medium text-[#0A0A0B] focus:border-[#0A0A0B] focus:bg-white focus:outline-none transition-colors tabular"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]">
                      <IconSearch className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    {customers.slice(0, 3).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => selectSampleCustomer(c)}
                        className="text-[11.5px] text-[#71717A] hover:text-[#0A0A0B] underline underline-offset-2 transition-colors"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Today's Bill Card */}
                <div className="rounded-[22px] bg-white p-5 border border-black/[0.06] shadow-xs">
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                    <span className="text-[14px] font-bold text-[#0A0A0B]">Today&apos;s bill</span>
                    <button
                      onClick={() => setBillItems([])}
                      className="text-[11.5px] font-medium text-[#71717A] hover:text-[#EF4444] transition-colors"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Items list */}
                  <div className="mt-3 divide-y divide-black/[0.04]">
                    {billItems.length === 0 ? (
                      <div className="py-6 text-center text-[13px] text-[#A1A1AA]">
                        No items added yet. Click &quot;Add item&quot; below.
                      </div>
                    ) : (
                      billItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2.5 text-[13.5px]"
                        >
                          <div>
                            <p className="font-semibold text-[#0A0A0B]">{item.name}</p>
                            <p className="tabular text-[12px] text-[#71717A]">
                              ₹{item.price} each
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-lg border border-black/[0.08] bg-[#FAFAFA] text-[12px]">
                              <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="px-2 py-0.5 text-[#71717A] hover:text-[#0A0A0B]"
                              >
                                -
                              </button>
                              <span className="tabular px-1.5 font-bold text-[#0A0A0B]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="px-2 py-0.5 text-[#71717A] hover:text-[#0A0A0B]"
                              >
                                +
                              </button>
                            </div>

                            <span className="tabular font-bold text-[#0A0A0B] min-w-[50px] text-right">
                              ₹{item.price * item.quantity}
                            </span>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-[#A1A1AA] hover:text-[#EF4444] text-[12px]"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Quick Add Menu items */}
                  <div className="mt-3 border-t border-black/[0.06] pt-3">
                    <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-2">
                      + Add Menu Item
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_MENU_ITEMS.map((menu) => (
                        <button
                          key={menu.name}
                          onClick={() => handleAddItem(menu)}
                          className="rounded-lg bg-[#FAFAFA] border border-black/[0.06] px-2.5 py-1 text-[11.5px] font-medium text-[#0A0A0B] hover:bg-[#F4F4F5] transition-colors"
                        >
                          + {menu.name} (₹{menu.price})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bill Summary */}
                  <div className="mt-4 border-t border-black/[0.06] pt-3 space-y-1.5 text-[13.5px]">
                    <div className="flex justify-between text-[#71717A]">
                      <span>Subtotal</span>
                      <span className="tabular font-medium text-[#0A0A0B]">₹{subtotal}</span>
                    </div>

                    {isRewardApplied && (
                      <div className="flex justify-between text-[#047857] font-medium">
                        <span>Revisit reward applied</span>
                        <span className="tabular font-bold">-₹{discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between border-t border-black/[0.06] pt-2 text-[16px] font-bold text-[#0A0A0B]">
                      <span>Total to pay</span>
                      <span className="tabular">₹{finalTotal}</span>
                    </div>
                  </div>

                  {/* Complete Button */}
                  <button
                    onClick={handleSaveVisit}
                    disabled={billItems.length === 0}
                    className="mt-5 w-full rounded-xl bg-[#0A0A0B] py-3 text-[14px] font-bold text-white hover:bg-black/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Save visit</span>
                    <IconArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Center Column: Customer Profile & Available Reward */}
              <div className="space-y-5">
                {/* Customer Snapshot */}
                <div className="rounded-[22px] bg-white p-5 border border-black/[0.06] shadow-xs">
                  <div className="flex items-center gap-3.5 border-b border-black/[0.06] pb-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0A0A0B] text-[17px] font-bold text-white">
                      {activeCustomer.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[16px] font-bold text-[#0A0A0B]">
                          {activeCustomer.name}
                        </p>
                        <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-semibold text-[#047857]">
                          {activeCustomer.status}
                        </span>
                      </div>
                      <p className="tabular text-[12.5px] text-[#71717A]">
                        {activeCustomer.phone}
                      </p>
                    </div>
                  </div>

                  {/* 3 Metrics Box */}
                  <div className="mt-4 grid grid-cols-3 divide-x divide-black/[0.06] rounded-2xl bg-[#FAFAFA] py-3 text-center">
                    <div>
                      <p className="tabular text-[17px] font-bold text-[#0A0A0B]">
                        {activeCustomer.visits}
                      </p>
                      <p className="text-[11.5px] text-[#71717A]">visits</p>
                    </div>
                    <div>
                      <p className="tabular text-[17px] font-bold text-[#0A0A0B]">
                        ₹{activeCustomer.totalSpent.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11.5px] text-[#71717A]">spent</p>
                    </div>
                    <div>
                      <p className="tabular text-[17px] font-bold text-[#0A0A0B]">
                        Every {activeCustomer.usualGapDays}d
                      </p>
                      <p className="text-[11.5px] text-[#71717A]">usually</p>
                    </div>
                  </div>

                  {/* Quick Info Rows */}
                  <div className="mt-4 space-y-2.5 text-[13px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717A] flex items-center gap-2">
                        <IconClock className="h-4 w-4 text-[#A1A1AA]" />
                        Last visit
                      </span>
                      <span
                        className={`tabular font-semibold ${
                          activeCustomer.isOverdue ? "text-[#DC2626]" : "text-[#0A0A0B]"
                        }`}
                      >
                        {activeCustomer.lastVisitDaysAgo === 0
                          ? "Today"
                          : `${activeCustomer.lastVisitDaysAgo} days ago`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#71717A] flex items-center gap-2">
                        <IconCoffee className="h-4 w-4 text-[#A1A1AA]" />
                        Favorite item
                      </span>
                      <span className="font-semibold text-[#0A0A0B]">
                        {activeCustomer.favoriteItem}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#71717A] flex items-center gap-2">
                        <IconRupee className="h-4 w-4 text-[#A1A1AA]" />
                        Available reward
                      </span>
                      <span className="tabular font-semibold text-[#047857]">
                        ₹{activeCustomer.availableReward}
                      </span>
                    </div>
                  </div>

                  {/* Overdue Alert */}
                  {activeCustomer.isOverdue && (
                    <div className="mt-4 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] p-3 text-[12.5px] text-[#991B1B]">
                      <p className="font-semibold">He&apos;s past his usual visit interval.</p>
                      <p className="text-[12px] opacity-90 mt-0.5">
                        A good time to apply a reward and encourage him to visit again.
                      </p>
                    </div>
                  )}
                </div>

                {/* Reward Card */}
                {activeCustomer.availableReward > 0 && (
                  <div className="rounded-[22px] bg-[#ECFDF5] border border-[#A7F3D0] p-5 shadow-xs">
                    <div className="flex items-center gap-2.5 text-[#047857]">
                      <IconGift className="h-5 w-5" />
                      <span className="text-[15px] font-bold">
                        ₹{activeCustomer.availableReward} reward available
                      </span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-[#065F46] leading-relaxed">
                      Apply reward in your POS now. The discount will be reflected on the bill.
                    </p>

                    <button
                      onClick={() => setIsRewardApplied(!isRewardApplied)}
                      className={`mt-4 w-full rounded-xl py-2.5 text-[13.5px] font-bold transition-all cursor-pointer ${
                        isRewardApplied
                          ? "bg-[#047857] text-white"
                          : "bg-white text-[#047857] border border-[#047857]/30 hover:bg-[#047857] hover:text-white"
                      }`}
                    >
                      {isRewardApplied
                        ? `✓ Applied (₹${activeCustomer.availableReward} OFF)`
                        : `Apply ₹${activeCustomer.availableReward} reward`}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Customer History */}
              <div className="space-y-5">
                <div className="rounded-[22px] bg-white p-5 border border-black/[0.06] shadow-xs">
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                    <span className="text-[14px] font-bold text-[#0A0A0B]">Customer history</span>
                    <span className="text-[12px] font-medium text-[#71717A]">
                      {activeCustomer.history.length} visits
                    </span>
                  </div>

                  {/* History Timeline */}
                  <div className="mt-3 divide-y divide-black/[0.04]">
                    {activeCustomer.history.map((hist) => (
                      <div
                        key={hist.id}
                        className={`flex items-center justify-between py-3 text-[13px] ${
                          hist.isToday ? "bg-[#ECFDF5]/50 -mx-2 px-2 rounded-lg" : ""
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-[#0A0A0B]">{hist.items}</p>
                          <p className="text-[11.5px] text-[#71717A] flex items-center gap-1">
                            <IconClock className="h-3 w-3 text-[#A1A1AA]" />
                            {hist.timeAgo}
                          </p>
                        </div>
                        <span className="tabular font-bold text-[#0A0A0B]">₹{hist.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BRING THEM BACK (OWNER COPILOT)                                     */}
        {/* ========================================================================= */}
        {activeTab === "retention" && (
          <div className="space-y-6">
            {/* Context Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
              <div>
                <h1 className="text-[22px] sm:text-[24px] font-bold tracking-tight text-[#0A0A0B]">
                  Customers to bring back.
                </h1>
                <p className="text-[14px] text-[#71717A]">
                  These regulars haven&apos;t visited in a while. Send them a personal note directly from WhatsApp.
                </p>
              </div>

              {/* Simulation Callout */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateReturn}
                  className="rounded-xl bg-[#0A0A0B] px-4 py-2 text-[12.5px] font-bold text-white hover:bg-black/80 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                  title="Simulate Rahul walking into the café 2 days later and ordering"
                >
                  <span>⚡ Simulate Rahul&apos;s Return</span>
                </button>
              </div>
            </div>

            {/* Return Success Banner */}
            {returnSuccessMessage && (
              <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 text-[14px] font-semibold text-[#047857] flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <IconCheck className="h-5 w-5 shrink-0" />
                  <span>{returnSuccessMessage}</span>
                </div>
                <button
                  onClick={() => setActiveTab("counter")}
                  className="rounded-lg bg-[#047857] px-3 py-1 text-[12px] font-bold text-white hover:bg-[#065F46] transition-colors"
                >
                  View Counter Log →
                </button>
              </div>
            )}

            {/* Main Split View */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              {/* Left 7 Cols: Overdue Customers Table */}
              <div className="lg:col-span-7 rounded-[22px] bg-white border border-black/[0.06] shadow-xs overflow-hidden">
                <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
                  <span className="text-[14px] font-bold text-[#0A0A0B]">
                    Overdue regulars ({customers.filter((c) => c.isOverdue).length})
                  </span>
                  <span className="text-[12px] text-[#71717A]">Sorted by visit gap</span>
                </div>

                <div className="divide-y divide-black/[0.04]">
                  {customers.map((c) => {
                    const isSelected = c.id === activeRetentionCustomer.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleSelectRetentionCustomer(c)}
                        className={`flex items-center justify-between p-4 sm:px-5 transition-colors cursor-pointer ${
                          isSelected ? "bg-[#F4F4F5]" : "hover:bg-[#FAFAFA]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${
                              isSelected
                                ? "bg-[#0A0A0B] text-white"
                                : "bg-[#FAFAFA] text-[#0A0A0B] border border-black/[0.08]"
                            }`}
                          >
                            {c.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[14.5px] font-bold text-[#0A0A0B] truncate">
                                {c.name}
                              </p>
                              {c.returned && (
                                <span className="rounded-md bg-[#ECFDF5] px-1.5 py-0.5 text-[10px] font-bold text-[#047857]">
                                  Returned
                                </span>
                              )}
                            </div>
                            <p className="tabular text-[12px] text-[#71717A]">{c.phone}</p>
                          </div>
                        </div>

                        <div className="hidden sm:block text-right text-[12.5px]">
                          <p className="text-[#71717A]">Every {c.usualGapDays} days</p>
                          <p className="text-[11px] text-[#A1A1AA]">usually visits</p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`tabular inline-block rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${
                              c.isOverdue
                                ? "bg-[#FEF2F2] text-[#DC2626]"
                                : "bg-[#ECFDF5] text-[#047857]"
                            }`}
                          >
                            {c.lastVisitDaysAgo === 0
                              ? "Today"
                              : `${c.lastVisitDaysAgo} days ago`}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectRetentionCustomer(c);
                          }}
                          className={`hidden sm:inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all ${
                            isSelected
                              ? "bg-[#0A0A0B] text-white"
                              : "border border-black/[0.1] text-[#0A0A0B] hover:bg-black/5"
                          }`}
                        >
                          <span>Select</span>
                          <IconArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 5 Cols: WhatsApp Message Composer */}
              <div className="lg:col-span-5 space-y-5">
                {/* Customer Details Pill */}
                <div className="rounded-[22px] bg-white p-5 border border-black/[0.06] shadow-xs">
                  <div className="flex items-center gap-3 border-b border-black/[0.06] pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A0A0B] text-white font-bold text-[14px]">
                      {activeRetentionCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#0A0A0B]">
                        {activeRetentionCustomer.name}
                      </p>
                      <p className="tabular text-[12px] text-[#71717A]">
                        {activeRetentionCustomer.phone}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[12px] bg-[#FAFAFA] rounded-xl p-2.5">
                    <div>
                      <p className="tabular font-bold text-[#0A0A0B]">
                        {activeRetentionCustomer.visits}
                      </p>
                      <p className="text-[#71717A] text-[11px]">visits</p>
                    </div>
                    <div>
                      <p className="tabular font-bold text-[#0A0A0B]">
                        ₹{activeRetentionCustomer.totalSpent}
                      </p>
                      <p className="text-[#71717A] text-[11px]">spent</p>
                    </div>
                    <div>
                      <p className="tabular font-bold text-[#0A0A0B]">
                        Every {activeRetentionCustomer.usualGapDays}d
                      </p>
                      <p className="text-[#71717A] text-[11px]">visit cycle</p>
                    </div>
                  </div>

                  {/* WhatsApp Message Draft Box */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-[#0A0A0B]">
                        Personalized message
                      </span>
                      <span className="text-[11.5px] text-[#71717A] flex items-center gap-1">
                        <IconWhatsApp className="h-3 w-3 text-[#16A34A]" />
                        Ready to send
                      </span>
                    </div>

                    <textarea
                      rows={6}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full rounded-xl border border-black/[0.08] bg-[#FAFAFA] p-3 text-[13.5px] font-medium text-[#0A0A0B] focus:border-[#0A0A0B] focus:bg-white focus:outline-none transition-colors leading-relaxed"
                    />

                    {/* Quick Tone Buttons */}
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() =>
                          setCustomMessage(
                            `Hi ${activeRetentionCustomer.name.split(" ")[0]},\n\nYour usual ${activeRetentionCustomer.favoriteItem} is waiting! Here's ₹100 off when you drop by before Sunday.`
                          )
                        }
                        className="rounded-md bg-[#FAFAFA] border border-black/[0.06] px-2 py-1 text-[11px] font-medium text-[#71717A] hover:text-[#0A0A0B] transition-colors"
                      >
                        Shorter
                      </button>
                      <button
                        onClick={() =>
                          setCustomMessage(
                            `Hey ${activeRetentionCustomer.name.split(" ")[0]} 👋 We've saved ₹100 off your favorite ${activeRetentionCustomer.favoriteItem} this weekend at The Daily Brew. Hope to see you soon!`
                          )
                        }
                        className="rounded-md bg-[#FAFAFA] border border-black/[0.06] px-2 py-1 text-[11px] font-medium text-[#71717A] hover:text-[#0A0A0B] transition-colors"
                      >
                        Warm greeting
                      </button>
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={handleOpenWhatsApp}
                      className="mt-4 w-full rounded-xl bg-[#16A34A] py-3 text-[14px] font-bold text-white hover:bg-[#15803D] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <IconWhatsApp className="h-4 w-4" />
                      <span>Send on WhatsApp</span>
                    </button>

                    <p className="mt-2 text-center text-[11.5px] text-[#A1A1AA]">
                      Opens WhatsApp chat with {activeRetentionCustomer.phone}
                    </p>
                  </div>
                </div>

                {/* Simulate Customer Return Box */}
                <div className="rounded-[22px] bg-white p-5 border border-black/[0.06] shadow-xs">
                  <p className="text-[13px] font-bold text-[#0A0A0B]">Test the return loop</p>
                  <p className="text-[12px] text-[#71717A] mt-1 leading-relaxed">
                    Show the café owner what happens after sending the message. Click below to simulate Rahul returning and spending ₹420.
                  </p>

                  <button
                    onClick={handleSimulateReturn}
                    className="mt-3 w-full rounded-xl border border-black/[0.1] bg-[#FAFAFA] py-2.5 text-[13px] font-bold text-[#0A0A0B] hover:bg-black hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>⚡ Simulate Customer Return</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
