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
type CounterStep = 1 | 2 | 3 | 4;

// Pure minimalist flat toggle switch
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
        checked ? "bg-zinc-950" : "bg-zinc-200"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out mt-0.5 ${
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

  // Counter Multi-Step Flow State: 1 (Phone) -> 2 (Reward & Profile) -> 3 (Bill Capture) -> 4 (Success)
  const [counterStep, setCounterStep] = useState<CounterStep>(1);
  const [phoneDigits, setPhoneDigits] = useState<string>("9876543210");
  const [newGuestName, setNewGuestName] = useState<string>("");
  const [isRewardAppliedInPos, setIsRewardAppliedInPos] = useState<boolean>(true);
  const [billAmount, setBillAmount] = useState<number>(380);
  const [isScanningBill, setIsScanningBill] = useState<boolean>(false);
  const [billScannedNotice, setBillScannedNotice] = useState<boolean>(false);

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

  // Customer resolution for counter: matched existing OR newly synthesized customer
  const currentCounterCustomer = useMemo<Customer>(() => {
    const matched = customers.find((c) => cleanDigits(c.phone) === phoneDigits);
    if (matched) return matched;

    // First-time guest fallback (handles any 10-digit number like 82366 99885)
    return {
      id: "guest_" + phoneDigits,
      name: newGuestName.trim() || "New Guest",
      phone: formatPhoneDisplay(phoneDigits) || "+91 " + phoneDigits,
      status: "New customer",
      visits: 0,
      totalSpent: 0,
      usualGapDays: 0,
      lastVisitDaysAgo: 0,
      favoriteItem: "Cold Brew",
      customerSince: "First Visit Today",
      availableReward: 50,
      isOverdue: false,
      defaultMessage: "Welcome to The Daily Brew! Enjoy ₹50 off on your next visit.",
      history: [],
    };
  }, [phoneDigits, customers, newGuestName]);

  const isExistingCustomer = useMemo(() => {
    return customers.some((c) => cleanDigits(c.phone) === phoneDigits);
  }, [phoneDigits, customers]);

  // Keypad press handler
  const handleKeypadPress = (val: string) => {
    if (val === "C") {
      setPhoneDigits("");
      return;
    }
    if (val === "⌫") {
      setPhoneDigits((prev) => prev.slice(0, -1));
      return;
    }
    if (phoneDigits.length < 10) {
      setPhoneDigits((prev) => prev + val);
    }
  };

  // Bill scan simulation
  const handleScanBill = () => {
    setIsScanningBill(true);
    setTimeout(() => {
      setIsScanningBill(false);
      setBillScannedNotice(true);
      setBillAmount(380);
    }, 1000);
  };

  // Complete visit
  const handleCompleteVisit = () => {
    const finalBill = Math.max(
      0,
      billAmount - (isRewardAppliedInPos && isExistingCustomer ? currentCounterCustomer.availableReward : 0)
    );

    if (isExistingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === currentCounterCustomer.id
            ? {
                ...c,
                visits: c.visits + 1,
                totalSpent: c.totalSpent + finalBill,
                lastVisitDaysAgo: 0,
                isOverdue: false,
                availableReward: 0,
              }
            : c
        )
      );
    } else {
      const newlyCreated: Customer = {
        id: "c_" + Date.now(),
        name: newGuestName.trim() || "Guest (" + phoneDigits.slice(-4) + ")",
        phone: formatPhoneDisplay(phoneDigits),
        status: "New customer",
        visits: 1,
        totalSpent: finalBill,
        usualGapDays: 14,
        lastVisitDaysAgo: 0,
        favoriteItem: "Cold Brew",
        customerSince: "Sep 2026",
        availableReward: 50,
        isOverdue: false,
        defaultMessage: "Thanks for joining us at The Daily Brew! Take ₹50 off your next visit.",
        history: [{ id: "h_" + Date.now(), timeAgo: "Just now", items: "Cold Brew + Snack", amount: finalBill }],
      };
      setCustomers((prev) => [newlyCreated, ...prev]);
    }

    setCounterStep(4);
  };

  // Reset counter for next guest
  const handleResetCounter = () => {
    setPhoneDigits("");
    setNewGuestName("");
    setBillAmount(380);
    setBillScannedNotice(false);
    setIsScanningBill(false);
    setIsRewardAppliedInPos(true);
    setCounterStep(1);
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
    <div className="min-h-screen bg-[#F7F7F7] text-zinc-900 antialiased flex flex-col font-sans pb-24 sm:pb-12 w-full overflow-x-hidden">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <IconLogo className="w-7 h-7 text-zinc-900 group-hover:scale-105 transition-transform shrink-0" />
            <div>
              <span className="font-semibold tracking-tight text-base text-zinc-900 block leading-tight">Revisit</span>
              <span className="text-[11px] text-zinc-400 font-medium tracking-wide">The Daily Brew • Indiranagar</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden sm:flex items-center gap-1 bg-zinc-200/60 p-1 rounded-xl">
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
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? "bg-white text-zinc-950 font-semibold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-white/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Header Right Action */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors whitespace-nowrap"
          >
            ← Back to Landing
          </Link>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 pt-5 sm:pt-8 min-w-0">
        {/* =========================================================================
            TAB 1: COUNTER TERMINAL (1 VIEW PER STEP)
        ========================================================================= */}
        {activeNav === "counter" && (
          <div className="max-w-xl mx-auto space-y-5 sm:space-y-6">
            {/* Step Breadcrumb Header with Horizontal Scroll */}
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 shrink min-w-0">
                {[
                  { step: 1, label: "Phone" },
                  { step: 2, label: "Reward" },
                  { step: 3, label: "Bill Slip" },
                  { step: 4, label: "Done" },
                ].map((s) => {
                  const isCurrent = counterStep === s.step;
                  const isPast = counterStep > s.step;
                  return (
                    <div key={s.step} className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        disabled={!isPast}
                        onClick={() => isPast && s.step < 4 && setCounterStep(s.step as CounterStep)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition shrink-0 ${
                          isCurrent
                            ? "bg-zinc-950 text-white font-semibold"
                            : isPast
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200/80 cursor-pointer"
                            : "bg-zinc-200/60 text-zinc-400 cursor-not-allowed"
                        }`}
                      >
                        {isPast ? <IconCheck className="w-3 h-3" /> : <span>{s.step}</span>}
                        <span>{s.label}</span>
                      </button>
                      {s.step < 4 && <span className="text-zinc-300 text-xs shrink-0">›</span>}
                    </div>
                  );
                })}
              </div>

              {counterStep > 1 && (
                <button
                  type="button"
                  onClick={handleResetCounter}
                  className="text-xs text-zinc-400 hover:text-zinc-800 font-medium px-2.5 py-1 rounded-md hover:bg-zinc-200/60 transition shrink-0 ml-2"
                >
                  Reset
                </button>
              )}
            </div>

            {/* -----------------------------------------------------------------
                STEP 1: PHONE LOOKUP
            ----------------------------------------------------------------- */}
            {counterStep === 1 && (
              <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-150">
                {/* Quick Test Numbers with Horizontal Scroll */}
                <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                  <span className="font-medium shrink-0">Quick samples:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {[
                      { label: "Rahul (Regular)", digits: "9876543210" },
                      { label: "Simran (VIP)", digits: "9654321098" },
                      { label: "New Guest", digits: "8236699885" },
                    ].map((sample) => (
                      <button
                        key={sample.digits}
                        type="button"
                        onClick={() => {
                          setPhoneDigits(sample.digits);
                        }}
                        className="px-2.5 py-1 rounded-md bg-white text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition font-mono text-[11px] shrink-0 whitespace-nowrap"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hero Phone Display */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 text-center space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Customer Mobile</span>
                  <div className="text-3xl sm:text-4xl font-mono font-semibold text-zinc-900 min-h-[52px] flex items-center justify-center tracking-tight">
                    {phoneDigits ? formatPhoneDisplay(phoneDigits) : <span className="text-zinc-300">98765 00000</span>}
                  </div>
                  <p className="text-xs text-zinc-400">
                    {phoneDigits.length === 10
                      ? isExistingCustomer
                        ? "✓ Verified Regular Customer found"
                        : "✨ Unregistered mobile • Will enroll as First-Time Guest"
                      : `Enter 10 digits (${10 - phoneDigits.length} remaining)`}
                  </p>
                </div>

                {/* Tactile Touch Keypad */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleKeypadPress(key)}
                      className="h-14 sm:h-16 rounded-2xl bg-white text-xl font-medium text-zinc-900 active:scale-95 transition-all hover:bg-zinc-100 flex items-center justify-center select-none"
                    >
                      {key}
                    </button>
                  ))}
                </div>

                {/* Continue Action */}
                <button
                  type="button"
                  disabled={phoneDigits.length < 10}
                  onClick={() => setCounterStep(2)}
                  className={`w-full py-4 rounded-2xl font-medium text-sm transition flex items-center justify-center gap-2 ${
                    phoneDigits.length === 10
                      ? "bg-zinc-950 text-white hover:bg-zinc-800 active:scale-[0.99] cursor-pointer"
                      : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  Continue to Rewards →
                </button>
              </div>
            )}

            {/* -----------------------------------------------------------------
                STEP 2: REWARD & RECOGNITION (DEDICATED VIEW)
            ----------------------------------------------------------------- */}
            {counterStep === 2 && (
              <div className="bg-white rounded-2xl p-5 sm:p-7 space-y-5 sm:space-y-6 animate-in fade-in duration-150">
                {/* Back Nav */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCounterStep(1)}
                    className="text-xs font-medium text-zinc-400 hover:text-zinc-800 flex items-center gap-1 transition"
                  >
                    ← Back to Phone ({formatPhoneDisplay(phoneDigits)})
                  </button>
                  <span className="text-[11px] font-mono text-zinc-400">Step 2 of 3</span>
                </div>

                {/* Profile Section */}
                <div className="flex items-start justify-between gap-4 pt-1">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold shrink-0 ${
                      isExistingCustomer
                        ? "bg-zinc-950 text-white"
                        : "bg-amber-100 text-amber-900"
                    }`}>
                      {isExistingCustomer ? currentCounterCustomer.name.charAt(0) : "★"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight truncate">
                          {currentCounterCustomer.name}
                        </h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                          isExistingCustomer
                            ? "bg-zinc-100 text-zinc-800"
                            : "bg-amber-100 text-amber-900"
                        }`}>
                          {isExistingCustomer ? `${currentCounterCustomer.visits} visits` : "First-Time Guest"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 truncate">
                        {isExistingCustomer
                          ? `Favorite: ${currentCounterCustomer.favoriteItem} • Member since ${currentCounterCustomer.customerSince}`
                          : "New customer auto-enrolled on this bill"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Optional Name Input for New Guest */}
                {!isExistingCustomer && (
                  <div className="pt-1">
                    <label className="text-[11px] text-zinc-400 block mb-1 font-medium">Guest Name (Optional)</label>
                    <input
                      type="text"
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                      placeholder="e.g. Vikram"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-100 text-zinc-900 focus:outline-none focus:bg-zinc-200/70"
                    />
                  </div>
                )}

                {/* High-Impact Reward Card (Clean Hierarchy, No Wrapping Issues) */}
                {isExistingCustomer ? (
                  <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800 tracking-wide uppercase shrink-0">
                        Loyalty Milestone
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-medium text-emerald-900">Apply in POS</span>
                        <Toggle checked={isRewardAppliedInPos} onChange={setIsRewardAppliedInPos} />
                      </div>
                    </div>

                    <div className="pt-1">
                      <div className="text-3xl sm:text-4xl font-bold font-mono text-emerald-950 tracking-tight whitespace-nowrap">
                        ₹{currentCounterCustomer.availableReward} OFF
                      </div>
                      <div className="text-xs text-emerald-800 font-medium mt-0.5">
                        Reward discount ready to deduct on this bill
                      </div>
                    </div>

                    <p className="text-xs text-emerald-700/90 leading-relaxed pt-1">
                      {isRewardAppliedInPos
                        ? `Punch ₹${currentCounterCustomer.availableReward} discount on your POS machine before taking payment.`
                        : "Reward saved for customer's next visit."}
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 space-y-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-900 tracking-wide uppercase">
                      Welcome Incentive
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-950 whitespace-nowrap">
                      ₹50 OFF on Visit #2
                    </div>
                    <p className="text-xs text-amber-800/90 leading-relaxed">
                      Guest will automatically receive an instant WhatsApp welcome message with their digital loyalty pass.
                    </p>
                  </div>
                )}

                {/* Proceed Action */}
                <button
                  type="button"
                  onClick={() => setCounterStep(3)}
                  className="w-full py-4 rounded-2xl bg-zinc-950 text-white font-medium text-sm hover:bg-zinc-800 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  Proceed to Bill Capture →
                </button>
              </div>
            )}

            {/* -----------------------------------------------------------------
                STEP 3: BILL CAPTURE & CHECKOUT (DEDICATED VIEW)
            ----------------------------------------------------------------- */}
            {counterStep === 3 && (
              <div className="bg-white rounded-2xl p-5 sm:p-7 space-y-5 sm:space-y-6 animate-in fade-in duration-150">
                {/* Back Nav */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCounterStep(2)}
                    className="text-xs font-medium text-zinc-400 hover:text-zinc-800 flex items-center gap-1 transition"
                  >
                    ← Back to Reward
                  </button>
                  <span className="text-[11px] font-mono text-zinc-400">Step 3 of 3</span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-zinc-900">Capture Bill Total</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Scan paper receipt or choose quick bill amount</p>
                </div>

                {/* Simulated Slip OCR Box */}
                <div className="bg-zinc-100 rounded-2xl p-5 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-white text-zinc-800 mx-auto flex items-center justify-center">
                    <IconCamera className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="font-medium text-xs text-zinc-900">
                      {billScannedNotice ? "✓ Receipt Scanned (Table 4)" : "Receipt OCR Scanner"}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Point counter camera at thermal POS receipt
                    </div>
                  </div>

                  {isScanningBill ? (
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-zinc-900 h-full w-2/3 animate-pulse rounded-full" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleScanBill}
                      className="px-4 py-2 rounded-xl bg-white text-zinc-800 font-medium text-xs hover:bg-zinc-50 transition inline-flex items-center gap-2"
                    >
                      <IconCamera className="w-3.5 h-3.5" />
                      {billScannedNotice ? "Re-scan Thermal Slip" : "Simulate Receipt Scan"}
                    </button>
                  )}
                </div>

                {/* Quick Amount Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-zinc-400 font-medium">Or select bill preset:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[240, 380, 520, 750].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setBillAmount(amt)}
                        className={`py-2.5 rounded-xl text-xs font-mono font-medium transition text-center ${
                          billAmount === amt
                            ? "bg-zinc-950 text-white font-bold"
                            : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200/70"
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Financial Summary Math */}
                <div className="bg-zinc-50 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Gross Bill Amount</span>
                    <span className="font-mono font-medium text-zinc-900">₹{billAmount}</span>
                  </div>

                  {isExistingCustomer && isRewardAppliedInPos && (
                    <div className="flex items-center justify-between text-emerald-700 font-medium">
                      <span>Loyalty Discount Deducted</span>
                      <span className="font-mono">-₹{currentCounterCustomer.availableReward}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-zinc-900 text-sm">Net Payable at Counter</span>
                    <span className="text-xl font-bold font-mono text-zinc-950">
                      ₹
                      {Math.max(
                        0,
                        billAmount -
                          (isExistingCustomer && isRewardAppliedInPos
                            ? currentCounterCustomer.availableReward
                            : 0)
                      )}
                    </span>
                  </div>
                </div>

                {/* Final Confirm Button */}
                <button
                  type="button"
                  onClick={handleCompleteVisit}
                  className="w-full py-4 rounded-2xl bg-zinc-950 text-white font-medium text-sm hover:bg-zinc-800 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <IconCheck className="w-4 h-4" />
                  Confirm & Punch Bill (₹
                  {Math.max(
                    0,
                    billAmount -
                      (isExistingCustomer && isRewardAppliedInPos
                        ? currentCounterCustomer.availableReward
                        : 0)
                  )}
                  )
                </button>
              </div>
            )}

            {/* -----------------------------------------------------------------
                STEP 4: SUCCESS CONFIRMATION & LIVE WHATSAPP LOOP
            ----------------------------------------------------------------- */}
            {counterStep === 4 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 text-center space-y-5 sm:space-y-6 animate-in fade-in duration-150">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <IconCheck className="w-7 h-7" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Visit Recorded Successfully!</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Loyalty points added & instant digital receipt dispatched via WhatsApp.
                  </p>
                </div>

                {/* WhatsApp Receipt Card Mockup */}
                <div className="bg-[#ECE5DD] p-3.5 sm:p-4 rounded-2xl text-left max-w-sm mx-auto">
                  <div className="bg-white rounded-xl p-3.5 text-xs text-zinc-800 space-y-1.5 leading-relaxed">
                    <div className="font-semibold text-zinc-950 flex items-center justify-between">
                      <span>The Daily Brew • Indiranagar</span>
                      <span className="text-[10px] text-zinc-400 font-normal">Now</span>
                    </div>
                    <p className="text-zinc-700">
                      Hi {currentCounterCustomer.name.split(" ")[0]}! Thanks for visiting us today ☕
                    </p>
                    <p className="text-zinc-600 font-mono text-[11px] bg-zinc-100 p-2 rounded-lg">
                      Bill Paid: ₹
                      {Math.max(
                        0,
                        billAmount -
                          (isExistingCustomer && isRewardAppliedInPos
                            ? currentCounterCustomer.availableReward
                            : 0)
                      )}
                      {isExistingCustomer && isRewardAppliedInPos && " • Saved ₹" + currentCounterCustomer.availableReward}
                    </p>
                    <p className="text-zinc-500 text-[11px]">
                      {isExistingCustomer
                        ? "2 more visits to unlock your next ₹100 loyalty milestone!"
                        : "Welcome! Your ₹50 reward is saved for Visit #2."}
                    </p>
                    <div className="text-[9px] text-zinc-400 text-right flex items-center justify-end gap-1 pt-1">
                      <span>Delivered</span>
                      <span className="text-sky-600">✓✓</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetCounter}
                  className="w-full py-4 rounded-2xl bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 transition active:scale-95 cursor-pointer"
                >
                  Next Customer (New Bill)
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: BRING THEM BACK (OUTREACH WITH HORIZONTAL MOBILE SCROLL)
        ========================================================================= */}
        {activeNav === "outreach" && (
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Automated Outreach</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Send targeted perks directly to regulars without paying ad agencies or Meta campaign fees.
                </p>
              </div>

              {/* Mode Switcher with Horizontal Scroll */}
              <div className="flex items-center gap-1 bg-zinc-200/60 p-1 rounded-xl overflow-x-auto no-scrollbar shrink-0 max-w-full">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 whitespace-nowrap ${
                      outreachMode === m.id
                        ? "bg-white text-zinc-950 font-semibold"
                        : "text-zinc-600 hover:text-zinc-900"
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

            {/* Mobile Customer Selection: Smooth Horizontal Scroll Strip */}
            <div className="md:hidden space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Select Regular</span>
                <span className="text-[11px] text-zinc-400 font-medium">Swipe horizontally →</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 snap-x px-0.5">
                {customers.map((c) => {
                  const isSelected = selectedOutreachCustomer?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedOutreachCustomer(c)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition flex flex-col justify-between min-w-[170px] snap-start shrink-0 ${
                        isSelected ? "bg-zinc-200/90 font-medium" : "bg-white hover:bg-zinc-100/70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 font-medium flex items-center justify-center text-xs shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        {c.isOverdue && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-100 text-amber-900 shrink-0">
                            Overdue
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-zinc-900 truncate">{c.name}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">Last seen: {c.lastVisitDaysAgo}d ago</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Two Column Canvas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 sm:gap-6">
              {/* Desktop Left Column: Overdue Regulars List */}
              <div className="hidden md:block md:col-span-2 space-y-2.5">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Eligible Regulars</span>
                {customers.map((c) => {
                  const isSelected = selectedOutreachCustomer?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedOutreachCustomer(c)}
                      className={`p-4 rounded-xl cursor-pointer transition flex items-center justify-between ${
                        isSelected ? "bg-zinc-200/80 font-medium" : "bg-white hover:bg-zinc-100/70"
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
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-900">
                          Overdue
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Column: WhatsApp Composer Preview (Responsive, No Overflow) */}
              <div className="md:col-span-3 bg-white rounded-2xl p-4 sm:p-6 flex flex-col justify-between space-y-5 min-w-0">
                <div className="space-y-4 min-w-0">
                  <div className="flex items-center justify-between pb-1 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <IconWhatsApp className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-semibold text-zinc-900 truncate">WhatsApp Direct Note</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono shrink-0">{selectedOutreachCustomer?.phone}</span>
                  </div>

                  {/* WhatsApp Bubble Preview */}
                  <div className="bg-[#ECE5DD] p-3.5 sm:p-4 rounded-2xl space-y-2">
                    <div className="bg-white rounded-xl p-3.5 text-xs text-zinc-800 max-w-sm ml-auto leading-relaxed">
                      {currentWhatsAppMessage}
                      <div className="text-[9px] text-zinc-400 text-right mt-1.5 flex items-center justify-end gap-1">
                        <span>14:32</span>
                        <span className="text-sky-600">✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Responsive Layout (Full-width on mobile, side-by-side on desktop) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                  <a
                    href={`https://wa.me/${cleanDigits(selectedOutreachCustomer.phone)}?text=${encodeURIComponent(
                      currentWhatsAppMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3.5 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition text-center flex items-center justify-center gap-2 shrink-0"
                  >
                    <IconWhatsApp className="w-4 h-4" />
                    Open in WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={() => handleSimulateReturn(selectedOutreachCustomer)}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-zinc-100 text-zinc-800 font-medium text-xs hover:bg-zinc-200 transition text-center shrink-0"
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
          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Reward & Retention Rules</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Automate perks without manual discounts or coupons</p>
              </div>
              <button
                onClick={() => setIsAddingRule(!isAddingRule)}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition shrink-0"
              >
                {isAddingRule ? "Cancel" : "+ New Rule"}
              </button>
            </div>

            {/* New Rule Creator */}
            {isAddingRule && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-4 animate-in fade-in duration-150">
                <h3 className="font-semibold text-sm text-zinc-900">Configure Loyalty Trigger</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Rule Name</label>
                    <input
                      type="text"
                      value={newRuleName}
                      onChange={(e) => setNewRuleName(e.target.value)}
                      placeholder="e.g. 5th Visit Celebration"
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-100 text-zinc-900 focus:outline-none focus:bg-zinc-200/70"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Trigger Condition</label>
                    <select
                      value={newRuleTrigger}
                      onChange={(e) => setNewRuleTrigger(e.target.value as TriggerType)}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-100 text-zinc-900 focus:outline-none"
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
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-100 text-zinc-900 focus:outline-none focus:bg-zinc-200/70"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Flat Discount (₹)</label>
                    <input
                      type="number"
                      value={newRuleReward}
                      onChange={(e) => setNewRuleReward(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-100 text-zinc-900 focus:outline-none focus:bg-zinc-200/70"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveNewRule}
                  className="w-full py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition"
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
                  className="bg-white rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition hover:bg-zinc-50"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm text-zinc-900">{rule.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-600 shrink-0">
                        {rule.triggerType === "visits_milestone" && `Visit #${rule.triggerValue}`}
                        {rule.triggerType === "days_overdue" && `>${rule.triggerValue}d gap`}
                        {rule.triggerType === "total_spend" && `Spend >₹${rule.triggerValue}`}
                        {rule.triggerType === "inactivity" && `Inactive ${rule.triggerValue}d`}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{rule.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
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
          <div className="space-y-5 sm:space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Business Impact & Guests</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Live recovery metrics and verified customer profiles</p>
            </div>

            {/* 3 Clean Key Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Recovered Revenue</span>
                <div className="text-2xl font-bold font-mono text-zinc-900 mt-1">₹24,800</div>
                <div className="text-xs text-emerald-600 font-medium mt-1">6.0x return on rewards</div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Repeat Visit Lift</span>
                <div className="text-2xl font-bold font-mono text-zinc-900 mt-1">38.4%</div>
                <div className="text-xs text-emerald-600 font-medium mt-1">+14% vs conventional cafes</div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">WhatsApp Opt-in</span>
                <div className="text-2xl font-bold font-mono text-zinc-900 mt-1">94.2%</div>
                <div className="text-xs text-zinc-400 font-medium mt-1">Direct guest relationships</div>
              </div>
            </div>

            {/* Guest Directory */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="font-semibold text-sm text-zinc-900">Verified Regulars ({filteredCustomers.length})</h3>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name or phone..."
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-lg bg-zinc-100 text-zinc-900 focus:outline-none focus:bg-zinc-200/70"
                  />
                  <IconSearch className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                {filteredCustomers.map((c) => (
                  <div key={c.id} className="py-2.5 px-2 rounded-xl hover:bg-zinc-50 transition flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 font-medium flex items-center justify-center text-xs shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-zinc-900 truncate">{c.name}</div>
                        <div className="text-[11px] text-zinc-400 truncate">{c.phone} • {c.favoriteItem}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                      <div className="text-right">
                        <div className="font-medium text-zinc-900 font-mono">₹{c.totalSpent}</div>
                        <div className="text-[11px] text-zinc-400">{c.visits} visits</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                        c.status === "VIP customer"
                          ? "bg-amber-100 text-amber-900"
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
          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Cafe Automation Settings</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Automated schedules, Google Maps ratings, and POS integration</p>
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition active:scale-95 shrink-0"
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
            <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
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
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-100 text-zinc-900 focus:outline-none"
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
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-100 text-zinc-900 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">End Time</label>
                    <input
                      type="time"
                      value={settings.deadHoursEndTime}
                      onChange={(e) => setSettings({ ...settings, deadHoursEndTime: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-100 text-zinc-900 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}
              <p className="text-[11px] text-zinc-400 pt-1">
                Invites nearby regulars with 20% off perks only during your slowest weekly hours.
              </p>
            </div>

            {/* Group 2: Google Maps Reviews */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
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
                  className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-100 text-zinc-900 focus:outline-none font-mono"
                />
              </div>
              <p className="text-[11px] text-zinc-400 pt-1">
                Prompts customers on their 3rd visit to rate your cafe, keeping your Google ranking #1.
              </p>
            </div>

            {/* Group 3: Counter POS Bridge */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-3">
              <div>
                <h3 className="font-semibold text-sm text-zinc-900">Counter POS Integration</h3>
                <p className="text-xs text-zinc-400">Zero tech overhead for cashiers</p>
              </div>

              <div className="p-3 bg-zinc-100 rounded-xl flex items-center justify-between">
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
            <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900">Anti-Spam Guardrails</h3>
                  <p className="text-xs text-zinc-400">Keep customer trust high and unsubscribe rates under 1%</p>
                </div>
                <Toggle checked={true} onChange={() => {}} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-zinc-100 rounded-xl">
                  <div className="font-medium text-zinc-900">Quiet Hours</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">No messages 9:30 PM - 9:00 AM</div>
                </div>
                <div className="p-3 bg-zinc-100 rounded-xl">
                  <div className="font-medium text-zinc-900">Cooldown Gap</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Min 7 days between messages</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MOBILE BOTTOM NAVIGATION DOCK (PURE FLAT, NO SHADOW, NO TOP BORDER)
      ========================================================================= */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md px-3 py-2 flex justify-around items-center">
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
