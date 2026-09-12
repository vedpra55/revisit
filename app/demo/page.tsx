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
} from "../components/Icons";
import { Customer, OfferRule, TriggerType, RewardType } from "./types";
import { INITIAL_CUSTOMERS, INITIAL_OFFER_RULES } from "./mockData";

export default function DemoPage() {
  // Active Sidebar Section: 'counter' | 'rules' | 'retention' | 'customers' | 'impact'
  const [activeNav, setActiveNav] = useState<
    "counter" | "rules" | "retention" | "customers" | "impact"
  >("counter");

  // Global demo state
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [offerRules, setOfferRules] = useState<OfferRule[]>(INITIAL_OFFER_RULES);

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
  const [retentionMessage, setRetentionMessage] = useState<string>(
    INITIAL_CUSTOMERS[0].defaultMessage
  );
  const [simulatedReturnNotice, setSimulatedReturnNotice] = useState<string | null>(null);

  // Customer resolution in Counter
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
    // Check milestone rules
    const milestoneRule = offerRules.find(
      (r) => r.isActive && r.triggerType === "visits_milestone" && activeCustomer.visits >= r.triggerValue
    );
    if (milestoneRule) return milestoneRule;

    // Check overdue rules
    if (activeCustomer.isOverdue) {
      const overdueRule = offerRules.find(
        (r) => r.isActive && r.triggerType === "days_overdue"
      );
      if (overdueRule) return overdueRule;
    }

    // Default active rule
    return offerRules.find((r) => r.isActive) || null;
  }, [activeCustomer, offerRules]);

  // Active customer in Retention
  const activeRetentionCustomer = useMemo(() => {
    return customers.find((c) => c.id === activeRetentionId) || customers[0];
  }, [customers, activeRetentionId]);

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

  // Reset Counter to step 1
  const handleResetCounter = () => {
    setCounterStep(1);
    setOcrCompleted(false);
    setIsCapturing(false);
    setIsRewardAppliedInPos(true);
  };

  // WhatsApp open trigger
  const handleOpenWhatsApp = () => {
    const rawNumber = activeRetentionCustomer.phone.replace(/[^0-9]/g, "");
    const encoded = encodeURIComponent(retentionMessage);
    const url = `https://wa.me/${rawNumber}?text=${encoded}`;
    window.open(url, "_blank");
  };

  // Simulate customer return
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
      `✓ Repeat visit recorded! ${activeRetentionCustomer.name} returned 2 days after receiving WhatsApp and spent ₹${netPaid}.`
    );

    setTimeout(() => {
      setSimulatedReturnNotice(null);
    }, 7000);
  };

  // Toggle Offer Rule Active/Inactive
  const handleToggleRule = (ruleId: string) => {
    setOfferRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  // Create new rule
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

  // Reset entire demo
  const handleFullReset = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setOfferRules(INITIAL_OFFER_RULES);
    setPhoneInput("+91 98765 43210");
    setSelectedCustomerId("c1");
    setCounterStep(1);
    setOcrCompleted(false);
    setIsCapturing(false);
    setIsRewardAppliedInPos(true);
    setActiveRetentionId("c1");
    setRetentionMessage(INITIAL_CUSTOMERS[0].defaultMessage);
    setSimulatedReturnNotice(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0A0A0B] flex flex-col md:flex-row selection:bg-[#0A0A0B] selection:text-white font-sans">
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR (CLEAN, ICON-DRIVEN, INSPIRATION DNA)                       */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-[240px] shrink-0 border-r border-black/[0.06] bg-white flex flex-col justify-between p-4 md:p-5 md:min-h-screen">
        <div>
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[18px] font-bold tracking-tight text-[#0A0A0B] hover:opacity-80 transition-opacity mb-8"
          >
            <IconLogo className="h-7 w-7" />
            <span>revisit</span>
          </Link>

          {/* Café Outlet Tag */}
          <div className="mb-6 rounded-xl bg-[#FAFAFA] border border-black/[0.06] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-bold text-[#0A0A0B]">The Daily Brew</p>
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            </div>
            <p className="text-[11.5px] text-[#71717A] mt-0.5">Indiranagar Outlet</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-[13.5px] font-semibold">
            <button
              onClick={() => setActiveNav("counter")}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all text-left cursor-pointer ${
                activeNav === "counter"
                  ? "bg-[#0A0A0B] text-white shadow-xs"
                  : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0B]"
              }`}
            >
              <IconCamera className="h-4 w-4 shrink-0" />
              <span>At the counter</span>
            </button>

            <button
              onClick={() => setActiveNav("rules")}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all text-left cursor-pointer ${
                activeNav === "rules"
                  ? "bg-[#0A0A0B] text-white shadow-xs"
                  : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0B]"
              }`}
            >
              <div className="flex items-center gap-3">
                <IconGift className="h-4 w-4 shrink-0" />
                <span>Offer rules</span>
              </div>
              <span
                className={`text-[10.5px] px-1.5 py-0.2 rounded-md ${
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
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all text-left cursor-pointer ${
                activeNav === "retention"
                  ? "bg-[#0A0A0B] text-white shadow-xs"
                  : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0B]"
              }`}
            >
              <div className="flex items-center gap-3">
                <IconWhatsApp className="h-4 w-4 shrink-0 text-[#16A34A]" />
                <span>Bring them back</span>
              </div>
              {customers.some((c) => c.isOverdue && !c.returned) && (
                <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
              )}
            </button>

            <button
              onClick={() => setActiveNav("customers")}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all text-left cursor-pointer ${
                activeNav === "customers"
                  ? "bg-[#0A0A0B] text-white shadow-xs"
                  : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0B]"
              }`}
            >
              <IconUsers className="h-4 w-4 shrink-0" />
              <span>Customers ({customers.length})</span>
            </button>

            <button
              onClick={() => setActiveNav("impact")}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all text-left cursor-pointer ${
                activeNav === "impact"
                  ? "bg-[#0A0A0B] text-white shadow-xs"
                  : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0B]"
              }`}
            >
              <IconTrendingUp className="h-4 w-4 shrink-0" />
              <span>Business impact</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-black/[0.06]">
          <div className="flex items-center justify-between text-[11.5px] text-[#71717A]">
            <span className="flex items-center gap-1.5 font-medium text-[#047857]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Demo Mode
            </span>
            <button
              onClick={handleFullReset}
              className="text-[#71717A] hover:text-[#0A0A0B] underline cursor-pointer"
            >
              Reset demo
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT WORKSPACE                                                    */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Breadcrumb Bar */}
        <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-[#71717A]">Revisit Demo</span>
            <span className="text-[#D4D4D8]">/</span>
            <span className="font-bold text-[#0A0A0B] capitalize">
              {activeNav === "counter"
                ? "At the counter (10s Cashier Flow)"
                : activeNav === "rules"
                ? "Offer rules (Automated Retention Triggers)"
                : activeNav === "retention"
                ? "Customers to bring back (Daily WhatsApp Queue)"
                : activeNav === "customers"
                ? "Customer Directory"
                : "Business Impact & Attribution"}
            </span>
          </div>

          <Link
            href="/"
            className="text-[12.5px] font-medium text-[#71717A] hover:text-[#0A0A0B] transition-colors"
          >
            ← Back to website
          </Link>
        </header>

        {/* Content View Router */}
        <main className="flex-1 p-5 sm:p-8 max-w-[1180px] w-full mx-auto">
          {/* ===================================================================== */}
          {/* 1. AT THE COUNTER VIEW                                                */}
          {/* ===================================================================== */}
          {activeNav === "counter" && (
            <div className="mx-auto max-w-[720px]">
              {/* Step indicator */}
              <div className="mb-6 flex items-center justify-between border-b border-black/[0.06] pb-3">
                <div className="flex items-center gap-2 text-[13px] font-semibold">
                  <span
                    className={`px-3 py-1 rounded-full ${
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
                    className={`px-3 py-1 rounded-full ${
                      counterStep === 2
                        ? "bg-[#0A0A0B] text-white"
                        : counterStep > 2
                        ? "bg-[#ECFDF5] text-[#047857]"
                        : "text-[#A1A1AA]"
                    }`}
                  >
                    {counterStep > 2 ? "✓ 2" : "2"} Rule reward
                  </span>
                  <span className="text-[#D4D4D8]">→</span>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      counterStep === 3
                        ? "bg-[#0A0A0B] text-white"
                        : counterStep > 3
                        ? "bg-[#ECFDF5] text-[#047857]"
                        : "text-[#A1A1AA]"
                    }`}
                  >
                    {counterStep > 3 ? "✓ 3" : "3"} Snap bill
                  </span>
                </div>

                {counterStep > 1 && counterStep < 4 && (
                  <button
                    onClick={() => setCounterStep((prev) => (prev - 1) as 1 | 2 | 3)}
                    className="text-[12px] font-medium text-[#71717A] hover:text-[#0A0A0B]"
                  >
                    ← Back
                  </button>
                )}
              </div>

              {/* Step 1: Phone Search */}
              {counterStep === 1 && (
                <div className="rounded-[24px] bg-white p-6 sm:p-8 border border-black/[0.06] shadow-xs animate-in fade-in duration-200">
                  <div className="text-center max-w-[420px] mx-auto">
                    <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                      Step 1 · Counter Greeting
                    </p>
                    <h2 className="mt-1 text-[23px] font-bold tracking-tight text-[#0A0A0B]">
                      &quot;Phone number, please?&quot;
                    </h2>
                    <p className="mt-1 text-[13px] text-[#71717A]">
                      Staff searches customer to check for active offer rules.
                    </p>

                    <div className="mt-6 rounded-2xl border-2 border-black/[0.08] bg-[#FAFAFA] px-4 py-3.5 focus-within:border-[#0A0A0B] focus-within:bg-white transition-all">
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full text-center text-[22px] font-bold tracking-wider text-[#0A0A0B] focus:outline-none tabular"
                      />
                    </div>

                    {/* Quick sample buttons */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap text-[11.5px]">
                      <span className="text-[#71717A]">Try customer:</span>
                      <button
                        onClick={() => {
                          setPhoneInput(customers[0].phone);
                          setSelectedCustomerId(customers[0].id);
                        }}
                        className="rounded-lg bg-[#FAFAFA] border border-black/[0.08] px-2.5 py-1 font-semibold text-[#0A0A0B] hover:bg-[#F4F4F5]"
                      >
                        Rahul (8 visits)
                      </button>
                      <button
                        onClick={() => {
                          setPhoneInput(customers[1].phone);
                          setSelectedCustomerId(customers[1].id);
                        }}
                        className="rounded-lg bg-[#FAFAFA] border border-black/[0.08] px-2.5 py-1 font-semibold text-[#0A0A0B] hover:bg-[#F4F4F5]"
                      >
                        Aman (5 visits)
                      </button>
                    </div>

                    {/* Numeric keypad */}
                    <div className="mt-6 grid grid-cols-3 gap-2.5 max-w-[270px] mx-auto">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((key) => (
                        <button
                          key={key}
                          onClick={() => handleKeypadPress(key)}
                          className="h-11 rounded-xl bg-[#F8F9FA] text-[16px] font-bold text-[#0A0A0B] hover:bg-[#F1F3F5] active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-black/[0.04]"
                        >
                          {key}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCounterStep(2)}
                      className="mt-6 w-full max-w-[320px] rounded-xl bg-[#0A0A0B] py-3 text-[14px] font-bold text-white hover:bg-black/90 transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
                    >
                      <span>Check customer rules</span>
                      <IconArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Instant Rule Recognition */}
              {counterStep === 2 && (
                <div className="rounded-[24px] bg-white p-6 sm:p-8 border border-black/[0.06] shadow-xs animate-in fade-in duration-200">
                  <div>
                    <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                      Step 2 · Offer Rule Triggered
                    </p>
                    <h2 className="mt-1 text-[23px] font-bold tracking-tight text-[#0A0A0B]">
                      Customer Recognized
                    </h2>
                    <p className="mt-1 text-[13px] text-[#71717A]">
                      Revisit automatically evaluated active offer rules for {activeCustomer.name}.
                    </p>
                  </div>

                  {/* Customer Snapshot */}
                  <div className="mt-5 rounded-2xl bg-[#FAFAFA] border border-black/[0.06] p-4 sm:p-5">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A0A0B] text-white font-bold text-[16px]">
                          {activeCustomer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[15px] font-bold text-[#0A0A0B]">
                              {activeCustomer.name}
                            </p>
                            <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10.5px] font-bold text-[#047857]">
                              {activeCustomer.status}
                            </span>
                          </div>
                          <p className="tabular text-[12px] text-[#71717A]">
                            {activeCustomer.phone}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="rounded-full bg-[#FEF2F2] px-2 py-0.5 text-[11.5px] font-bold text-[#DC2626]">
                          {activeCustomer.lastVisitDaysAgo === 0
                            ? "Visited today"
                            : `${activeCustomer.lastVisitDaysAgo} days ago`}
                        </span>
                        <p className="text-[11px] text-[#71717A] mt-0.5">
                          Usual cycle: {activeCustomer.usualGapDays} days
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 divide-x divide-black/[0.06] text-center text-[12.5px]">
                      <div>
                        <p className="tabular font-bold text-[#0A0A0B]">{activeCustomer.visits}</p>
                        <p className="text-[11px] text-[#71717A]">visits</p>
                      </div>
                      <div>
                        <p className="tabular font-bold text-[#0A0A0B]">
                          ₹{activeCustomer.totalSpent.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[11px] text-[#71717A]">total spend</p>
                      </div>
                      <div>
                        <p className="font-bold text-[#0A0A0B]">{activeCustomer.favoriteItem}</p>
                        <p className="text-[11px] text-[#71717A]">favorite</p>
                      </div>
                    </div>
                  </div>

                  {/* Active Offer Rule Banner */}
                  <div className="mt-5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[#047857]">
                          <IconGift className="h-5 w-5" />
                          <span className="text-[17px] font-bold">
                            ₹{matchedRuleForActiveCustomer?.rewardValue || 100} Reward Available
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-[#065F46]">
                          Rule Triggered: <strong>{matchedRuleForActiveCustomer?.name || "Visit Milestone"}</strong>
                          {" · "}Min bill ₹{matchedRuleForActiveCustomer?.minBill || 350}
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#047857] border border-[#047857]/20">
                        Active Rule
                      </span>
                    </div>

                    {/* POS Instruction */}
                    <div className="mt-4 rounded-xl bg-white p-4 border border-[#047857]/15">
                      <p className="text-[12px] font-bold text-[#0A0A0B] uppercase tracking-wider">
                        Cashier Instruction:
                      </p>
                      <p className="text-[13.5px] text-[#52525B] mt-0.5">
                        Punch <strong className="text-[#0A0A0B]">₹{matchedRuleForActiveCustomer?.rewardValue || 100} discount</strong> in your current POS machine (Petpooja / Toast / Square) on this bill.
                      </p>

                      <div className="mt-3 flex items-center gap-2.5">
                        <button
                          onClick={() => setIsRewardAppliedInPos(true)}
                          className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all cursor-pointer ${
                            isRewardAppliedInPos
                              ? "bg-[#047857] text-white"
                              : "bg-[#FAFAFA] border border-black/[0.08] text-[#71717A]"
                          }`}
                        >
                          ✓ Discount Applied in POS
                        </button>
                        <button
                          onClick={() => setIsRewardAppliedInPos(false)}
                          className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all cursor-pointer ${
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

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setCounterStep(3)}
                      className="rounded-xl bg-[#0A0A0B] px-6 py-3 text-[14px] font-bold text-white hover:bg-black/90 transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
                    >
                      <span>Proceed to bill capture</span>
                      <IconArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Camera & OCR Viewfinder */}
              {counterStep === 3 && (
                <div className="rounded-[24px] bg-white p-6 sm:p-8 border border-black/[0.06] shadow-xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                        Step 3 · Receipt Capture
                      </p>
                      <h2 className="mt-1 text-[23px] font-bold tracking-tight text-[#0A0A0B]">
                        Snap the printed POS bill
                      </h2>
                    </div>
                    <span className="rounded-full bg-[#FAFAFA] border border-black/[0.08] px-2.5 py-0.5 text-[11.5px] font-medium text-[#71717A]">
                      {activeCustomer.name}
                    </span>
                  </div>

                  {/* Viewfinder */}
                  <div className="mt-5 relative rounded-2xl bg-[#18181B] p-5 text-white overflow-hidden shadow-inner">
                    {/* Corner Guides */}
                    <div className="absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-white/60" />
                    <div className="absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-white/60" />
                    <div className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-white/60" />
                    <div className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-white/60" />

                    {isCapturing && (
                      <div className="absolute inset-x-0 top-0 h-1 bg-[#22C55E] shadow-[0_0_15px_#22C55E] animate-bounce z-20" />
                    )}

                    {/* Receipt mockup */}
                    <div className="mx-auto max-w-[320px] rounded-xl bg-white p-4 text-[#0A0A0B] shadow-2xl font-mono text-[12px]">
                      <div className="text-center border-b border-dashed border-black/20 pb-2.5">
                        <p className="font-bold text-[13.5px] font-sans">THE DAILY BREW</p>
                        <p className="text-[10.5px] text-[#71717A] font-sans">INDIRANAGAR, BANGALORE</p>
                        <p className="text-[10.5px] text-[#71717A] mt-0.5">Receipt #2841 · Today, 7:32 PM</p>
                      </div>

                      <div className="py-2.5 space-y-1.5 border-b border-dashed border-black/20">
                        <div className="flex justify-between">
                          <span>1x Cold Coffee</span>
                          <span className="font-bold">₹220.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1x Paneer Wrap</span>
                          <span className="font-bold">₹200.00</span>
                        </div>
                        <div className="flex justify-between text-[#71717A] pt-1 text-[11px]">
                          <span>Subtotal</span>
                          <span>₹420.00</span>
                        </div>
                        {isRewardAppliedInPos && (
                          <div className="flex justify-between text-[#047857] font-semibold">
                            <span>Revisit Reward</span>
                            <span>-₹{matchedRuleForActiveCustomer?.rewardValue || 100}.00</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2.5 flex justify-between text-[14px] font-bold">
                        <span>TOTAL PAID:</span>
                        <span>
                          ₹
                          {isRewardAppliedInPos
                            ? 420 - Number(matchedRuleForActiveCustomer?.rewardValue || 100)
                            : 420}
                          .00
                        </span>
                      </div>
                    </div>

                    {/* Shutter control */}
                    <div className="mt-5 flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-[12px] text-white/70">
                        <span
                          className={`h-2 w-2 rounded-full ${
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
                          className="rounded-full bg-white px-5 py-2 text-[13px] font-bold text-[#0A0A0B] hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                        >
                          <IconCamera className="h-4 w-4" />
                          <span>{isCapturing ? "Scanning..." : "📸 Snap Bill"}</span>
                        </button>
                      ) : (
                        <span className="rounded-full bg-[#22C55E]/20 text-[#22C55E] px-3 py-1 text-[11.5px] font-bold">
                          ✓ Receipt Processed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* OCR Parsed Card */}
                  {ocrCompleted && (
                    <div className="mt-5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] p-4 text-[#166534] animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-[13.5px]">
                          <IconCheck className="h-4 w-4 text-[#16A34A]" />
                          <span>OCR Extracted 2 Items:</span>
                        </div>
                        <span className="text-[11.5px] text-[#15803D]">1.2s OCR time</span>
                      </div>

                      <div className="mt-2 grid grid-cols-3 gap-2 text-[12px] bg-white rounded-xl p-3 border border-[#BBF7D0]">
                        <div>
                          <p className="text-[#71717A] text-[11px]">Items</p>
                          <p className="font-bold text-[#0A0A0B]">Cold Coffee, Paneer Wrap</p>
                        </div>
                        <div>
                          <p className="text-[#71717A] text-[11px]">Net Paid</p>
                          <p className="font-bold text-[#0A0A0B]">
                            ₹
                            {isRewardAppliedInPos
                              ? 420 - Number(matchedRuleForActiveCustomer?.rewardValue || 100)
                              : 420}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#71717A] text-[11px]">Attached To</p>
                          <p className="font-bold text-[#0A0A0B]">{activeCustomer.name}</p>
                        </div>
                      </div>

                      <button
                        onClick={handleConfirmSaveVisit}
                        className="mt-4 w-full rounded-xl bg-[#0A0A0B] py-3 text-[14px] font-bold text-white hover:bg-black/90 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                      >
                        <span>Confirm & Save Visit</span>
                        <IconArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Complete */}
              {counterStep === 4 && (
                <div className="rounded-[24px] bg-white p-6 sm:p-8 border border-black/[0.06] shadow-xs text-center animate-in fade-in duration-200">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF5] text-[#047857]">
                    <IconCheck className="h-6 w-6" />
                  </div>

                  <h2 className="mt-3 text-[22px] font-bold tracking-tight text-[#0A0A0B]">
                    Visit recorded in 8 seconds!
                  </h2>
                  <p className="mt-1 text-[13.5px] text-[#71717A]">
                    Receipt OCR linked this order to {activeCustomer.name}&apos;s profile automatically.
                  </p>

                  <div className="mt-5 rounded-2xl bg-[#FAFAFA] border border-black/[0.06] p-4 max-w-[420px] mx-auto text-left">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5">
                      <div>
                        <p className="text-[14.5px] font-bold text-[#0A0A0B]">{activeCustomer.name}</p>
                        <p className="tabular text-[12px] text-[#71717A]">{activeCustomer.phone}</p>
                      </div>
                      <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10.5px] font-bold text-[#047857]">
                        Updated Just Now
                      </span>
                    </div>

                    <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-[12px]">
                      <div>
                        <p className="tabular font-bold text-[15px] text-[#0A0A0B]">{activeCustomer.visits}</p>
                        <p className="text-[#71717A] text-[11px]">visits (+1)</p>
                      </div>
                      <div>
                        <p className="tabular font-bold text-[15px] text-[#0A0A0B]">
                          ₹{activeCustomer.totalSpent.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[#71717A] text-[11px]">total spend</p>
                      </div>
                      <div>
                        <p className="font-bold text-[13.5px] text-[#047857]">Healthy</p>
                        <p className="text-[#71717A] text-[11px]">status</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleResetCounter}
                      className="w-full sm:w-auto rounded-xl border border-black/[0.1] bg-white px-5 py-2.5 text-[13px] font-bold text-[#0A0A0B] hover:bg-black/5 transition-all cursor-pointer"
                    >
                      + Next Customer
                    </button>
                    <button
                      onClick={() => setActiveNav("retention")}
                      className="w-full sm:w-auto rounded-xl bg-[#0A0A0B] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-black/90 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>See Owner WhatsApp Queue</span>
                      <IconArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* 2. OFFER RULES ENGINE VIEW (NEW FEATURE REQUESTED BY USER)             */}
          {/* ===================================================================== */}
          {activeNav === "rules" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
                <div>
                  <h1 className="text-[22px] sm:text-[24px] font-bold tracking-tight text-[#0A0A0B]">
                    Offer & Retention Rules
                  </h1>
                  <p className="text-[13.5px] text-[#71717A]">
                    Define when customer rewards trigger automatically (e.g. &quot;On 5th visit → ₹100 OFF&quot;).
                  </p>
                </div>

                <button
                  onClick={() => setIsCreateRuleOpen(true)}
                  className="rounded-xl bg-[#0A0A0B] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-black/85 transition-all flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  <span>+ Create Custom Offer Rule</span>
                </button>
              </div>

              {/* Rules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offerRules.map((rule) => {
                  // Count matching customers for this rule
                  const matchingCustomersCount = customers.filter((c) => {
                    if (rule.triggerType === "visits_milestone") return c.visits >= rule.triggerValue;
                    if (rule.triggerType === "days_overdue") return c.isOverdue;
                    if (rule.triggerType === "total_spend") return c.totalSpent >= rule.triggerValue;
                    return false;
                  }).length;

                  return (
                    <div
                      key={rule.id}
                      className={`rounded-[22px] bg-white p-5 border transition-all ${
                        rule.isActive
                          ? "border-black/[0.08] shadow-xs"
                          : "border-black/[0.04] opacity-60 bg-[#FAFAFA]"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-[16px] font-bold text-[#0A0A0B]">{rule.name}</h3>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                rule.isActive
                                  ? "bg-[#ECFDF5] text-[#047857]"
                                  : "bg-[#F4F4F5] text-[#71717A]"
                              }`}
                            >
                              {rule.isActive ? "Active" : "Paused"}
                            </span>
                          </div>
                          <p className="text-[13px] text-[#52525B] mt-1">{rule.description}</p>
                        </div>

                        <button
                          onClick={() => handleToggleRule(rule.id)}
                          className={`text-[12px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                            rule.isActive
                              ? "border-[#047857]/30 text-[#047857] hover:bg-[#ECFDF5]"
                              : "border-black/[0.1] text-[#71717A] hover:bg-black/5"
                          }`}
                        >
                          {rule.isActive ? "Turn Off" : "Turn On"}
                        </button>
                      </div>

                      {/* Rule Parameters */}
                      <div className="mt-4 grid grid-cols-3 gap-2 bg-[#FAFAFA] rounded-xl p-3 text-[12px]">
                        <div>
                          <p className="text-[#71717A] text-[11px]">Trigger</p>
                          <p className="font-bold text-[#0A0A0B]">
                            {rule.triggerType === "visits_milestone"
                              ? `${rule.triggerValue} visits`
                              : rule.triggerType === "days_overdue"
                              ? `${rule.triggerValue}d overdue`
                              : `Spend > ₹${rule.triggerValue}`}
                          </p>
                        </div>

                        <div>
                          <p className="text-[#71717A] text-[11px]">Reward</p>
                          <p className="font-bold text-[#047857]">
                            {rule.rewardType === "percent_discount"
                              ? `${rule.rewardValue}% OFF`
                              : `₹${rule.rewardValue} OFF`}
                          </p>
                        </div>

                        <div>
                          <p className="text-[#71717A] text-[11px]">Guardrail</p>
                          <p className="font-bold text-[#0A0A0B]">Min ₹{rule.minBill}</p>
                        </div>
                      </div>

                      <div className="mt-3.5 flex items-center justify-between text-[12px] text-[#71717A] border-t border-black/[0.04] pt-2.5">
                        <span>Valid for {rule.expiryDays} days</span>
                        <span className="font-semibold text-[#0A0A0B]">
                          {matchingCustomersCount} customer{matchingCustomersCount !== 1 ? "s" : ""} qualify
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Create Rule Modal */}
              {isCreateRuleOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                  <div className="w-full max-w-[500px] rounded-[24px] bg-white p-6 shadow-2xl border border-black/[0.08]">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                      <div>
                        <h3 className="text-[17px] font-bold text-[#0A0A0B]">
                          Create New Offer Rule
                        </h3>
                        <p className="text-[12px] text-[#71717A]">
                          Set automated conditions to reward regular customers.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsCreateRuleOpen(false)}
                        className="text-[#71717A] hover:text-[#0A0A0B] text-[16px] font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveNewRule} className="mt-4 space-y-4 text-[13px]">
                      {/* Rule Name */}
                      <div>
                        <label className="font-bold text-[#0A0A0B] block mb-1">Rule Name</label>
                        <input
                          type="text"
                          value={newRuleName}
                          onChange={(e) => setNewRuleName(e.target.value)}
                          placeholder="e.g. 5th Visit Milestone"
                          required
                          className="w-full rounded-xl border border-black/[0.1] bg-[#FAFAFA] px-3.5 py-2 font-medium text-[#0A0A0B] focus:outline-none focus:border-[#0A0A0B] focus:bg-white"
                        />
                      </div>

                      {/* Trigger Type */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-[#0A0A0B] block mb-1">Trigger Condition</label>
                          <select
                            value={newTriggerType}
                            onChange={(e) => setNewTriggerType(e.target.value as TriggerType)}
                            className="w-full rounded-xl border border-black/[0.1] bg-[#FAFAFA] px-3 py-2 font-medium text-[#0A0A0B] focus:outline-none focus:border-[#0A0A0B]"
                          >
                            <option value="visits_milestone">Visit Milestone</option>
                            <option value="days_overdue">Days Overdue</option>
                            <option value="total_spend">Lifetime Spend</option>
                            <option value="inactivity">Inactivity</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-[#0A0A0B] block mb-1">
                            {newTriggerType === "visits_milestone"
                              ? "Visits Count"
                              : newTriggerType === "days_overdue"
                              ? "Days Overdue"
                              : "Spend Threshold (₹)"}
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={newTriggerValue}
                            onChange={(e) => setNewTriggerValue(Number(e.target.value))}
                            className="w-full rounded-xl border border-black/[0.1] bg-[#FAFAFA] px-3 py-2 font-medium text-[#0A0A0B] focus:outline-none focus:border-[#0A0A0B]"
                          />
                        </div>
                      </div>

                      {/* Reward */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-[#0A0A0B] block mb-1">Reward Type</label>
                          <select
                            value={newRewardType}
                            onChange={(e) => setNewRewardType(e.target.value as RewardType)}
                            className="w-full rounded-xl border border-black/[0.1] bg-[#FAFAFA] px-3 py-2 font-medium text-[#0A0A0B] focus:outline-none focus:border-[#0A0A0B]"
                          >
                            <option value="flat_discount">Flat Discount (₹)</option>
                            <option value="percent_discount">Percentage Discount (%)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-[#0A0A0B] block mb-1">Reward Value</label>
                          <input
                            type="number"
                            min="5"
                            value={newRewardValue}
                            onChange={(e) => setNewRewardValue(Number(e.target.value))}
                            className="w-full rounded-xl border border-black/[0.1] bg-[#FAFAFA] px-3 py-2 font-medium text-[#0A0A0B] focus:outline-none focus:border-[#0A0A0B]"
                          />
                        </div>
                      </div>

                      {/* Guardrails */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-[#0A0A0B] block mb-1">Minimum Bill (₹)</label>
                          <input
                            type="number"
                            min="0"
                            value={newMinBill}
                            onChange={(e) => setNewMinBill(Number(e.target.value))}
                            className="w-full rounded-xl border border-black/[0.1] bg-[#FAFAFA] px-3 py-2 font-medium text-[#0A0A0B] focus:outline-none focus:border-[#0A0A0B]"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-[#0A0A0B] block mb-1">Expiry (Days)</label>
                          <input
                            type="number"
                            min="1"
                            value={newExpiryDays}
                            onChange={(e) => setNewExpiryDays(Number(e.target.value))}
                            className="w-full rounded-xl border border-black/[0.1] bg-[#FAFAFA] px-3 py-2 font-medium text-[#0A0A0B] focus:outline-none focus:border-[#0A0A0B]"
                          />
                        </div>
                      </div>

                      {/* Live Rule Preview */}
                      <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-3 text-[12.5px] text-[#065F46]">
                        <p className="font-bold text-[#047857]">Preview Rule Logic:</p>
                        <p className="mt-0.5">
                          When a customer{" "}
                          <strong>
                            {newTriggerType === "visits_milestone"
                              ? `completes ${newTriggerValue} visits`
                              : newTriggerType === "days_overdue"
                              ? `is ${newTriggerValue}+ days overdue`
                              : `spends over ₹${newTriggerValue}`}
                          </strong>
                          , give them <strong>₹{newRewardValue} OFF</strong> on a minimum bill of ₹{newMinBill} (valid for {newExpiryDays} days).
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/[0.06]">
                        <button
                          type="button"
                          onClick={() => setIsCreateRuleOpen(false)}
                          className="rounded-xl border border-black/[0.1] px-4 py-2 font-semibold text-[#71717A] hover:bg-black/5"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-xl bg-[#0A0A0B] px-5 py-2 font-bold text-white hover:bg-black/90 cursor-pointer shadow-xs"
                        >
                          Save & Activate Rule
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* 3. BRING THEM BACK (DAILY WHATSAPP QUEUE)                             */}
          {/* ===================================================================== */}
          {activeNav === "retention" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
                <div>
                  <h1 className="text-[22px] sm:text-[24px] font-bold tracking-tight text-[#0A0A0B]">
                    Customers to bring back
                  </h1>
                  <p className="text-[13.5px] text-[#71717A]">
                    Revisit evaluated your Offer Rules against customer visit cycles. Ready to send via WhatsApp.
                  </p>
                </div>

                <button
                  onClick={handleSimulateReturn}
                  className="rounded-xl bg-[#0A0A0B] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-black/80 transition-all flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
                  title="Simulate customer returning after receiving WhatsApp"
                >
                  <span>⚡ Simulate Customer Return</span>
                </button>
              </div>

              {simulatedReturnNotice && (
                <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 text-[13.5px] font-semibold text-[#047857] flex items-center justify-between animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <IconCheck className="h-5 w-5 shrink-0" />
                    <span>{simulatedReturnNotice}</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveNav("counter");
                      setCounterStep(1);
                    }}
                    className="rounded-lg bg-[#047857] px-3 py-1 text-[12px] font-bold text-white hover:bg-[#065F46]"
                  >
                    Go to Counter →
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
                {/* Left 7 cols: Table */}
                <div className="lg:col-span-7 rounded-[22px] bg-white border border-black/[0.06] shadow-xs overflow-hidden">
                  <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3.5">
                    <span className="text-[13.5px] font-bold text-[#0A0A0B]">
                      Overdue regulars ({customers.filter((c) => c.isOverdue).length})
                    </span>
                    <span className="text-[11.5px] text-[#71717A]">Sorted by visit gap</span>
                  </div>

                  <div className="divide-y divide-black/[0.04]">
                    {customers.map((c) => {
                      const isSelected = c.id === activeRetentionCustomer.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            setActiveRetentionId(c.id);
                            setRetentionMessage(c.defaultMessage);
                          }}
                          className={`flex items-center justify-between p-4 transition-colors cursor-pointer ${
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
                                  <span className="rounded-md bg-[#ECFDF5] px-1.5 py-0.2 text-[10px] font-bold text-[#047857]">
                                    Returned
                                  </span>
                                )}
                              </div>
                              <p className="tabular text-[12px] text-[#71717A]">{c.phone}</p>
                            </div>
                          </div>

                          <div className="hidden sm:block text-right text-[12px]">
                            <p className="text-[#71717A]">Every {c.usualGapDays} days</p>
                            <p className="text-[11px] text-[#A1A1AA]">usual frequency</p>
                          </div>

                          <div className="text-right">
                            <span
                              className={`tabular inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                c.isOverdue
                                  ? "bg-[#FEF2F2] text-[#DC2626]"
                                  : "bg-[#ECFDF5] text-[#047857]"
                              }`}
                            >
                              {c.lastVisitDaysAgo === 0 ? "Today" : `${c.lastVisitDaysAgo} days ago`}
                            </span>
                          </div>

                          <span className="hidden sm:inline-block text-[12px] font-bold text-[#0A0A0B]">
                            {isSelected ? "● Active" : "Select →"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right 5 cols: WhatsApp Composer */}
                <div className="lg:col-span-5 space-y-4">
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
                        <p className="tabular font-bold text-[#0A0A0B]">{activeRetentionCustomer.visits}</p>
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
                        <p className="text-[#71717A] text-[11px]">usual gap</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-bold text-[#0A0A0B]">
                          WhatsApp Message Note
                        </span>
                        <span className="text-[11.5px] text-[#16A34A] font-semibold flex items-center gap-1">
                          <IconWhatsApp className="h-3.5 w-3.5" />
                          Manual Send
                        </span>
                      </div>

                      <textarea
                        rows={5}
                        value={retentionMessage}
                        onChange={(e) => setRetentionMessage(e.target.value)}
                        className="w-full rounded-xl border border-black/[0.08] bg-[#FAFAFA] p-3 text-[13px] font-medium text-[#0A0A0B] focus:border-[#0A0A0B] focus:bg-white focus:outline-none transition-colors leading-relaxed"
                      />

                      <button
                        onClick={handleOpenWhatsApp}
                        className="mt-3.5 w-full rounded-xl bg-[#16A34A] py-3 text-[13.5px] font-bold text-white hover:bg-[#15803D] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <IconWhatsApp className="h-4 w-4" />
                        <span>Send on WhatsApp</span>
                      </button>

                      <p className="mt-2 text-center text-[11px] text-[#A1A1AA]">
                        Opens WhatsApp directly with {activeRetentionCustomer.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* 4. CUSTOMERS DIRECTORY VIEW                                           */}
          {/* ===================================================================== */}
          {activeNav === "customers" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <div>
                  <h1 className="text-[22px] font-bold tracking-tight text-[#0A0A0B]">
                    Customer Directory
                  </h1>
                  <p className="text-[13px] text-[#71717A]">
                    Every customer remembered with visit frequencies and lifetime spend.
                  </p>
                </div>
                <span className="text-[12px] font-bold text-[#0A0A0B]">
                  {customers.length} Profiles
                </span>
              </div>

              <div className="rounded-[22px] bg-white border border-black/[0.06] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#FAFAFA] border-b border-black/[0.06] text-[#71717A] text-[11.5px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4 font-bold">Customer</th>
                        <th className="py-3 px-4 font-bold">Visits</th>
                        <th className="py-3 px-4 font-bold">Total Spent</th>
                        <th className="py-3 px-4 font-bold">Visit Frequency</th>
                        <th className="py-3 px-4 font-bold">Last Visit</th>
                        <th className="py-3 px-4 font-bold">Offer Rule Trigger</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04]">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-[#FAFAFA] transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-bold text-[#0A0A0B]">{c.name}</p>
                            <p className="tabular text-[11.5px] text-[#71717A]">{c.phone}</p>
                          </td>
                          <td className="py-3 px-4 tabular font-bold">{c.visits}</td>
                          <td className="py-3 px-4 tabular font-semibold text-[#0A0A0B]">
                            ₹{c.totalSpent.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-4 text-[#71717A]">Every {c.usualGapDays}d</td>
                          <td className="py-3 px-4">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                c.isOverdue
                                  ? "bg-[#FEF2F2] text-[#DC2626]"
                                  : "bg-[#ECFDF5] text-[#047857]"
                              }`}
                            >
                              {c.lastVisitDaysAgo === 0 ? "Today" : `${c.lastVisitDaysAgo}d ago`}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="rounded-lg bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-bold text-[#047857]">
                              {c.visits >= 5 ? "5th Visit Milestone" : "Overdue Win-Back"}
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
          {/* 5. BUSINESS IMPACT & ATTRIBUTION                                      */}
          {/* ===================================================================== */}
          {activeNav === "impact" && (
            <div className="space-y-6">
              <div className="border-b border-black/[0.06] pb-3">
                <h1 className="text-[22px] font-bold tracking-tight text-[#0A0A0B]">
                  Business Impact & Revenue Attribution
                </h1>
                <p className="text-[13px] text-[#71717A]">
                  Real revenue generated from customers who returned through Revisit retention.
                </p>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-[22px] bg-white p-5 border border-black/[0.06] shadow-xs">
                  <p className="text-[12px] font-bold text-[#71717A] uppercase tracking-wider">
                    Attributed Repeat Revenue
                  </p>
                  <p className="mt-2 text-[28px] font-bold text-[#0A0A0B] tabular">₹18,740</p>
                  <p className="text-[12px] text-[#047857] font-semibold mt-1">
                    ↑ Directly from returning regulars
                  </p>
                </div>

                <div className="rounded-[22px] bg-white p-5 border border-black/[0.06] shadow-xs">
                  <p className="text-[12px] font-bold text-[#71717A] uppercase tracking-wider">
                    Reward Spend vs Return
                  </p>
                  <p className="mt-2 text-[28px] font-bold text-[#0A0A0B] tabular">6.0x ROI</p>
                  <p className="text-[12px] text-[#71717A] mt-1">
                    ₹3,100 discounts generated ₹18,740
                  </p>
                </div>

                <div className="rounded-[22px] bg-white p-5 border border-black/[0.06] shadow-xs">
                  <p className="text-[12px] font-bold text-[#71717A] uppercase tracking-wider">
                    Repeat Visit Rate
                  </p>
                  <p className="mt-2 text-[28px] font-bold text-[#0A0A0B] tabular">38.4%</p>
                  <p className="text-[12px] text-[#047857] font-semibold mt-1">
                    +11% vs industry average (27%)
                  </p>
                </div>
              </div>

              {/* Proof Closed Loop summary */}
              <div className="rounded-[24px] bg-[#0A0A0B] p-6 sm:p-7 text-white shadow-xl">
                <h3 className="text-[18px] font-bold">The Closed-Loop Retention Engine</h3>
                <p className="mt-1 text-[13.5px] text-white/70 max-w-[600px] leading-relaxed">
                  No points, no plastic cards, no POS changes. Just automated customer memory, rule-based counter rewards, and 1-tap WhatsApp to bring them back before they disappear.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3 text-[12.5px]">
                  <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                    <p className="text-white/60 text-[11px]">1. Counter Snaps Bill</p>
                    <p className="font-bold mt-1">Customer history remembered in 8s</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                    <p className="text-white/60 text-[11px]">2. Offer Rules Evaluate</p>
                    <p className="font-bold mt-1">5th visit / overdue triggers automatically</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                    <p className="text-white/60 text-[11px]">3. 1-Tap WhatsApp</p>
                    <p className="font-bold mt-1">Owner sends warm, personalized note</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                    <p className="text-white/60 text-[11px]">4. Return Recorded</p>
                    <p className="font-bold mt-1">Direct repeat sales in your bank</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
