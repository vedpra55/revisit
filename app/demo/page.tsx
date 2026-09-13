"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  IconLogo,
  IconGift,
  IconCheck,
  IconWhatsApp,
  IconCamera,
  IconTrendingUp,
  IconSettings,
  IconStore,
  IconSearch,
} from "../components/Icons";
import { Customer, OfferRule, TriggerType, CafeSettings } from "./types";
import { INITIAL_CUSTOMERS, INITIAL_OFFER_RULES, DEFAULT_CAFE_SETTINGS } from "./mockData";

type DemoTab = "counter" | "outreach" | "rules" | "metrics" | "settings";
type OutreachMode = "dead_hours" | "google_review" | "win_back";

// Minimalist iOS/Linear-style toggle switch
function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label || "Toggle"}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#0A0A0B]" : "bg-zinc-200"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function formatTime12h(timeStr: string): string {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) || 0;
  if (isNaN(h)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

function cleanDigits(val: string): string {
  return val.replace(/\D/g, "").slice(-10);
}

function formatPhoneDisplay(digits: string): string {
  if (!digits) return "";
  if (digits.length <= 5) return `+91 ${digits}`;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
}

export default function DemoPage() {
  // Navigation tabs
  const [activeNav, setActiveNav] = useState<DemoTab>("counter");

  // Global demo state
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [offerRules, setOfferRules] = useState<OfferRule[]>(INITIAL_OFFER_RULES);
  const [settings, setSettings] = useState<CafeSettings>(DEFAULT_CAFE_SETTINGS);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState<boolean>(false);

  // Counter flow state
  const [phoneDigits, setPhoneDigits] = useState<string>("9876543210");
  const [isRewardAppliedInPos, setIsRewardAppliedInPos] = useState<boolean>(true);
  const [isScanningBill, setIsScanningBill] = useState<boolean>(false);
  const [scannedBillAmount, setScannedBillAmount] = useState<number | null>(null);
  const [visitLoggedNotice, setVisitLoggedNotice] = useState<boolean>(false);

  // Offer rule creation state
  const [isAddingRule, setIsAddingRule] = useState<boolean>(false);
  const [newRuleName, setNewRuleName] = useState<string>("Weekend Sweet Tooth");
  const [newRuleTrigger, setNewRuleTrigger] = useState<TriggerType>("visits_milestone");
  const [newRuleValue, setNewRuleValue] = useState<number>(3);
  const [newRuleReward, setNewRuleReward] = useState<number>(75);

  // Outreach message mode state
  const [outreachMode, setOutreachMode] = useState<OutreachMode>("dead_hours");
  const [selectedOutreachCustomer, setSelectedOutreachCustomer] = useState<Customer>(INITIAL_CUSTOMERS[0]);
  const [returnedNotice, setReturnedNotice] = useState<string | null>(null);

  // Directory search
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Matched customer for counter
  const matchedCustomer = useMemo(() => {
    if (phoneDigits.length < 10) return null;
    return customers.find((c) => cleanDigits(c.phone) === phoneDigits) || null;
  }, [phoneDigits, customers]);

  // Keypad press handler
  const handleKeypadPress = (val: string) => {
    if (val === "C") {
      setPhoneDigits("");
      setScannedBillAmount(null);
      setVisitLoggedNotice(false);
      return;
    }
    if (val === "⌫") {
      setPhoneDigits((prev) => prev.slice(0, -1));
      setVisitLoggedNotice(false);
      return;
    }
    if (phoneDigits.length < 10) {
      setPhoneDigits((prev) => prev + val);
      setVisitLoggedNotice(false);
    }
  };

  // Bill scan simulation
  const handleScanBill = () => {
    setIsScanningBill(true);
    setTimeout(() => {
      setIsScanningBill(false);
      setScannedBillAmount(380);
    }, 1100);
  };

  // Complete visit
  const handleCompleteVisit = () => {
    if (!matchedCustomer) return;
    const finalAmount = Math.max(0, (scannedBillAmount || 380) - (isRewardAppliedInPos ? matchedCustomer.availableReward : 0));
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === matchedCustomer.id
          ? {
              ...c,
              visits: c.visits + 1,
              totalSpent: c.totalSpent + finalAmount,
              lastVisitDaysAgo: 0,
              isOverdue: false,
              availableReward: 0,
            }
          : c
      )
    );
    setVisitLoggedNotice(true);
  };

  // Reset counter for next guest
  const handleResetCounter = () => {
    setPhoneDigits("");
    setScannedBillAmount(null);
    setVisitLoggedNotice(false);
  };

  // Toggle offer rule
  const handleToggleRule = (ruleId: string) => {
    setOfferRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  // Save new offer rule
  const handleSaveNewRule = () => {
    if (!newRuleName.trim()) return;
    const newRule: OfferRule = {
      id: "r_" + Date.now(),
      name: newRuleName,
      triggerType: newRuleTrigger,
      triggerValue: newRuleValue,
      rewardType: "flat_discount",
      rewardValue: newRuleReward,
      minBill: 200,
      expiryDays: 14,
      isActive: true,
      description: `₹${newRuleReward} discount triggered at ${newRuleValue} ${newRuleTrigger.replace("_", " ")}`,
    };
    setOfferRules((prev) => [newRule, ...prev]);
    setIsAddingRule(false);
    setNewRuleName("");
  };

  // Save settings
  const handleSaveSettings = () => {
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 2400);
  };

  // Generate WhatsApp text based on mode
  const currentWhatsAppMessage = useMemo(() => {
    if (!selectedOutreachCustomer) return "";
    const name = selectedOutreachCustomer.name.split(" ")[0];
    const fav = selectedOutreachCustomer.favoriteItem;

    if (outreachMode === "dead_hours") {
      const days = settings.deadHoursDays || "Tue – Thu";
      const times = `${formatTime12h(settings.deadHoursStartTime)} - ${formatTime12h(settings.deadHoursEndTime)}`;
      return `Hey ${name}! Slow afternoons are made for coffee. Stop by The Daily Brew (${days}, ${times}) for 20% off your ${fav}. Just mention this text at the counter! ☕`;
    }
    if (outreachMode === "google_review") {
      return `Hi ${name}, thank you for making The Daily Brew your regular spot! If you have 30 seconds, could you share a quick 5-star rating on Google? It means the world to our team: ${settings.googleMapsReviewUrl}`;
    }
    return `Hey ${name}! We haven't seen you in a couple of weeks and your usual ${fav} is waiting. Here is ₹${selectedOutreachCustomer.availableReward || 75} off your next order this week. Hope to see you soon!`;
  }, [outreachMode, selectedOutreachCustomer, settings]);

  // Simulate customer return
  const handleSimulateReturn = (customer: Customer) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customer.id
          ? {
              ...c,
              visits: c.visits + 1,
              totalSpent: c.totalSpent + 420,
              lastVisitDaysAgo: 0,
              isOverdue: false,
              returned: true,
            }
          : c
      )
    );
    setReturnedNotice(`${customer.name} just returned! Recovered bill: ₹420`);
    setTimeout(() => setReturnedNotice(null), 3000);
  };

  // Filtered customer directory
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.favoriteItem.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 antialiased flex flex-col font-sans pb-24 sm:pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <IconLogo className="w-7 h-7 text-zinc-900 group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-semibold tracking-tight text-base text-zinc-900 block leading-tight">Revisit</span>
              <span className="text-[11px] text-zinc-400 font-medium tracking-wide">The Daily Brew • Indiranagar</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden sm:flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
          {(
            [
              { id: "counter", label: "Counter Terminal", icon: IconStore },
              { id: "outreach", label: "Bring Them Back", icon: IconWhatsApp },
              { id: "rules", label: "Offer Rules", icon: IconGift },
              { id: "metrics", label: "Impact & Guests", icon: IconTrendingUp },
              { id: "settings", label: "Settings", icon: IconSettings },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeNav === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveNav(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white text-zinc-950 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Header Right Action */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            ← Back to Landing
          </Link>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* =========================================================================
            TAB 1: COUNTER TERMINAL
        ========================================================================= */}
        {activeNav === "counter" && (
          <div className="max-w-xl mx-auto space-y-6">
            {/* Quick Test Picker */}
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-medium">Quick test numbers:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "Rahul (Regular)", digits: "9876543210" },
                  { label: "Simran (VIP)", digits: "9654321098" },
                  { label: "Aman", digits: "8765432109" },
                ].map((sample) => (
                  <button
                    key={sample.digits}
                    onClick={() => {
                      setPhoneDigits(sample.digits);
                      setScannedBillAmount(null);
                      setVisitLoggedNotice(false);
                    }}
                    className="px-2.5 py-1 rounded-md bg-white text-zinc-700 hover:text-zinc-950 shadow-xs hover:bg-zinc-50 transition font-mono text-[11px]"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Numeric Display Hero */}
            <div className="bg-white rounded-2xl p-6 text-center shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Customer Mobile</span>
              <div className="text-3xl sm:text-4xl font-mono font-semibold text-zinc-900 mt-1.5 min-h-[48px] flex items-center justify-center tracking-tight">
                {phoneDigits ? formatPhoneDisplay(phoneDigits) : <span className="text-zinc-300">98765 00000</span>}
              </div>
              <p className="text-xs text-zinc-400 mt-1">Tap 10-digit number to instantly pull customer rewards</p>
            </div>

            {/* Matched Customer Card or Keypad */}
            {matchedCustomer && !visitLoggedNotice ? (
              <div className="bg-white rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in zoom-in-95 duration-200">
                {/* Guest Profile Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 text-white font-semibold flex items-center justify-center text-lg">
                      {matchedCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-zinc-900">{matchedCustomer.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-700">
                          {matchedCustomer.visits} visits
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">Favorite: {matchedCustomer.favoriteItem} • Since {matchedCustomer.customerSince}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetCounter}
                    className="text-xs text-zinc-400 hover:text-zinc-700 font-medium px-2 py-1 rounded-md hover:bg-zinc-100 transition"
                  >
                    Change
                  </button>
                </div>

                {/* Unlocked Reward Row */}
                <div className="bg-zinc-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      ₹
                    </div>
                    <div>
                      <div className="font-medium text-sm text-zinc-900">
                        ₹{matchedCustomer.availableReward} Available Loyalty Reward
                      </div>
                      <div className="text-xs text-zinc-500">Ready to redeem on current bill</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600 font-medium hidden sm:inline">Apply in POS</span>
                    <Toggle checked={isRewardAppliedInPos} onChange={setIsRewardAppliedInPos} />
                  </div>
                </div>

                {/* Receipt OCR Capture */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-zinc-500">
                    Bill Amount:{" "}
                    <span className="font-semibold text-zinc-900 text-sm">
                      {scannedBillAmount ? `₹${scannedBillAmount}` : "₹380 (Table 4)"}
                    </span>
                    {isRewardAppliedInPos && (
                      <span className="text-emerald-600 ml-1.5 font-medium">
                        (₹{matchedCustomer.availableReward} off applied → Pay ₹{Math.max(0, (scannedBillAmount || 380) - matchedCustomer.availableReward)})
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleScanBill}
                    disabled={isScanningBill}
                    className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200/70 transition"
                  >
                    <IconCamera className="w-3.5 h-3.5" />
                    {isScanningBill ? "Scanning receipt..." : "Scan Slip OCR"}
                  </button>
                </div>

                {/* Laser scan animation when active */}
                {isScanningBill && (
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-zinc-900 h-full w-1/2 animate-pulse rounded-full" />
                  </div>
                )}

                {/* Complete Visit Button */}
                <button
                  onClick={handleCompleteVisit}
                  className="w-full py-3.5 rounded-xl bg-[#0A0A0B] text-white font-medium text-sm hover:bg-zinc-800 transition active:scale-[0.99] flex items-center justify-center gap-2 shadow-xs"
                >
                  <IconCheck className="w-4 h-4" />
                  Complete Visit (₹{Math.max(0, (scannedBillAmount || 380) - (isRewardAppliedInPos ? matchedCustomer.availableReward : 0))})
                </button>
              </div>
            ) : visitLoggedNotice ? (
              /* Success Confirmation */
              <div className="bg-white rounded-2xl p-8 text-center shadow-xs space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <IconCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">Visit Logged Successfully</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Loyalty points recorded & automated WhatsApp receipt sent to {phoneDigits ? formatPhoneDisplay(phoneDigits) : "customer"}.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleResetCounter}
                    className="w-full py-3 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition active:scale-95"
                  >
                    Next Customer
                  </button>
                </div>
              </div>
            ) : (
              /* Tactile Touch Keypad */
              <div className="grid grid-cols-3 gap-2.5">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleKeypadPress(key)}
                    className="h-14 sm:h-16 rounded-2xl bg-white text-xl font-medium text-zinc-900 shadow-xs active:scale-95 transition-all hover:bg-zinc-50 flex items-center justify-center select-none"
                  >
                    {key}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: BRING THEM BACK (OUTREACH)
        ========================================================================= */}
        {activeNav === "outreach" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Automated Outreach</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Send targeted perks directly to regulars without paying ad agencies or Meta campaign fees.
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
                {(
                  [
                    { id: "dead_hours", label: "Dead Hours" },
                    { id: "google_review", label: "5★ Reviews" },
                    { id: "win_back", label: "Win-Back" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setOutreachMode(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      outreachMode === m.id
                        ? "bg-white text-zinc-900 shadow-xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Overdue Notification Banner */}
            {returnedNotice && (
              <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
                <span className="font-medium">{returnedNotice}</span>
                <IconCheck className="w-4 h-4 text-emerald-600" />
              </div>
            )}

            {/* Two Column Outreach Canvas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Left Column: Overdue Regulars List */}
              <div className="md:col-span-2 space-y-2.5">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Eligible Regulars</span>
                {customers.map((c) => {
                  const isSelected = selectedOutreachCustomer?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedOutreachCustomer(c)}
                      className={`p-4 rounded-xl cursor-pointer transition shadow-xs flex items-center justify-between ${
                        isSelected ? "bg-white ring-2 ring-zinc-950" : "bg-white hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-800 font-medium flex items-center justify-center text-sm">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-zinc-900">{c.name}</div>
                          <div className="text-xs text-zinc-400">
                            Last seen: {c.lastVisitDaysAgo}d ago • Gap: {c.usualGapDays}d
                          </div>
                        </div>
                      </div>
                      {c.isOverdue && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700">
                          Overdue
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Column: WhatsApp Composer Preview */}
              <div className="md:col-span-3 bg-white rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                      <IconWhatsApp className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-semibold text-zinc-900">WhatsApp Direct Note</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">{selectedOutreachCustomer?.phone}</span>
                  </div>

                  {/* WhatsApp Bubble Preview */}
                  <div className="bg-[#EFEAE2] p-4 rounded-xl space-y-2">
                    <div className="bg-white rounded-lg p-3 text-xs text-zinc-800 shadow-xs max-w-sm ml-auto leading-relaxed">
                      {currentWhatsAppMessage}
                      <div className="text-[9px] text-zinc-400 text-right mt-1.5 flex items-center justify-end gap-1">
                        <span>14:32</span>
                        <span className="text-sky-600">✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/${cleanDigits(selectedOutreachCustomer.phone)}?text=${encodeURIComponent(
                      currentWhatsAppMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition text-center flex items-center justify-center gap-2 shadow-xs"
                  >
                    <IconWhatsApp className="w-4 h-4" />
                    Open in WhatsApp
                  </a>

                  <button
                    onClick={() => handleSimulateReturn(selectedOutreachCustomer)}
                    className="px-4 py-3 rounded-xl bg-zinc-100 text-zinc-800 font-medium text-xs hover:bg-zinc-200 transition"
                  >
                    Simulate Return (₹420)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: OFFER RULES
        ========================================================================= */}
        {activeNav === "rules" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Reward & Retention Rules</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Automate perks without manual discounts or coupons</p>
              </div>
              <button
                onClick={() => setIsAddingRule(!isAddingRule)}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition"
              >
                {isAddingRule ? "Cancel" : "+ New Rule"}
              </button>
            </div>

            {/* New Rule Creator */}
            {isAddingRule && (
              <div className="bg-white rounded-2xl p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
                <h3 className="font-semibold text-sm text-zinc-900">Configure Loyalty Trigger</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Rule Name</label>
                    <input
                      type="text"
                      value={newRuleName}
                      onChange={(e) => setNewRuleName(e.target.value)}
                      placeholder="e.g. 5th Visit Celebration"
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Trigger Condition</label>
                    <select
                      value={newRuleTrigger}
                      onChange={(e) => setNewRuleTrigger(e.target.value as TriggerType)}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    >
                      <option value="visits_milestone">Visit Milestone</option>
                      <option value="days_overdue">Days Inactive</option>
                      <option value="total_spend">Total Spend (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Trigger Threshold</label>
                    <input
                      type="number"
                      value={newRuleValue}
                      onChange={(e) => setNewRuleValue(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Flat Discount (₹)</label>
                    <input
                      type="number"
                      value={newRuleReward}
                      onChange={(e) => setNewRuleReward(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveNewRule}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition"
                >
                  Save Rule
                </button>
              </div>
            )}

            {/* Rules List */}
            <div className="space-y-3">
              {offerRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4 transition hover:bg-zinc-50/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm text-zinc-900">{rule.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-600">
                        {rule.triggerType === "visits_milestone" && `Visit #${rule.triggerValue}`}
                        {rule.triggerType === "days_overdue" && `>${rule.triggerValue}d gap`}
                        {rule.triggerType === "total_spend" && `Spend >₹${rule.triggerValue}`}
                        {rule.triggerType === "inactivity" && `Inactive ${rule.triggerValue}d`}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">{rule.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-zinc-900 font-mono">
                      {rule.rewardType === "percent_discount" ? `${rule.rewardValue}%` : `₹${rule.rewardValue}`} OFF
                    </span>
                    <Toggle checked={rule.isActive} onChange={() => handleToggleRule(rule.id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: METRICS & GUEST DIRECTORY
        ========================================================================= */}
        {activeNav === "metrics" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Business Impact & Guests</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Live recovery metrics and verified customer profiles</p>
            </div>

            {/* 3 Clean Key Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Recovered Revenue</span>
                <div className="text-2xl font-bold font-mono text-zinc-900 mt-1">₹24,800</div>
                <div className="text-xs text-emerald-600 font-medium mt-1">6.0x return on rewards</div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Repeat Visit Lift</span>
                <div className="text-2xl font-bold font-mono text-zinc-900 mt-1">38.4%</div>
                <div className="text-xs text-emerald-600 font-medium mt-1">+14% vs conventional cafes</div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">WhatsApp Opt-in</span>
                <div className="text-2xl font-bold font-mono text-zinc-900 mt-1">94.2%</div>
                <div className="text-xs text-zinc-400 font-medium mt-1">Direct guest relationships</div>
              </div>
            </div>

            {/* Guest Directory */}
            <div className="bg-white rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-sm text-zinc-900">Verified Regulars ({filteredCustomers.length})</h3>
                <div className="relative w-48 sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name or phone..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                  <IconSearch className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2" />
                </div>
              </div>

              <div className="divide-y divide-zinc-100">
                {filteredCustomers.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 font-medium flex items-center justify-center text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-zinc-900">{c.name}</div>
                        <div className="text-[11px] text-zinc-400">{c.phone} • {c.favoriteItem}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-medium text-zinc-900 font-mono">₹{c.totalSpent}</div>
                        <div className="text-[11px] text-zinc-400">{c.visits} visits</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        c.status === "VIP customer"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-zinc-100 text-zinc-700"
                      }`}>
                        {c.status.replace(" customer", "")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: SETTINGS
        ========================================================================= */}
        {activeNav === "settings" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Cafe Automation Settings</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Automated schedules, Google Maps ratings, and POS integration</p>
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition active:scale-95 shadow-xs"
              >
                Save Settings
              </button>
            </div>

            {settingsSavedNotice && (
              <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
                <span className="font-medium">Settings saved and synchronized with counter terminals!</span>
                <IconCheck className="w-4 h-4 text-emerald-600" />
              </div>
            )}

            {/* Group 1: Dead Hours Yield */}
            <div className="bg-white rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900">Dead Hours Yield</h3>
                  <p className="text-xs text-zinc-400">Fill empty tables during slow weekday afternoons</p>
                </div>
                <Toggle
                  checked={settings.deadHoursEnabled}
                  onChange={(val) => setSettings({ ...settings, deadHoursEnabled: val })}
                />
              </div>

              {settings.deadHoursEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 animate-in fade-in duration-150">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Target Days</label>
                    <select
                      value={settings.deadHoursDays}
                      onChange={(e) => setSettings({ ...settings, deadHoursDays: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    >
                      <option value="Tuesday – Thursday">Tue – Thu</option>
                      <option value="Monday – Thursday">Mon – Thu</option>
                      <option value="Monday – Friday">Mon – Fri</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Start Time</label>
                    <input
                      type="time"
                      value={settings.deadHoursStartTime}
                      onChange={(e) => setSettings({ ...settings, deadHoursStartTime: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">End Time</label>
                    <input
                      type="time"
                      value={settings.deadHoursEndTime}
                      onChange={(e) => setSettings({ ...settings, deadHoursEndTime: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
                    />
                  </div>
                </div>
              )}
              <p className="text-[11px] text-zinc-400 pt-1">
                Invites nearby regulars with 20% off perks only during your slowest weekly hours.
              </p>
            </div>

            {/* Group 2: Google Maps Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900">Google Maps 5★ Reviews</h3>
                  <p className="text-xs text-zinc-400">Collect verified high-rating reviews automatically</p>
                </div>
                <Toggle
                  checked={Boolean(settings.googleMapsReviewUrl)}
                  onChange={(val) =>
                    setSettings({
                      ...settings,
                      googleMapsReviewUrl: val ? "https://g.page/r/the-daily-brew-indiranagar/review" : "",
                    })
                  }
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Google Maps Review URL</label>
                <input
                  type="url"
                  value={settings.googleMapsReviewUrl}
                  onChange={(e) => setSettings({ ...settings, googleMapsReviewUrl: e.target.value })}
                  placeholder="https://g.page/r/..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
                />
              </div>
              <p className="text-[11px] text-zinc-400 pt-1">
                Prompts customers on their 3rd visit to rate your cafe, keeping your Google ranking #1.
              </p>
            </div>

            {/* Group 3: Counter POS Bridge */}
            <div className="bg-white rounded-2xl p-6 shadow-xs space-y-3">
              <div>
                <h3 className="font-semibold text-sm text-zinc-900">Counter POS Integration</h3>
                <p className="text-xs text-zinc-400">Zero tech overhead for cashiers</p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-zinc-900">Receipt Camera OCR</div>
                  <div className="text-[11px] text-zinc-500">Scan any thermal bill slip to log totals in 1 second</div>
                </div>
                <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 pt-1">
                Works alongside Petpooja, POSist, DotPe, or simple paper registers without software plugins.
              </p>
            </div>

            {/* Group 4: WhatsApp Guardrails */}
            <div className="bg-white rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900">Anti-Spam Guardrails</h3>
                  <p className="text-xs text-zinc-400">Keep customer trust high and unsubscribe rates under 1%</p>
                </div>
                <Toggle checked={true} onChange={() => {}} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-zinc-50 rounded-xl">
                  <div className="font-medium text-zinc-900">Quiet Hours</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">No messages 9:30 PM - 9:00 AM</div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl">
                  <div className="font-medium text-zinc-900">Cooldown Gap</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Min 7 days between messages</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MOBILE BOTTOM NAVIGATION DOCK
      ========================================================================= */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md px-3 py-2 flex justify-around items-center shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        {(
          [
            { id: "counter", label: "Counter", icon: IconStore },
            { id: "outreach", label: "Outreach", icon: IconWhatsApp },
            { id: "rules", label: "Rules", icon: IconGift },
            { id: "metrics", label: "Guests", icon: IconTrendingUp },
            { id: "settings", label: "Settings", icon: IconSettings },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeNav === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveNav(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
                isActive ? "text-zinc-950 font-semibold" : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
