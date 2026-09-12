"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  IconLogo,
  IconGift,
  IconCheck,
  IconWhatsApp,
  IconArrowRight,
  IconCamera,
  IconUsers,
  IconTrendingUp,
  IconClock,
  IconStar,
  IconSettings,
  IconStore,
} from "../components/Icons";
import { Customer, OfferRule, TriggerType, RewardType, CafeSettings } from "./types";
import { INITIAL_CUSTOMERS, INITIAL_OFFER_RULES, DEFAULT_CAFE_SETTINGS } from "./mockData";

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

export default function DemoPage() {
  // Main Navigation: 'counter' | 'rules' | 'retention' | 'customers' | 'impact' | 'settings'
  const [activeNav, setActiveNav] = useState<
    "counter" | "rules" | "retention" | "customers" | "impact" | "settings"
  >("counter");

  // Settings page sub-tab: 'deadhours' | 'google' | 'pos' | 'whatsapp'
  const [settingsTab, setSettingsTab] = useState<"deadhours" | "google" | "pos" | "whatsapp">("deadhours");

  // Global demo state
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [offerRules, setOfferRules] = useState<OfferRule[]>(INITIAL_OFFER_RULES);
  const [settings, setSettings] = useState<CafeSettings>(DEFAULT_CAFE_SETTINGS);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState<boolean>(false);

  // Counter step-by-step state: 1 (phone) -> 2 (reward) -> 3 (camera/OCR) -> 4 (saved)
  const [counterStep, setCounterStep] = useState<1 | 2 | 3 | 4>(1);
  const [phoneInput, setPhoneInput] = useState<string>("+91 98765 43210");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("c1");
  const [isRewardAppliedInPos, setIsRewardAppliedInPos] = useState<boolean>(true);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [ocrCompleted, setOcrCompleted] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<string>("Ready to capture");

  // Offer rule creation modal state
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState<boolean>(false);
  const [newRuleName, setNewRuleName] = useState<string>("5th Visit Milestone");
  const [newTriggerType, setNewTriggerType] = useState<TriggerType>("visits_milestone");
  const [newTriggerValue, setNewTriggerValue] = useState<number>(5);
  const [newRewardType, setNewRewardType] = useState<RewardType>("flat_discount");
  const [newRewardValue, setNewRewardValue] = useState<number>(100);
  const [newMinBill, setNewMinBill] = useState<number>(350);
  const [newExpiryDays, setNewExpiryDays] = useState<number>(14);

  // Retention tab state
  const [activeRetentionId, setActiveRetentionId] = useState<string>("c1");
  const [retentionMessageMode, setRetentionMessageMode] = useState<"deadhours" | "review" | "standard">(
    "deadhours"
  );
  const [customEditedMessage, setCustomEditedMessage] = useState<string | null>(null);
  const [simulatedReturnNotice, setSimulatedReturnNotice] = useState<string | null>(null);

  // Active customer in Counter
  const activeCustomer = useMemo(() => {
    const cleanPhone = phoneInput.replace(/\s+/g, "");
    return (
      customers.find((c) => c.phone.replace(/\s+/g, "") === cleanPhone) ||
      customers.find((c) => c.id === selectedCustomerId) ||
      customers[0]
    );
  }, [customers, phoneInput, selectedCustomerId]);

  // Match best offer rule for active customer
  const matchedRuleForActiveCustomer = useMemo(() => {
    if (!activeCustomer) return null;
    const milestoneRule = offerRules.find(
      (r) => r.isActive && r.triggerType === "visits_milestone" && activeCustomer.visits >= r.triggerValue
    );
    if (milestoneRule) return milestoneRule;

    if (activeCustomer.isOverdue) {
      const overdueRule = offerRules.find(
        (r) => r.isActive && r.triggerType === "days_overdue"
      );
      if (overdueRule) return overdueRule;
    }

    return offerRules.find((r) => r.isActive) || null;
  }, [activeCustomer, offerRules]);

  // Active customer in Retention
  const activeRetentionCustomer = useMemo(() => {
    return customers.find((c) => c.id === activeRetentionId) || customers[0];
  }, [customers, activeRetentionId]);

  // Compute dynamic retention message during render
  const computedDefaultMessage = useMemo(() => {
    const c = activeRetentionCustomer;
    const firstName = c.name.split(" ")[0];

    if (retentionMessageMode === "deadhours" && settings.deadHoursEnabled) {
      return `Hey ${firstName} 👋 Missing your ${c.favoriteItem}? We've saved ₹100 off your bill this ${settings.deadHoursDays} between ${settings.deadHoursTime} at The Daily Brew. Perfect for a relaxed work session!`;
    } else if (retentionMessageMode === "review") {
      return `Hey ${firstName}! You've visited us ${c.visits} times now and you're officially one of our top regulars ❤️ Could you take 10 seconds to leave us a quick rating on Google? Here's our direct link: ${settings.googleMapsReviewUrl}. It means the world to our small team!`;
    } else {
      return `Hi ${firstName},\n\nYour usual ${c.favoriteItem} is waiting! Here's ₹100 off your next visit this week at The Daily Brew.\n\nHope to see you soon!`;
    }
  }, [activeRetentionCustomer, retentionMessageMode, settings]);

  const retentionMessage = customEditedMessage ?? computedDefaultMessage;

  // Keypad click handler for Counter
  const handleKeypadPress = (val: string) => {
    if (val === "C") {
      setPhoneInput("+91 ");
    } else if (val === "⌫") {
      if (phoneInput.length > 4) {
        setPhoneInput(phoneInput.slice(0, -1));
      }
    } else {
      if (phoneInput.length < 15) {
        setPhoneInput(phoneInput + val);
      }
    }
  };

  // Camera & OCR simulation
  const handleSnapBill = () => {
    setIsCapturing(true);
    setOcrProgress("Scanning receipt...");

    setTimeout(() => {
      setOcrProgress("Reading items & total...");
    }, 600);

    setTimeout(() => {
      setIsCapturing(false);
      setOcrCompleted(true);
      setOcrProgress("OCR complete");
    }, 1200);
  };

  // Confirm and Save Visit
  const handleConfirmSaveVisit = () => {
    const rewardAmt = matchedRuleForActiveCustomer
      ? Number(matchedRuleForActiveCustomer.rewardValue)
      : 100;
    const netBill = isRewardAppliedInPos ? Math.max(0, 420 - rewardAmt) : 420;

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === activeCustomer.id
          ? {
              ...c,
              visits: c.visits + 1,
              totalSpent: c.totalSpent + netBill,
              lastVisitDaysAgo: 0,
              isOverdue: false,
              availableReward: 0,
              history: [
                {
                  id: `h-${Date.now()}`,
                  timeAgo: "Just now",
                  items: "Cold Coffee, Paneer Wrap",
                  amount: netBill,
                  isToday: true,
                },
                ...c.history,
              ],
            }
          : c
      )
    );

    setCounterStep(4);
  };

  const handleResetCounter = () => {
    setCounterStep(1);
    setOcrCompleted(false);
    setIsCapturing(false);
    setIsRewardAppliedInPos(true);
  };

  const handleOpenWhatsApp = () => {
    const rawNumber = activeRetentionCustomer.phone.replace(/[^0-9]/g, "");
    const encoded = encodeURIComponent(retentionMessage);
    const url = `https://wa.me/${rawNumber}?text=${encoded}`;
    window.open(url, "_blank");
  };

  const handleSimulateReturn = () => {
    const netPaid = 420;

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
                  items: "Cold Coffee + Sandwich",
                  amount: netPaid,
                  isToday: true,
                },
                ...c.history,
              ],
            }
          : c
      )
    );

    setSimulatedReturnNotice(
      `✓ Repeat visit recorded! ${activeRetentionCustomer.name} returned 2 days later and spent ₹${netPaid}.`
    );

    setTimeout(() => {
      setSimulatedReturnNotice(null);
    }, 7000);
  };

  const handleToggleRule = (ruleId: string) => {
    setOfferRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleSaveNewRule = (e: React.FormEvent) => {
    e.preventDefault();

    const newRule: OfferRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      triggerType: newTriggerType,
      triggerValue: Number(newTriggerValue),
      rewardType: newRewardType,
      rewardValue: Number(newRewardValue),
      minBill: Number(newMinBill),
      expiryDays: Number(newExpiryDays),
      isActive: true,
      description:
        newTriggerType === "visits_milestone"
          ? `Give ₹${newRewardValue} OFF when customer completes their ${newTriggerValue}th visit`
          : newTriggerType === "days_overdue"
          ? `Give ₹${newRewardValue} OFF when regular is ${newTriggerValue}+ days past visit cycle`
          : `Give ₹${newRewardValue} OFF when lifetime spend reaches ₹${newTriggerValue}`,
    };

    setOfferRules((prev) => [newRule, ...prev]);
    setIsCreateRuleOpen(false);
  };

  const handleSaveSettings = () => {
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3500);
  };

  const handleFullReset = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setOfferRules(INITIAL_OFFER_RULES);
    setSettings(DEFAULT_CAFE_SETTINGS);
    setPhoneInput("+91 98765 43210");
    setSelectedCustomerId("c1");
    setCounterStep(1);
    setOcrCompleted(false);
    setIsCapturing(false);
    setIsRewardAppliedInPos(true);
    setActiveRetentionId("c1");
    setRetentionMessageMode("deadhours");
    setCustomEditedMessage(null);
    setSimulatedReturnNotice(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0A0A0B] flex flex-col md:flex-row selection:bg-[#0A0A0B] selection:text-white font-sans">
      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDEBAR                                                        */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex md:w-[220px] shrink-0 border-r border-black/[0.06] bg-white flex-col justify-between p-4 md:min-h-screen sticky top-0 h-screen">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 text-[17px] font-bold tracking-tight text-[#0A0A0B] hover:opacity-80 transition-opacity mb-6"
          >
            <IconLogo className="h-6 w-6" />
            <span>revisit</span>
          </Link>

          <div className="mb-5 rounded-lg bg-[#FAFAFA] border border-black/[0.06] p-2.5 text-[12px]">
            <div className="flex items-center justify-between">
              <p className="font-bold text-[#0A0A0B]">The Daily Brew</p>
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            </div>
            <p className="text-[11px] text-[#71717A] mt-0.5">Indiranagar Outlet</p>
          </div>

          <nav className="space-y-1 text-[13px] font-medium">
            <button
              onClick={() => setActiveNav("counter")}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all text-left cursor-pointer ${
                activeNav === "counter"
                  ? "bg-[#0A0A0B] text-white font-semibold shadow-xs"
                  : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0B]"
              }`}
            >
              <IconCamera className="h-4 w-4 shrink-0" />
              <span>At the counter</span>
            </button>

            <button
              onClick={() => setActiveNav("rules")}
              className={`w-full flex items-center justify-between rounded-lg px-3 py-2 transition-all text-left cursor-pointer ${
                activeNav === "rules"
                  ? "bg-[#0A0A0B] text-white font-semibold shadow-xs"
                  : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0B]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <IconGift className="h-4 w-4 shrink-0" />
                <span>Offer rules</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  activeNav === "rules"
                    ? "bg-white/20 text-white"
                    : "bg-[#F4F4F5] text-[#71717A]"
                }`}
              >
                {offerRules.filter((r) => r.isActive).length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav("retention")}
              className={`w-full flex items-center justify-between rounded-lg px-3 py-2 transition-all text-left cursor-pointer ${
                activeNav === "retention"
                  ? "bg-[#0A0A0B] text-white font-semibold shadow-xs"
                  : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0B]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <IconWhatsApp className="h-4 w-4 shrink-0 text-[#16A34A]" />
                <span>Bring them back</span>
              </div>
              {customers.some((c) => c.isOverdue && !c.returned) && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
              )}
            </button>

            <button
              onClick={() => setActiveNav("customers")}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all text-left cursor-pointer ${
                activeNav === "customers"
                  ? "bg-[#0A0A0B] text-white font-semibold shadow-xs"
                  : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0B]"
              }`}
            >
              <IconUsers className="h-4 w-4 shrink-0" />
              <span>Customers ({customers.length})</span>
            </button>

            <button
              onClick={() => setActiveNav("impact")}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all text-left cursor-pointer ${
                activeNav === "impact"
                  ? "bg-[#0A0A0B] text-white font-semibold shadow-xs"
                  : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0B]"
              }`}
            >
              <IconTrendingUp className="h-4 w-4 shrink-0" />
              <span>Business impact</span>
            </button>

            <button
              onClick={() => setActiveNav("settings")}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all text-left cursor-pointer ${
                activeNav === "settings"
                  ? "bg-[#0A0A0B] text-white font-semibold shadow-xs"
                  : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0B]"
              }`}
            >
              <IconSettings className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-[#71717A]">
          <span className="flex items-center gap-1 font-medium text-[#047857]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Demo Mode
          </span>
          <button
            onClick={handleFullReset}
            className="text-[#71717A] hover:text-[#0A0A0B] underline cursor-pointer"
          >
            Reset
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE APP HEADER (CLEAN NATIVE APP TOP BAR)                           */}
      {/* ========================================================================= */}
      <header className="md:hidden border-b border-black/[0.06] bg-white sticky top-0 z-40 px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <IconLogo className="h-5 w-5" />
            <span className="text-[15px] font-bold tracking-tight text-[#0A0A0B]">revisit</span>
          </Link>
          <span className="text-[#D4D4D8] text-[12px]">/</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[11.5px] font-bold text-[#0A0A0B]">The Daily Brew</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-[#047857] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]/70">
            POS Active
          </span>
          <button
            onClick={handleFullReset}
            className="text-[10.5px] font-semibold text-[#71717A] hover:text-[#0A0A0B] bg-[#FAFAFA] border border-black/[0.08] px-2 py-0.5 rounded-md active:scale-95 transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE CONTAINER                                               */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex border-b border-black/[0.06] bg-white/80 backdrop-blur-md px-6 py-2.5 items-center justify-between text-[12.5px]">
          <div className="flex items-center gap-2">
            <span className="text-[#71717A]">Demo</span>
            <span className="text-[#D4D4D8]">/</span>
            <span className="font-semibold text-[#0A0A0B] capitalize">
              {activeNav === "counter"
                ? "At the counter"
                : activeNav === "rules"
                ? "Offer rules"
                : activeNav === "retention"
                ? "Customers to bring back"
                : activeNav === "settings"
                ? "Restaurant Settings"
                : activeNav === "customers"
                ? "Customer Directory"
                : "Business impact"}
            </span>
          </div>

          <Link
            href="/"
            className="text-[12px] font-medium text-[#71717A] hover:text-[#0A0A0B] transition-colors"
          >
            ← Back to landing page
          </Link>
        </header>

        <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-[1000px] w-full mx-auto pb-28 sm:pb-24 md:pb-8">
          {/* ===================================================================== */}
          {/* 1. AT THE COUNTER VIEW                                                */}
          {/* ===================================================================== */}
          {activeNav === "counter" && (
            <div className="mx-auto max-w-[620px]">
              <div className="mb-4 sm:mb-5 flex items-center justify-between border-b border-black/[0.06] pb-2.5">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11.5px] sm:text-[12.5px] font-semibold">
                  <span
                    className={`px-2.5 py-0.5 rounded-full ${
                      counterStep === 1
                        ? "bg-[#0A0A0B] text-white"
                        : counterStep > 1
                        ? "bg-[#ECFDF5] text-[#047857]"
                        : "text-[#A1A1AA]"
                    }`}
                  >
                    {counterStep > 1 ? "✓ 1" : "1"} Phone
                  </span>
                  <span className="text-[#D4D4D8]">→</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full ${
                      counterStep === 2
                        ? "bg-[#0A0A0B] text-white"
                        : counterStep > 2
                        ? "bg-[#ECFDF5] text-[#047857]"
                        : "text-[#A1A1AA]"
                    }`}
                  >
                    {counterStep > 2 ? "✓ 2" : "2"} Reward
                  </span>
                  <span className="text-[#D4D4D8]">→</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full ${
                      counterStep === 3
                        ? "bg-[#0A0A0B] text-white"
                        : counterStep > 3
                        ? "bg-[#ECFDF5] text-[#047857]"
                        : "text-[#A1A1AA]"
                    }`}
                  >
                    {counterStep > 3 ? "✓ 3" : "3"} Snap
                  </span>
                </div>

                {counterStep > 1 && counterStep < 4 && (
                  <button
                    onClick={() => setCounterStep((prev) => (prev - 1) as 1 | 2 | 3)}
                    className="text-[11.5px] font-medium text-[#71717A] hover:text-[#0A0A0B] cursor-pointer"
                  >
                    ← Back
                  </button>
                )}
              </div>

              {/* Step 1: Phone Search */}
              {counterStep === 1 && (
                <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 border border-black/[0.06] shadow-xs">
                  <div className="text-center max-w-[380px] mx-auto">
                    <p className="text-[10px] sm:text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                      Step 1 · Customer greeting
                    </p>
                    <h2 className="mt-0.5 text-[18px] sm:text-[22px] font-bold tracking-tight text-[#0A0A0B]">
                      &quot;Phone number, please?&quot;
                    </h2>
                    <p className="mt-0.5 text-[12px] sm:text-[13px] text-[#71717A]">
                      Staff asks customer number before generating bill.
                    </p>

                    <div className="mt-4 rounded-lg sm:rounded-xl border border-black/[0.1] bg-[#FAFAFA] px-3 py-2 sm:py-2.5 focus-within:border-[#0A0A0B] focus-within:bg-white transition-all">
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full text-center text-[17px] sm:text-[20px] font-bold tracking-wide text-[#0A0A0B] focus:outline-none tabular"
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-center gap-1.5 flex-wrap text-[11px]">
                      <span className="text-[#71717A]">Quick sample:</span>
                      <button
                        onClick={() => {
                          setPhoneInput(customers[0].phone);
                          setSelectedCustomerId(customers[0].id);
                        }}
                        className="rounded bg-[#FAFAFA] border border-black/[0.08] px-2 py-0.5 font-medium text-[#0A0A0B] hover:bg-[#F4F4F5]"
                      >
                        Rahul (8 visits)
                      </button>
                      <button
                        onClick={() => {
                          setPhoneInput(customers[1].phone);
                          setSelectedCustomerId(customers[1].id);
                        }}
                        className="rounded bg-[#FAFAFA] border border-black/[0.08] px-2 py-0.5 font-medium text-[#0A0A0B] hover:bg-[#F4F4F5]"
                      >
                        Aman (5 visits)
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2 max-w-[240px] mx-auto">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((key) => (
                        <button
                          key={key}
                          onClick={() => handleKeypadPress(key)}
                          className="h-9 sm:h-10 rounded-lg bg-[#F8F9FA] text-[15px] font-semibold text-[#0A0A0B] hover:bg-[#F1F3F5] active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-black/[0.04]"
                        >
                          {key}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCounterStep(2)}
                      className="mt-5 w-full max-w-[280px] rounded-lg sm:rounded-xl bg-[#0A0A0B] py-2.5 sm:py-3 text-[13px] sm:text-[14px] font-bold text-white hover:bg-black/90 transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
                    >
                      <span>Check customer rules</span>
                      <IconArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Recognition */}
              {counterStep === 2 && (
                <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 border border-black/[0.06] shadow-xs">
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                      Step 2 · Customer recognized
                    </p>
                    <h2 className="mt-0.5 text-[18px] sm:text-[22px] font-bold tracking-tight text-[#0A0A0B]">
                      Offer Rule Triggered
                    </h2>
                    <p className="mt-0.5 text-[12px] sm:text-[13px] text-[#71717A]">
                      Evaluated active offer rules for {activeCustomer.name}.
                    </p>
                  </div>

                  <div className="mt-4 rounded-lg sm:rounded-xl bg-[#FAFAFA] border border-black/[0.06] p-3 sm:p-4">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0A0B] text-white font-bold text-[14px]">
                          {activeCustomer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-[14px] font-bold text-[#0A0A0B]">
                              {activeCustomer.name}
                            </p>
                            <span className="rounded bg-[#ECFDF5] px-1.5 py-0.2 text-[10px] font-bold text-[#047857]">
                              {activeCustomer.status}
                            </span>
                          </div>
                          <p className="tabular text-[11px] text-[#71717A]">
                            {activeCustomer.phone}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="rounded-full bg-[#FEF2F2] px-2 py-0.5 text-[10.5px] font-bold text-[#DC2626]">
                          {activeCustomer.lastVisitDaysAgo === 0
                            ? "Today"
                            : `${activeCustomer.lastVisitDaysAgo}d ago`}
                        </span>
                        <p className="text-[10px] text-[#71717A] mt-0.5">
                          Usual: {activeCustomer.usualGapDays}d
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 grid grid-cols-3 divide-x divide-black/[0.06] text-center text-[11.5px]">
                      <div>
                        <p className="tabular font-bold text-[#0A0A0B]">{activeCustomer.visits}</p>
                        <p className="text-[10px] text-[#71717A]">visits</p>
                      </div>
                      <div>
                        <p className="tabular font-bold text-[#0A0A0B]">
                          ₹{activeCustomer.totalSpent.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[10px] text-[#71717A]">spent</p>
                      </div>
                      <div>
                        <p className="font-bold text-[#0A0A0B] truncate px-1">{activeCustomer.favoriteItem}</p>
                        <p className="text-[10px] text-[#71717A]">favorite</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg sm:rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-[#047857]">
                          <IconGift className="h-4 w-4" />
                          <span className="text-[15px] sm:text-[16px] font-bold">
                            ₹{matchedRuleForActiveCustomer?.rewardValue || 100} Reward Available
                          </span>
                        </div>
                        <p className="mt-0.5 text-[12px] text-[#065F46]">
                          Rule: <strong>{matchedRuleForActiveCustomer?.name || "Milestone"}</strong> (Min bill ₹{matchedRuleForActiveCustomer?.minBill || 350})
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg bg-white p-3 border border-[#047857]/15 text-[12px]">
                      <p className="font-bold text-[#0A0A0B] uppercase tracking-wider text-[10.5px]">
                        Cashier Instruction:
                      </p>
                      <p className="text-[#52525B] mt-0.5">
                        Punch <strong className="text-[#0A0A0B]">₹{matchedRuleForActiveCustomer?.rewardValue || 100} discount</strong> in your POS machine on this bill.
                      </p>

                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          onClick={() => setIsRewardAppliedInPos(true)}
                          className={`rounded px-2.5 py-1 text-[11.5px] font-bold transition-all cursor-pointer ${
                            isRewardAppliedInPos
                              ? "bg-[#047857] text-white"
                              : "bg-[#FAFAFA] border border-black/[0.08] text-[#71717A]"
                          }`}
                        >
                          ✓ Applied in POS
                        </button>
                        <button
                          onClick={() => setIsRewardAppliedInPos(false)}
                          className={`rounded px-2.5 py-1 text-[11.5px] font-medium transition-all cursor-pointer ${
                            !isRewardAppliedInPos
                              ? "bg-[#0A0A0B] text-white"
                              : "bg-[#FAFAFA] border border-black/[0.08] text-[#71717A]"
                          }`}
                        >
                          Skip discount
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={() => setCounterStep(3)}
                      className="w-full sm:w-auto rounded-lg sm:rounded-xl bg-[#0A0A0B] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-black/90 transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
                    >
                      <span>Proceed to bill capture</span>
                      <IconArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Camera & Receipt OCR */}
              {counterStep === 3 && (
                <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 border border-black/[0.06] shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                        Step 3 · Bill capture
                      </p>
                      <h2 className="mt-0.5 text-[18px] sm:text-[22px] font-bold tracking-tight text-[#0A0A0B]">
                        Snap printed POS bill
                      </h2>
                    </div>
                    <span className="rounded bg-[#FAFAFA] border border-black/[0.08] px-2 py-0.5 text-[11px] font-medium text-[#71717A]">
                      {activeCustomer.name.split(" ")[0]}
                    </span>
                  </div>

                  <div className="mt-4 relative rounded-xl bg-[#18181B] p-3 sm:p-5 text-white overflow-hidden shadow-inner">
                    <div className="absolute top-2.5 left-2.5 h-3.5 w-3.5 border-t-2 border-l-2 border-white/60" />
                    <div className="absolute top-2.5 right-2.5 h-3.5 w-3.5 border-t-2 border-r-2 border-white/60" />
                    <div className="absolute bottom-2.5 left-2.5 h-3.5 w-3.5 border-b-2 border-l-2 border-white/60" />
                    <div className="absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b-2 border-r-2 border-white/60" />

                    {isCapturing && (
                      <div className="absolute inset-x-0 top-0 h-1 bg-[#22C55E] shadow-[0_0_15px_#22C55E] animate-bounce z-20" />
                    )}

                    <div className="mx-auto max-w-[270px] sm:max-w-[300px] rounded-lg bg-white p-3 sm:p-4 text-[#0A0A0B] shadow-2xl font-mono text-[11px] sm:text-[11.5px]">
                      <div className="text-center border-b border-dashed border-black/20 pb-2">
                        <p className="font-bold text-[12.5px] font-sans">THE DAILY BREW</p>
                        <p className="text-[10px] text-[#71717A] mt-0.5">Bill #2841 · Today, 7:32 PM</p>
                      </div>

                      <div className="py-2 space-y-1 border-b border-dashed border-black/20">
                        <div className="flex justify-between">
                          <span>1x Cold Coffee</span>
                          <span className="font-bold">₹220</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1x Paneer Wrap</span>
                          <span className="font-bold">₹200</span>
                        </div>
                        {isRewardAppliedInPos && (
                          <div className="flex justify-between text-[#047857] font-semibold pt-0.5">
                            <span>Revisit Reward</span>
                            <span>-₹{matchedRuleForActiveCustomer?.rewardValue || 100}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex justify-between text-[13px] font-bold">
                        <span>TOTAL PAID:</span>
                        <span>
                          ₹
                          {isRewardAppliedInPos
                            ? 420 - Number(matchedRuleForActiveCustomer?.rewardValue || 100)
                            : 420}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-white/70">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            ocrCompleted
                              ? "bg-[#22C55E]"
                              : isCapturing
                              ? "bg-[#EAB308] animate-ping"
                              : "bg-white/40"
                          }`}
                        />
                        <span>{ocrProgress}</span>
                      </div>

                      {!ocrCompleted ? (
                        <button
                          onClick={handleSnapBill}
                          disabled={isCapturing}
                          className="rounded-full bg-white px-4 py-1.5 text-[12px] font-bold text-[#0A0A0B] hover:bg-white/90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <IconCamera className="h-3.5 w-3.5" />
                          <span>{isCapturing ? "Scanning..." : "📸 Snap Bill"}</span>
                        </button>
                      ) : (
                        <span className="rounded-full bg-[#22C55E]/20 text-[#22C55E] px-2.5 py-0.5 text-[11px] font-bold">
                          ✓ Processed
                        </span>
                      )}
                    </div>
                  </div>

                  {ocrCompleted && (
                    <div className="mt-3.5 rounded-lg sm:rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-3 text-[#166534]">
                      <div className="flex items-center justify-between text-[12px] font-bold">
                        <div className="flex items-center gap-1.5">
                          <IconCheck className="h-3.5 w-3.5 text-[#16A34A]" />
                          <span>OCR Extracted 2 Items</span>
                        </div>
                        <span className="text-[11px] text-[#15803D]">1.2s</span>
                      </div>

                      <div className="mt-2 grid grid-cols-3 gap-1.5 text-[11px] bg-white rounded p-2 border border-[#BBF7D0]">
                        <div>
                          <p className="text-[#71717A]">Items</p>
                          <p className="font-bold text-[#0A0A0B] truncate">Coffee, Wrap</p>
                        </div>
                        <div>
                          <p className="text-[#71717A]">Paid</p>
                          <p className="font-bold text-[#0A0A0B]">
                            ₹
                            {isRewardAppliedInPos
                              ? 420 - Number(matchedRuleForActiveCustomer?.rewardValue || 100)
                              : 420}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#71717A]">Customer</p>
                          <p className="font-bold text-[#0A0A0B] truncate">{activeCustomer.name}</p>
                        </div>
                      </div>

                      <button
                        onClick={handleConfirmSaveVisit}
                        className="mt-3 w-full rounded-lg bg-[#0A0A0B] py-2.5 text-[13px] font-bold text-white hover:bg-black/90 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <span>Confirm & Save Visit</span>
                        <IconArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Complete */}
              {counterStep === 4 && (
                <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 border border-black/[0.06] shadow-xs text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#ECFDF5] text-[#047857]">
                    <IconCheck className="h-5 w-5" />
                  </div>

                  <h2 className="mt-2 text-[18px] sm:text-[20px] font-bold tracking-tight text-[#0A0A0B]">
                    Visit recorded in 8 seconds!
                  </h2>
                  <p className="mt-0.5 text-[12px] text-[#71717A]">
                    Receipt OCR linked this order to {activeCustomer.name}&apos;s profile.
                  </p>

                  <div className="mt-4 rounded-lg bg-[#FAFAFA] border border-black/[0.06] p-3 max-w-[360px] mx-auto text-left">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2">
                      <div>
                        <p className="text-[13.5px] font-bold text-[#0A0A0B]">{activeCustomer.name}</p>
                        <p className="tabular text-[11px] text-[#71717A]">{activeCustomer.phone}</p>
                      </div>
                      <span className="rounded bg-[#ECFDF5] px-1.5 py-0.2 text-[10px] font-bold text-[#047857]">
                        Updated Just Now
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-1.5 text-center text-[11px]">
                      <div>
                        <p className="tabular font-bold text-[14px] text-[#0A0A0B]">{activeCustomer.visits}</p>
                        <p className="text-[#71717A]">visits (+1)</p>
                      </div>
                      <div>
                        <p className="tabular font-bold text-[14px] text-[#0A0A0B]">
                          ₹{activeCustomer.totalSpent.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[#71717A]">spend</p>
                      </div>
                      <div>
                        <p className="font-bold text-[12.5px] text-[#047857]">Healthy</p>
                        <p className="text-[#71717A]">status</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <button
                      onClick={handleResetCounter}
                      className="w-full sm:w-auto rounded-lg border border-black/[0.1] bg-white px-4 py-2 text-[12px] font-bold text-[#0A0A0B] hover:bg-black/5 transition-all cursor-pointer"
                    >
                      + Next Customer
                    </button>
                    <button
                      onClick={() => setActiveNav("retention")}
                      className="w-full sm:w-auto rounded-lg bg-[#0A0A0B] px-4 py-2 text-[12px] font-bold text-white hover:bg-black/90 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>See WhatsApp Queue</span>
                      <IconArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* 2. OFFER RULES VIEW                                                   */}
          {/* ===================================================================== */}
          {activeNav === "rules" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-black/[0.06] pb-3">
                <div>
                  <h1 className="text-[18px] sm:text-[22px] font-bold tracking-tight text-[#0A0A0B]">
                    Offer & Retention Rules
                  </h1>
                  <p className="text-[12px] sm:text-[13px] text-[#71717A]">
                    Automated rules that trigger counter discounts (e.g. &quot;5th visit → ₹100 OFF&quot;).
                  </p>
                </div>

                <button
                  onClick={() => setIsCreateRuleOpen(true)}
                  className="rounded-lg bg-[#0A0A0B] px-3.5 py-2 text-[12px] font-bold text-white hover:bg-black/85 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  <span>+ Create Rule</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {offerRules.map((rule) => {
                  const matchingCustomersCount = customers.filter((c) => {
                    if (rule.triggerType === "visits_milestone") return c.visits >= rule.triggerValue;
                    if (rule.triggerType === "days_overdue") return c.isOverdue;
                    if (rule.triggerType === "total_spend") return c.totalSpent >= rule.triggerValue;
                    return false;
                  }).length;

                  return (
                    <div
                      key={rule.id}
                      className={`rounded-xl bg-white p-4 border transition-all ${
                        rule.isActive
                          ? "border-black/[0.08] shadow-xs"
                          : "border-black/[0.04] opacity-60 bg-[#FAFAFA]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-[14.5px] font-bold text-[#0A0A0B]">{rule.name}</h3>
                            <span
                              className={`rounded px-1.5 py-0.2 text-[9.5px] font-bold ${
                                rule.isActive
                                  ? "bg-[#ECFDF5] text-[#047857]"
                                  : "bg-[#F4F4F5] text-[#71717A]"
                              }`}
                            >
                              {rule.isActive ? "Active" : "Paused"}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#52525B] mt-0.5 leading-snug">{rule.description}</p>
                        </div>

                        <button
                          onClick={() => handleToggleRule(rule.id)}
                          className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                            rule.isActive
                              ? "border-[#047857]/30 text-[#047857] hover:bg-[#ECFDF5]"
                              : "border-black/[0.1] text-[#71717A] hover:bg-black/5"
                          }`}
                        >
                          {rule.isActive ? "Off" : "On"}
                        </button>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-1.5 bg-[#FAFAFA] rounded-lg p-2 text-[11px]">
                        <div>
                          <p className="text-[#71717A] text-[10px]">Trigger</p>
                          <p className="font-bold text-[#0A0A0B] truncate">
                            {rule.triggerType === "visits_milestone"
                              ? `${rule.triggerValue} visits`
                              : rule.triggerType === "days_overdue"
                              ? `${rule.triggerValue}d overdue`
                              : `> ₹${rule.triggerValue}`}
                          </p>
                        </div>

                        <div>
                          <p className="text-[#71717A] text-[10px]">Reward</p>
                          <p className="font-bold text-[#047857]">
                            {rule.rewardType === "percent_discount"
                              ? `${rule.rewardValue}% OFF`
                              : `₹${rule.rewardValue} OFF`}
                          </p>
                        </div>

                        <div>
                          <p className="text-[#71717A] text-[10px]">Min bill</p>
                          <p className="font-bold text-[#0A0A0B]">₹{rule.minBill}</p>
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#71717A] border-t border-black/[0.04] pt-2">
                        <span>Valid {rule.expiryDays}d</span>
                        <span className="font-semibold text-[#0A0A0B]">
                          {matchingCustomersCount} qualify
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Create Rule Modal */}
              {isCreateRuleOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 animate-in fade-in duration-150">
                  <div className="w-full max-w-[440px] rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-2xl border border-black/[0.08] max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5">
                      <div>
                        <h3 className="text-[15px] font-bold text-[#0A0A0B]">
                          Create Offer Rule
                        </h3>
                        <p className="text-[11px] text-[#71717A]">
                          Set automated conditions to reward regular customers.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsCreateRuleOpen(false)}
                        className="text-[#71717A] hover:text-[#0A0A0B] text-[14px] font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveNewRule} className="mt-3 space-y-3 text-[12px]">
                      <div>
                        <label className="font-bold text-[#0A0A0B] block mb-1">Rule Name</label>
                        <input
                          type="text"
                          value={newRuleName}
                          onChange={(e) => setNewRuleName(e.target.value)}
                          placeholder="e.g. 5th Visit Milestone"
                          required
                          className="w-full rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-3 py-1.5 font-medium text-[#0A0A0B] focus:outline-none focus:border-[#0A0A0B]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-[#0A0A0B] block mb-1">Trigger Type</label>
                          <select
                            value={newTriggerType}
                            onChange={(e) => setNewTriggerType(e.target.value as TriggerType)}
                            className="w-full rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-2.5 py-1.5 font-medium text-[#0A0A0B] focus:outline-none"
                          >
                            <option value="visits_milestone">Visit Milestone</option>
                            <option value="days_overdue">Days Overdue</option>
                            <option value="total_spend">Lifetime Spend</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-[#0A0A0B] block mb-1">
                            {newTriggerType === "visits_milestone"
                              ? "Visits Count"
                              : newTriggerType === "days_overdue"
                              ? "Days Overdue"
                              : "Spend (₹)"}
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={newTriggerValue}
                            onChange={(e) => setNewTriggerValue(Number(e.target.value))}
                            className="w-full rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-2.5 py-1.5 font-medium text-[#0A0A0B] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-[#0A0A0B] block mb-1">Reward Type</label>
                          <select
                            value={newRewardType}
                            onChange={(e) => setNewRewardType(e.target.value as RewardType)}
                            className="w-full rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-2.5 py-1.5 font-medium text-[#0A0A0B] focus:outline-none"
                          >
                            <option value="flat_discount">Flat Discount (₹)</option>
                            <option value="percent_discount">Percentage (%)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-[#0A0A0B] block mb-1">Reward Value</label>
                          <input
                            type="number"
                            min="5"
                            value={newRewardValue}
                            onChange={(e) => setNewRewardValue(Number(e.target.value))}
                            className="w-full rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-2.5 py-1.5 font-medium text-[#0A0A0B] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-[#0A0A0B] block mb-1">Min Bill (₹)</label>
                          <input
                            type="number"
                            min="0"
                            value={newMinBill}
                            onChange={(e) => setNewMinBill(Number(e.target.value))}
                            className="w-full rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-2.5 py-1.5 font-medium text-[#0A0A0B] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-[#0A0A0B] block mb-1">Expiry (Days)</label>
                          <input
                            type="number"
                            min="1"
                            value={newExpiryDays}
                            onChange={(e) => setNewExpiryDays(Number(e.target.value))}
                            className="w-full rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-2.5 py-1.5 font-medium text-[#0A0A0B] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] p-2.5 text-[11.5px] text-[#065F46]">
                        <p className="font-bold text-[#047857]">Rule Logic:</p>
                        <p className="mt-0.5">
                          When customer{" "}
                          <strong>
                            {newTriggerType === "visits_milestone"
                              ? `completes ${newTriggerValue} visits`
                              : newTriggerType === "days_overdue"
                              ? `is ${newTriggerValue}+ days overdue`
                              : `spends > ₹${newTriggerValue}`}
                          </strong>
                          , give <strong>₹{newRewardValue} OFF</strong> on min bill ₹{newMinBill}.
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.06]">
                        <button
                          type="button"
                          onClick={() => setIsCreateRuleOpen(false)}
                          className="rounded-lg border border-black/[0.1] px-3 py-1.5 font-medium text-[#71717A] hover:bg-black/5"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-lg bg-[#0A0A0B] px-4 py-1.5 font-bold text-white hover:bg-black/90 cursor-pointer shadow-xs"
                        >
                          Activate Rule
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* 3. BRING THEM BACK (WHATSAPP QUEUE)                                   */}
          {/* ===================================================================== */}
          {activeNav === "retention" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.06] pb-3">
                <div>
                  <h1 className="text-[18px] sm:text-[22px] font-bold tracking-tight text-[#0A0A0B]">
                    Customers to bring back
                  </h1>
                  <p className="text-[12px] sm:text-[13px] text-[#71717A]">
                    Automated WhatsApp queue for customers past their visit cycle.
                  </p>
                </div>

                <button
                  onClick={handleSimulateReturn}
                  className="rounded-lg bg-[#0A0A0B] px-3 py-1.5 text-[11.5px] sm:text-[12px] font-bold text-white hover:bg-black/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  <span>⚡ Simulate Return</span>
                </button>
              </div>

              {simulatedReturnNotice && (
                <div className="rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] p-3 text-[12px] font-semibold text-[#047857] flex items-center justify-between animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5">
                    <IconCheck className="h-4 w-4 shrink-0" />
                    <span>{simulatedReturnNotice}</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveNav("counter");
                      setCounterStep(1);
                    }}
                    className="rounded bg-[#047857] px-2.5 py-0.5 text-[11px] font-bold text-white hover:bg-[#065F46]"
                  >
                    Counter →
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
                <div className="lg:col-span-7 rounded-xl bg-white border border-black/[0.06] shadow-xs overflow-hidden">
                  <div className="flex items-center justify-between border-b border-black/[0.06] px-3.5 py-2.5 bg-[#FAFAFA]">
                    <span className="text-[12px] font-bold text-[#0A0A0B]">
                      Overdue regulars ({customers.filter((c) => c.isOverdue).length})
                    </span>
                    <span className="text-[11px] text-[#71717A]">By visit gap</span>
                  </div>

                  <div className="divide-y divide-black/[0.04]">
                    {customers.map((c) => {
                      const isSelected = c.id === activeRetentionCustomer.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            setActiveRetentionId(c.id);
                            setCustomEditedMessage(null);
                          }}
                          className={`flex items-center justify-between p-3 transition-colors cursor-pointer ${
                            isSelected ? "bg-[#F4F4F5]" : "hover:bg-[#FAFAFA]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                                isSelected
                                  ? "bg-[#0A0A0B] text-white"
                                  : "bg-[#FAFAFA] text-[#0A0A0B] border border-black/[0.08]"
                              }`}
                            >
                              {c.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-[13px] font-bold text-[#0A0A0B] truncate">
                                  {c.name}
                                </p>
                                {c.returned && (
                                  <span className="rounded bg-[#ECFDF5] px-1 py-0.2 text-[9px] font-bold text-[#047857]">
                                    Returned
                                  </span>
                                )}
                              </div>
                              <p className="tabular text-[11px] text-[#71717A]">{c.phone}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`tabular inline-block rounded-full px-2 py-0.2 text-[10.5px] font-bold ${
                                c.isOverdue
                                  ? "bg-[#FEF2F2] text-[#DC2626]"
                                  : "bg-[#ECFDF5] text-[#047857]"
                              }`}
                            >
                              {c.lastVisitDaysAgo === 0 ? "Today" : `${c.lastVisitDaysAgo}d ago`}
                            </span>
                            <p className="text-[10px] text-[#A1A1AA] mt-0.5">Every {c.usualGapDays}d</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-3">
                  <div className="rounded-xl bg-white p-4 border border-black/[0.06] shadow-xs">
                    <div className="flex items-center gap-2.5 border-b border-black/[0.06] pb-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A0A0B] text-white font-bold text-[12px]">
                        {activeRetentionCustomer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[13.5px] font-bold text-[#0A0A0B]">
                          {activeRetentionCustomer.name}
                        </p>
                        <p className="tabular text-[11px] text-[#71717A]">
                          {activeRetentionCustomer.phone}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-[10.5px] font-bold text-[#71717A] uppercase tracking-wider mb-1.5">
                        Choose Outreach Objective:
                      </p>
                      <div className="flex gap-1.5 flex-wrap text-[11px]">
                        <button
                          onClick={() => {
                            setRetentionMessageMode("deadhours");
                            setCustomEditedMessage(null);
                          }}
                          className={`rounded px-2.5 py-1 font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                            retentionMessageMode === "deadhours"
                              ? "bg-[#D97706] text-white"
                              : "bg-[#FAFAFA] border border-black/[0.08] text-[#52525B] hover:bg-black/5"
                          }`}
                        >
                          <IconClock className="h-3 w-3" />
                          <span>Dead Hours Deal</span>
                        </button>

                        <button
                          onClick={() => {
                            setRetentionMessageMode("review");
                            setCustomEditedMessage(null);
                          }}
                          className={`rounded px-2.5 py-1 font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                            retentionMessageMode === "review"
                              ? "bg-[#2563EB] text-white"
                              : "bg-[#FAFAFA] border border-black/[0.08] text-[#52525B] hover:bg-black/5"
                          }`}
                        >
                          <IconStar className="h-3 w-3" />
                          <span>Google Rating Booster</span>
                        </button>

                        <button
                          onClick={() => {
                            setRetentionMessageMode("standard");
                            setCustomEditedMessage(null);
                          }}
                          className={`rounded px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                            retentionMessageMode === "standard"
                              ? "bg-[#0A0A0B] text-white"
                              : "bg-[#FAFAFA] border border-black/[0.08] text-[#52525B] hover:bg-black/5"
                          }`}
                        >
                          Standard Win-back
                        </button>
                      </div>
                    </div>

                    {retentionMessageMode === "deadhours" && (
                      <div className="mt-2.5 rounded bg-[#FFFBEB] border border-[#FDE68A] p-2 text-[11px] text-[#92400E]">
                        <p className="font-bold flex items-center gap-1">
                          <IconClock className="h-3 w-3 text-[#D97706]" />
                          Smart Timing: {settings.deadHoursDays} · {settings.deadHoursTime}
                        </p>
                        <p className="opacity-90 mt-0.5">
                          Protects busy weekend table revenue by driving regular visits to slow afternoon hours.
                        </p>
                      </div>
                    )}

                    {retentionMessageMode === "review" && (
                      <div className="mt-2.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] p-2 text-[11px] text-[#1E40AF]">
                        <p className="font-bold flex items-center gap-1">
                          <IconStar className="h-3 w-3 text-[#2563EB]" />
                          Google Maps Review Booster (Visit #{activeRetentionCustomer.visits} Regular)
                        </p>
                        <p className="opacity-90 mt-0.5">
                          Pre-fills direct review URL: {settings.googleMapsReviewUrl}
                        </p>
                      </div>
                    )}

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1 text-[11.5px]">
                        <span className="font-bold text-[#0A0A0B]">WhatsApp Draft</span>
                        <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                          <IconWhatsApp className="h-3 w-3" />
                          1-Tap Send
                        </span>
                      </div>

                      <textarea
                        rows={5}
                        value={retentionMessage}
                        onChange={(e) => setCustomEditedMessage(e.target.value)}
                        className="w-full rounded-lg border border-black/[0.08] bg-[#FAFAFA] p-2.5 text-[12px] font-medium text-[#0A0A0B] focus:border-[#0A0A0B] focus:bg-white focus:outline-none transition-colors leading-relaxed"
                      />

                      <button
                        onClick={handleOpenWhatsApp}
                        className="mt-2.5 w-full rounded-lg bg-[#16A34A] py-2 text-[12.5px] font-bold text-white hover:bg-[#15803D] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <IconWhatsApp className="h-3.5 w-3.5" />
                        <span>Send on WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* 4. DEDICATED SETTINGS PAGE (STREAMLINED CONTROLS & EXPLANATION)      */}
          {/* ===================================================================== */}
          {activeNav === "settings" && (
            <div className="space-y-4">
              <div className="border-b border-black/[0.06] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-[18px] sm:text-[22px] font-bold tracking-tight text-[#0A0A0B]">
                    Settings
                  </h1>
                </div>

                {settingsSavedNotice && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-[12px] font-bold text-[#047857] animate-in fade-in">
                    <IconCheck className="h-4 w-4" />
                    <span>Settings Saved</span>
                  </span>
                )}
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center gap-1.5 border-b border-black/[0.06] pb-2 overflow-x-auto scrollbar-none text-[12px] font-semibold">
                <button
                  onClick={() => setSettingsTab("deadhours")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    settingsTab === "deadhours"
                      ? "bg-[#0A0A0B] text-white"
                      : "text-[#52525B] hover:bg-black/5"
                  }`}
                >
                  <IconClock className="h-3.5 w-3.5" />
                  <span>Dead Hours & Timing</span>
                </button>

                <button
                  onClick={() => setSettingsTab("google")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    settingsTab === "google"
                      ? "bg-[#0A0A0B] text-white"
                      : "text-[#52525B] hover:bg-black/5"
                  }`}
                >
                  <IconStar className="h-3.5 w-3.5" />
                  <span>Google Maps Review</span>
                </button>

                <button
                  onClick={() => setSettingsTab("pos")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    settingsTab === "pos"
                      ? "bg-[#0A0A0B] text-white"
                      : "text-[#52525B] hover:bg-black/5"
                  }`}
                >
                  <IconStore className="h-3.5 w-3.5" />
                  <span>POS & Billing Bridge</span>
                </button>

                <button
                  onClick={() => setSettingsTab("whatsapp")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    settingsTab === "whatsapp"
                      ? "bg-[#0A0A0B] text-white"
                      : "text-[#52525B] hover:bg-black/5"
                  }`}
                >
                  <IconWhatsApp className="h-3.5 w-3.5" />
                  <span>WhatsApp Outreach</span>
                </button>
              </div>

              {/* SUBTAB 1: DEAD HOURS & TIMING */}
              {settingsTab === "deadhours" && (
                <div className="space-y-4 max-w-[620px]">
                  {/* Main Settings Card */}
                  <div className="rounded-xl bg-white p-5 border border-black/[0.06] shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[14.5px] font-bold text-[#0A0A0B]">
                          Dead Hours Yield Automation
                        </h3>
                        <p className="text-[12px] text-[#71717A]">
                          Route retention offers strictly to slow weekday shifts.
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setSettings({ ...settings, deadHoursEnabled: !settings.deadHoursEnabled })
                        }
                        className={`text-[11.5px] font-bold px-3 py-1 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                          settings.deadHoursEnabled
                            ? "border-[#047857]/30 bg-[#ECFDF5] text-[#047857]"
                            : "border-black/[0.1] bg-[#FAFAFA] text-[#71717A]"
                        }`}
                      >
                        {settings.deadHoursEnabled ? "Active" : "Paused"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[12px] font-bold text-[#0A0A0B] block mb-1.5">
                          Downtime Days
                        </label>
                        <select
                          value={settings.deadHoursDays}
                          onChange={(e) =>
                            setSettings({ ...settings, deadHoursDays: e.target.value })
                          }
                          className="h-10 w-full rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-3 font-medium text-[#0A0A0B] text-[12.5px] focus:outline-none focus:border-[#0A0A0B] focus:bg-white transition-colors cursor-pointer"
                        >
                          <option value="Tuesday – Thursday">Tuesday – Thursday (Midweek)</option>
                          <option value="Monday – Thursday">Monday – Thursday</option>
                          <option value="Monday – Wednesday">Monday – Wednesday</option>
                          <option value="Wednesday & Thursday">Wednesday & Thursday</option>
                          <option value="Monday – Friday">Monday – Friday (All Weekdays)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[12px] font-bold text-[#0A0A0B] block mb-1.5">
                          Downtime Window
                        </label>
                        <div className="flex items-center gap-2 h-10">
                          <input
                            type="time"
                            value={settings.deadHoursStartTime}
                            onChange={(e) => {
                              const newStart = e.target.value;
                              const formatted = `${formatTime12h(newStart)} – ${formatTime12h(settings.deadHoursEndTime)}`;
                              setSettings({
                                ...settings,
                                deadHoursStartTime: newStart,
                                deadHoursTime: formatted,
                              });
                            }}
                            className="h-10 flex-1 rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-2.5 font-medium text-[#0A0A0B] text-[12.5px] focus:outline-none focus:border-[#0A0A0B] focus:bg-white transition-colors"
                          />
                          <span className="text-[#A1A1AA] text-[12px] font-bold shrink-0">to</span>
                          <input
                            type="time"
                            value={settings.deadHoursEndTime}
                            onChange={(e) => {
                              const newEnd = e.target.value;
                              const formatted = `${formatTime12h(settings.deadHoursStartTime)} – ${formatTime12h(newEnd)}`;
                              setSettings({
                                ...settings,
                                deadHoursEndTime: newEnd,
                                deadHoursTime: formatted,
                              });
                            }}
                            className="h-10 flex-1 rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-2.5 font-medium text-[#0A0A0B] text-[12.5px] focus:outline-none focus:border-[#0A0A0B] focus:bg-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSaveSettings}
                        className="rounded-lg bg-[#0A0A0B] px-4 py-2 text-[12px] font-bold text-white hover:bg-black/90 cursor-pointer shadow-xs"
                      >
                        Save Timing Changes
                      </button>
                    </div>
                  </div>

                  {/* NEW STANDALONE EXPLANATION BOX IN THE BOTTOM */}
                  <div className="rounded-xl border border-black/[0.06] bg-[#FAFAFA] p-4.5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 text-[#0A0A0B]">
                        <IconClock className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#0A0A0B]">
                          How Dead Hours Yield Management Works
                        </h4>
                        <p className="text-[11.5px] text-[#71717A]">
                          Increases revenue on idle café hours while protecting full-price weekend margins.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[12px]">
                      <div className="rounded-lg bg-white p-3.5 border border-black/[0.06] space-y-1.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0A0A0B] flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#D97706]" />
                            Slow Afternoon Target
                          </span>
                          <span className="rounded bg-[#FEF3C7] text-[#B45309] px-1.5 py-0.2 text-[10px] font-bold">
                            Active
                          </span>
                        </div>
                        <p className="text-[#52525B] text-[11.5px] leading-relaxed">
                          Win-back discount offers are valid exclusively during your selected downtime window ({settings.deadHoursDays}, {settings.deadHoursTime}). Regulars are motivated to visit when seats would otherwise sit empty.
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3.5 border border-black/[0.06] space-y-1.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0A0A0B] flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
                            Weekend Margin Shield
                          </span>
                          <span className="rounded bg-[#ECFDF5] text-[#047857] px-1.5 py-0.2 text-[10px] font-bold">
                            Protected
                          </span>
                        </div>
                        <p className="text-[#52525B] text-[11.5px] leading-relaxed">
                          Peak Friday dinner rush and all weekend shifts (Sat–Sun) are automatically locked. Revisit never offers discounts to customers who would happily pay full price during your busiest hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: GOOGLE MAPS REVIEWS */}
              {settingsTab === "google" && (
                <div className="space-y-4 max-w-[620px]">
                  <div className="rounded-xl bg-white p-5 border border-black/[0.06] shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[14.5px] font-bold text-[#0A0A0B]">
                          Google Maps Review Booster
                        </h3>
                        <p className="text-[12px] text-[#71717A]">
                          Automate 5-star ratings from your happiest regulars.
                        </p>
                      </div>

                      <span className="rounded-lg bg-[#ECFDF5] text-[#047857] px-2.5 py-1 text-[11px] font-bold">
                        Active
                      </span>
                    </div>

                    <div className="text-[12px] space-y-3">
                      <div>
                        <label className="text-[12px] font-bold text-[#0A0A0B] block mb-1.5">
                          Google Maps Direct Review Link
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={settings.googleMapsReviewUrl}
                            onChange={(e) =>
                              setSettings({ ...settings, googleMapsReviewUrl: e.target.value })
                            }
                            className="h-10 flex-1 rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-3 font-medium text-[#0A0A0B] text-[12.5px] focus:outline-none focus:border-[#0A0A0B] focus:bg-white transition-colors"
                          />
                          <button
                            onClick={() => window.open(settings.googleMapsReviewUrl, "_blank")}
                            className="h-10 rounded-lg border border-black/[0.1] px-3.5 font-bold text-[#52525B] hover:bg-black/5 shrink-0 cursor-pointer text-[12px]"
                          >
                            Test Link ↗
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[12px] font-bold text-[#0A0A0B] block mb-1.5">
                          Auto-Trigger Threshold
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-[#52525B] text-[12.5px]">Request rating after customer completes visit #</span>
                          <input
                            type="number"
                            min="2"
                            max="10"
                            value={settings.autoGoogleReviewTriggerVisits}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                autoGoogleReviewTriggerVisits: Number(e.target.value),
                              })
                            }
                            className="h-9 w-16 text-center rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-2 font-bold text-[#0A0A0B] text-[13px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSaveSettings}
                        className="rounded-lg bg-[#0A0A0B] px-4 py-2 text-[12px] font-bold text-white hover:bg-black/90 cursor-pointer shadow-xs"
                      >
                        Save Google Settings
                      </button>
                    </div>
                  </div>

                  {/* NEW STANDALONE EXPLANATION BOX IN THE BOTTOM */}
                  <div className="rounded-xl border border-black/[0.06] bg-[#FAFAFA] p-4.5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 text-[#0A0A0B]">
                        <IconStar className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#0A0A0B]">
                          How the Google Review Booster Works
                        </h4>
                        <p className="text-[11.5px] text-[#71717A]">
                          Builds unstoppable social proof on Google Maps with verified happy customers.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[12px]">
                      <div className="rounded-lg bg-white p-3.5 border border-black/[0.06] space-y-1.5 shadow-xs">
                        <span className="font-bold text-[#0A0A0B] block">
                          ⭐ Regulars-Only Shield
                        </span>
                        <p className="text-[#52525B] text-[11.5px] leading-relaxed">
                          Only guests who have visited {settings.autoGoogleReviewTriggerVisits}+ times are asked for a review. This completely protects your public rating from disgruntled one-off visitors.
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3.5 border border-black/[0.06] space-y-1.5 shadow-xs">
                        <span className="font-bold text-[#0A0A0B] block">
                          ⚡ Zero-Friction Deep Link
                        </span>
                        <p className="text-[#52525B] text-[11.5px] leading-relaxed">
                          The WhatsApp message contains your direct 5-star review modal link, opening the rating card on their phone in 1 click without needing to search your café on Maps.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: POS & OUTLET SETUP */}
              {settingsTab === "pos" && (
                <div className="space-y-4 max-w-[620px]">
                  <div className="rounded-xl bg-white p-5 border border-black/[0.06] shadow-xs space-y-4 text-[12px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[14.5px] font-bold text-[#0A0A0B]">Outlet & POS Connection</h3>
                        <p className="text-[#71717A] text-[12px]">Compatible with your existing counter billing setup.</p>
                      </div>
                      <span className="rounded-lg bg-[#ECFDF5] text-[#047857] px-2.5 py-1 text-[11px] font-bold">Connected</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[12px] font-bold text-[#0A0A0B] block mb-1.5">Café Name</label>
                        <input
                          type="text"
                          defaultValue="The Daily Brew"
                          className="h-10 w-full rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-3 font-medium text-[#0A0A0B] text-[12.5px]"
                        />
                      </div>

                      <div>
                        <label className="text-[12px] font-bold text-[#0A0A0B] block mb-1.5">Outlet Location</label>
                        <input
                          type="text"
                          defaultValue="100 Ft Road, Indiranagar, Bangalore"
                          className="h-10 w-full rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-3 font-medium text-[#0A0A0B] text-[12.5px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[12px] font-bold text-[#0A0A0B] block mb-1.5">Current Billing POS Software</label>
                      <select className="h-10 w-full rounded-lg border border-black/[0.1] bg-[#FAFAFA] px-3 font-medium text-[#0A0A0B] text-[12.5px] cursor-pointer">
                        <option>Petpooja (Most popular in India)</option>
                        <option>Posist / Restroworks</option>
                        <option>Pine Labs</option>
                        <option>DotPe</option>
                        <option>Toast / Square / Local POS</option>
                      </select>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSaveSettings}
                        className="rounded-lg bg-[#0A0A0B] px-4 py-2 text-[12px] font-bold text-white hover:bg-black/90 cursor-pointer shadow-xs"
                      >
                        Save POS Settings
                      </button>
                    </div>
                  </div>

                  {/* NEW STANDALONE EXPLANATION BOX IN THE BOTTOM */}
                  <div className="rounded-xl border border-black/[0.06] bg-[#FAFAFA] p-4.5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 text-[#0A0A0B]">
                        <IconStore className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#0A0A0B]">
                          How the Receipt Camera Bridge Works
                        </h4>
                        <p className="text-[11.5px] text-[#71717A]">
                          Zero hardware disruption, zero complex POS software changes.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[12px]">
                      <div className="rounded-lg bg-white p-3.5 border border-black/[0.06] space-y-1.5 shadow-xs">
                        <span className="font-bold text-[#0A0A0B] block">
                          📷 Works With Any POS
                        </span>
                        <p className="text-[#52525B] text-[11.5px] leading-relaxed">
                          You don&apos;t need custom API approvals from Petpooja or Posist. Cashiers print the standard receipt as usual and snap a 2-second photo.
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3.5 border border-black/[0.06] space-y-1.5 shadow-xs">
                        <span className="font-bold text-[#0A0A0B] block">
                          ⚡ Instant Line-Item OCR
                        </span>
                        <p className="text-[#52525B] text-[11.5px] leading-relaxed">
                          Optical character recognition extracts the bill subtotal, taxes, and ordered items to continuously learn each customer&apos;s favorite menu choices.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: WHATSAPP PREFERENCES */}
              {settingsTab === "whatsapp" && (
                <div className="space-y-4 max-w-[620px]">
                  <div className="rounded-xl bg-white p-5 border border-black/[0.06] shadow-xs space-y-4 text-[12px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[14.5px] font-bold text-[#0A0A0B]">WhatsApp Outreach Guardrails</h3>
                        <p className="text-[#71717A] text-[12px]">Protect your customer relationships from fatigue and spam.</p>
                      </div>
                      <span className="rounded-lg bg-[#ECFDF5] text-[#047857] px-2.5 py-1 text-[11px] font-bold">Protected</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="rounded-lg bg-[#FAFAFA] border border-black/[0.06] p-3">
                        <span className="text-[11px] text-[#71717A] block mb-0.5 font-medium">Delivery Mode</span>
                        <span className="font-bold text-[#0A0A0B] text-[12.5px] block">Manual Send (wa.me)</span>
                      </div>

                      <div className="rounded-lg bg-[#FAFAFA] border border-black/[0.06] p-3">
                        <span className="text-[11px] text-[#71717A] block mb-0.5 font-medium">Frequency Limit</span>
                        <span className="font-bold text-[#0A0A0B] text-[12.5px] block">Max 1 per 14 days</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSaveSettings}
                        className="rounded-lg bg-[#0A0A0B] px-4 py-2 text-[12px] font-bold text-white hover:bg-black/90 cursor-pointer shadow-xs"
                      >
                        Save Guardrails
                      </button>
                    </div>
                  </div>

                  {/* NEW STANDALONE EXPLANATION BOX IN THE BOTTOM */}
                  <div className="rounded-xl border border-black/[0.06] bg-[#FAFAFA] p-4.5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 text-[#0A0A0B]">
                        <IconWhatsApp className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#0A0A0B]">
                          How WhatsApp Guardrails Work
                        </h4>
                        <p className="text-[11.5px] text-[#71717A]">
                          100% compliant with WhatsApp terms with zero extra messaging costs.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[12px]">
                      <div className="rounded-lg bg-white p-3.5 border border-black/[0.06] space-y-1.5 shadow-xs">
                        <span className="font-bold text-[#0A0A0B] block">
                          💬 Zero Meta Utility Fees
                        </span>
                        <p className="text-[#52525B] text-[11.5px] leading-relaxed">
                          By launching chats directly through your device via wa.me, you skip expensive Meta Cloud API per-conversation charges and template verification rejections.
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3.5 border border-black/[0.06] space-y-1.5 shadow-xs">
                        <span className="font-bold text-[#0A0A0B] block">
                          🛡️ Anti-Fatigue Capping
                        </span>
                        <p className="text-[#52525B] text-[11.5px] leading-relaxed">
                          Revisit automatically blocks duplicate outreach to the same guest within a 14-day window. Your regulars feel valued rather than spammed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* 5. CUSTOMERS DIRECTORY VIEW                                           */}
          {/* ===================================================================== */}
          {activeNav === "customers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5">
                <div>
                  <h1 className="text-[18px] sm:text-[22px] font-bold tracking-tight text-[#0A0A0B]">
                    Customer Directory
                  </h1>
                  <p className="text-[12px] text-[#71717A]">
                    Every regular remembered with visit history and rule qualification.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#0A0A0B]">
                  {customers.length} Profiles
                </span>
              </div>

              <div className="rounded-xl bg-white border border-black/[0.06] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[12px]">
                    <thead className="bg-[#FAFAFA] border-b border-black/[0.06] text-[#71717A] text-[10.5px] uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3 font-bold">Customer</th>
                        <th className="py-2.5 px-3 font-bold">Visits</th>
                        <th className="py-2.5 px-3 font-bold">Spent</th>
                        <th className="py-2.5 px-3 font-bold">Frequency</th>
                        <th className="py-2.5 px-3 font-bold">Last Visit</th>
                        <th className="py-2.5 px-3 font-bold">Rule Match</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04]">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-[#FAFAFA] transition-colors">
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-[#0A0A0B]">{c.name}</p>
                            <p className="tabular text-[10.5px] text-[#71717A]">{c.phone}</p>
                          </td>
                          <td className="py-2.5 px-3 tabular font-bold">{c.visits}</td>
                          <td className="py-2.5 px-3 tabular font-semibold text-[#0A0A0B]">
                            ₹{c.totalSpent.toLocaleString("en-IN")}
                          </td>
                          <td className="py-2.5 px-3 text-[#71717A]">Every {c.usualGapDays}d</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                                c.isOverdue
                                  ? "bg-[#FEF2F2] text-[#DC2626]"
                                  : "bg-[#ECFDF5] text-[#047857]"
                              }`}
                            >
                              {c.lastVisitDaysAgo === 0 ? "Today" : `${c.lastVisitDaysAgo}d ago`}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="rounded bg-[#ECFDF5] px-1.5 py-0.2 text-[10px] font-bold text-[#047857]">
                              {c.visits >= 5 ? "5th Visit Milestone" : "Overdue Regular"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* 6. BUSINESS IMPACT & ATTRIBUTION                                      */}
          {/* ===================================================================== */}
          {activeNav === "impact" && (
            <div className="space-y-4">
              <div className="border-b border-black/[0.06] pb-2.5">
                <h1 className="text-[18px] sm:text-[22px] font-bold tracking-tight text-[#0A0A0B]">
                  Business Impact
                </h1>
                <p className="text-[12px] text-[#71717A]">
                  Repeat revenue tracked directly through Revisit retention.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-white p-4 border border-black/[0.06] shadow-xs">
                  <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                    Attributed Repeat Revenue
                  </p>
                  <p className="mt-1 text-[22px] sm:text-[26px] font-bold text-[#0A0A0B] tabular">₹18,740</p>
                  <p className="text-[11px] text-[#047857] font-semibold mt-0.5">
                    ↑ Directly from returning regulars
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 border border-black/[0.06] shadow-xs">
                  <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                    Reward ROI
                  </p>
                  <p className="mt-1 text-[22px] sm:text-[26px] font-bold text-[#0A0A0B] tabular">6.0x ROI</p>
                  <p className="text-[11px] text-[#71717A] mt-0.5">
                    ₹3,100 discounts generated ₹18,740
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 border border-black/[0.06] shadow-xs">
                  <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                    Repeat Rate
                  </p>
                  <p className="mt-1 text-[22px] sm:text-[26px] font-bold text-[#0A0A0B] tabular">38.4%</p>
                  <p className="text-[11px] text-[#047857] font-semibold mt-0.5">
                    +11% vs industry benchmark
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 4. MOBILE APP BOTTOM NAVIGATION BAR (PURE REAL APP VIEW)                  */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-black/[0.08] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-1 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        <div className="grid grid-cols-6 max-w-md mx-auto items-center">
          {/* 1. Counter */}
          <button
            onClick={() => setActiveNav("counter")}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              activeNav === "counter"
                ? "text-[#0A0A0B]"
                : "text-[#71717A] hover:text-[#0A0A0B]"
            }`}
          >
            <div
              className={`flex items-center justify-center h-6 w-6 transition-transform ${
                activeNav === "counter" ? "scale-110" : ""
              }`}
            >
              <IconCamera className="h-5 w-5" />
            </div>
            <span
              className={`text-[9.5px] tracking-tight mt-0.5 ${
                activeNav === "counter" ? "font-bold text-[#0A0A0B]" : "font-medium"
              }`}
            >
              Counter
            </span>
            {activeNav === "counter" && (
              <span className="absolute bottom-0 h-0.5 w-4 rounded-full bg-[#0A0A0B]" />
            )}
          </button>

          {/* 2. Offer Rules */}
          <button
            onClick={() => setActiveNav("rules")}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              activeNav === "rules"
                ? "text-[#0A0A0B]"
                : "text-[#71717A] hover:text-[#0A0A0B]"
            }`}
          >
            <div
              className={`relative flex items-center justify-center h-6 w-6 transition-transform ${
                activeNav === "rules" ? "scale-110" : ""
              }`}
            >
              <IconGift className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 px-0.5 items-center justify-center rounded-full bg-[#0A0A0B] text-white text-[8px] font-bold">
                {offerRules.filter((r) => r.isActive).length}
              </span>
            </div>
            <span
              className={`text-[9.5px] tracking-tight mt-0.5 ${
                activeNav === "rules" ? "font-bold text-[#0A0A0B]" : "font-medium"
              }`}
            >
              Rules
            </span>
            {activeNav === "rules" && (
              <span className="absolute bottom-0 h-0.5 w-4 rounded-full bg-[#0A0A0B]" />
            )}
          </button>

          {/* 3. Bring Them Back */}
          <button
            onClick={() => setActiveNav("retention")}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              activeNav === "retention"
                ? "text-[#16A34A]"
                : "text-[#71717A] hover:text-[#0A0A0B]"
            }`}
          >
            <div
              className={`relative flex items-center justify-center h-6 w-6 transition-transform ${
                activeNav === "retention" ? "scale-110" : ""
              }`}
            >
              <IconWhatsApp className="h-5 w-5 text-[#16A34A]" />
              {customers.some((c) => c.isOverdue && !c.returned) && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-white animate-pulse" />
              )}
            </div>
            <span
              className={`text-[9.5px] tracking-tight mt-0.5 ${
                activeNav === "retention" ? "font-bold text-[#16A34A]" : "font-medium"
              }`}
            >
              Outreach
            </span>
            {activeNav === "retention" && (
              <span className="absolute bottom-0 h-0.5 w-4 rounded-full bg-[#16A34A]" />
            )}
          </button>

          {/* 4. Customers */}
          <button
            onClick={() => setActiveNav("customers")}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              activeNav === "customers"
                ? "text-[#0A0A0B]"
                : "text-[#71717A] hover:text-[#0A0A0B]"
            }`}
          >
            <div
              className={`flex items-center justify-center h-6 w-6 transition-transform ${
                activeNav === "customers" ? "scale-110" : ""
              }`}
            >
              <IconUsers className="h-5 w-5" />
            </div>
            <span
              className={`text-[9.5px] tracking-tight mt-0.5 ${
                activeNav === "customers" ? "font-bold text-[#0A0A0B]" : "font-medium"
              }`}
            >
              Guests
            </span>
            {activeNav === "customers" && (
              <span className="absolute bottom-0 h-0.5 w-4 rounded-full bg-[#0A0A0B]" />
            )}
          </button>

          {/* 5. Impact */}
          <button
            onClick={() => setActiveNav("impact")}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              activeNav === "impact"
                ? "text-[#0A0A0B]"
                : "text-[#71717A] hover:text-[#0A0A0B]"
            }`}
          >
            <div
              className={`flex items-center justify-center h-6 w-6 transition-transform ${
                activeNav === "impact" ? "scale-110" : ""
              }`}
            >
              <IconTrendingUp className="h-5 w-5" />
            </div>
            <span
              className={`text-[9.5px] tracking-tight mt-0.5 ${
                activeNav === "impact" ? "font-bold text-[#0A0A0B]" : "font-medium"
              }`}
            >
              Impact
            </span>
            {activeNav === "impact" && (
              <span className="absolute bottom-0 h-0.5 w-4 rounded-full bg-[#0A0A0B]" />
            )}
          </button>

          {/* 6. Settings */}
          <button
            onClick={() => setActiveNav("settings")}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              activeNav === "settings"
                ? "text-[#0A0A0B]"
                : "text-[#71717A] hover:text-[#0A0A0B]"
            }`}
          >
            <div
              className={`flex items-center justify-center h-6 w-6 transition-transform ${
                activeNav === "settings" ? "scale-110" : ""
              }`}
            >
              <IconSettings className="h-5 w-5" />
            </div>
            <span
              className={`text-[9.5px] tracking-tight mt-0.5 ${
                activeNav === "settings" ? "font-bold text-[#0A0A0B]" : "font-medium"
              }`}
            >
              Settings
            </span>
            {activeNav === "settings" && (
              <span className="absolute bottom-0 h-0.5 w-4 rounded-full bg-[#0A0A0B]" />
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}
