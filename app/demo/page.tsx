"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconLogo,
  IconGift,
  IconCheck,
  IconWhatsApp,
  IconArrowRight,
  IconCamera,
} from "../components/Icons";
import { Customer } from "./types";
import { INITIAL_CUSTOMERS } from "./mockData";

export default function DemoPage() {
  // Navigation tabs: 'counter' | 'retention'
  const [activeTab, setActiveTab] = useState<"counter" | "retention">("counter");

  // Counter step-by-step state: 1 (search) -> 2 (reward) -> 3 (camera/OCR) -> 4 (saved)
  const [counterStep, setCounterStep] = useState<1 | 2 | 3 | 4>(1);

  // Global demo customers state
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [phoneInput, setPhoneInput] = useState<string>("+91 98765 43210");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("c1");

  // Step 2 state: Reward applied in POS
  const [isRewardAppliedInPos, setIsRewardAppliedInPos] = useState<boolean>(true);

  // Step 3 state: Camera & OCR simulation
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [ocrCompleted, setOcrCompleted] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<string>("Ready to capture");

  // Retention tab state
  const [activeRetentionId, setActiveRetentionId] = useState<string>("c1");
  const [retentionMessage, setRetentionMessage] = useState<string>(
    INITIAL_CUSTOMERS[0].defaultMessage
  );
  const [simulatedReturnNotice, setSimulatedReturnNotice] = useState<string | null>(null);

  // Active customer in Counter
  const activeCustomer =
    customers.find((c) => c.phone.replace(/\s+/g, "") === phoneInput.replace(/\s+/g, "")) ||
    customers.find((c) => c.id === selectedCustomerId) ||
    customers[0];

  // Active customer in Retention
  const activeRetentionCustomer =
    customers.find((c) => c.id === activeRetentionId) || customers[0];

  // Keypad click handler
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

  // Quick pick sample in Step 1
  const selectSampleInStep1 = (c: Customer) => {
    setPhoneInput(c.phone);
    setSelectedCustomerId(c.id);
  };

  // Trigger camera snap and OCR simulation
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

  // Final confirm & save visit (Step 3 -> Step 4)
  const handleConfirmSaveVisit = () => {
    const netBill = isRewardAppliedInPos ? 320 : 420;

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

  // Reset counter to step 1 for next customer
  const handleResetCounter = () => {
    setCounterStep(1);
    setOcrCompleted(false);
    setIsCapturing(false);
    setIsRewardAppliedInPos(true);
  };

  // WhatsApp open trigger in Retention
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

  // Global reset demo
  const handleFullReset = () => {
    setCustomers(INITIAL_CUSTOMERS);
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
    <div className="min-h-screen bg-[#F8F9FA] text-[#0A0A0B] flex flex-col selection:bg-[#0A0A0B] selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-[17px] font-bold tracking-tight text-[#0A0A0B] hover:opacity-80 transition-opacity"
            >
              <IconLogo className="h-6 w-6" />
              <span>revisit</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 border-l border-black/[0.08] pl-4 text-[13px] text-[#71717A]">
              <span className="font-medium text-[#0A0A0B]">The Daily Brew</span>
              <span>·</span>
              <span>Indiranagar</span>
            </div>
          </div>

          {/* Role Navigation Switcher */}
          <div className="flex items-center rounded-xl bg-[#F4F4F5] p-1 text-[13px] font-semibold">
            <button
              onClick={() => setActiveTab("counter")}
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 transition-all ${
                activeTab === "counter"
                  ? "bg-white text-[#0A0A0B] shadow-xs"
                  : "text-[#71717A] hover:text-[#0A0A0B]"
              }`}
            >
              <IconCamera className="h-4 w-4" />
              <span>At the counter</span>
            </button>

            <button
              onClick={() => setActiveTab("retention")}
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 transition-all ${
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

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleFullReset}
              className="text-[12px] font-medium text-[#71717A] hover:text-[#0A0A0B] transition-colors cursor-pointer px-2.5 py-1 rounded-md hover:bg-black/[0.04]"
            >
              Reset demo
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 sm:py-8">
        {/* ========================================================================= */}
        {/* TAB 1: AT THE COUNTER (STEP-BY-STEP SIMULATION)                           */}
        {/* ========================================================================= */}
        {activeTab === "counter" && (
          <div className="mx-auto max-w-[760px]">
            {/* Step Progress Pills */}
            <div className="mb-6 flex items-center justify-between border-b border-black/[0.06] pb-4">
              <div className="flex items-center gap-2 sm:gap-3 text-[13px] font-semibold">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
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
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
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
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
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

            {/* --------------------------------------------------------------------- */}
            {/* STEP 1: PHONE NUMBER INPUT                                            */}
            {/* --------------------------------------------------------------------- */}
            {counterStep === 1 && (
              <div className="rounded-[24px] bg-white p-6 sm:p-8 border border-black/[0.06] shadow-xs animate-in fade-in duration-200">
                <div className="text-center max-w-[460px] mx-auto">
                  <p className="text-[11.5px] font-bold text-[#71717A] uppercase tracking-wider">
                    Step 1 · Counter greeting
                  </p>
                  <h2 className="mt-1 text-[24px] font-bold tracking-tight text-[#0A0A0B]">
                    &quot;Phone number, please?&quot;
                  </h2>
                  <p className="mt-1 text-[13.5px] text-[#71717A]">
                    Cashier asks for the phone number before generating the bill.
                  </p>

                  {/* Phone Input Box */}
                  <div className="mt-6 rounded-2xl border-2 border-black/[0.08] bg-[#FAFAFA] px-4 py-3.5 focus-within:border-[#0A0A0B] focus-within:bg-white transition-all">
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-center text-[22px] font-bold tracking-wider text-[#0A0A0B] focus:outline-none tabular"
                    />
                  </div>

                  {/* Quick Sample Picks */}
                  <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-[12px]">
                    <span className="text-[#71717A]">Try sample customer:</span>
                    <button
                      onClick={() => selectSampleInStep1(customers[0])}
                      className="rounded-lg bg-[#FAFAFA] border border-black/[0.08] px-2.5 py-1 font-semibold text-[#0A0A0B] hover:bg-[#F4F4F5]"
                    >
                      Rahul Sharma (Regular)
                    </button>
                    <button
                      onClick={() => selectSampleInStep1(customers[1])}
                      className="rounded-lg bg-[#FAFAFA] border border-black/[0.08] px-2.5 py-1 font-semibold text-[#0A0A0B] hover:bg-[#F4F4F5]"
                    >
                      Aman Verma
                    </button>
                  </div>

                  {/* Numeric Keypad for Counter Tablet Feel */}
                  <div className="mt-6 grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((key) => (
                      <button
                        key={key}
                        onClick={() => handleKeypadPress(key)}
                        className="h-12 rounded-xl bg-[#F8F9FA] text-[17px] font-bold text-[#0A0A0B] hover:bg-[#F1F3F5] active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-black/[0.04]"
                      >
                        {key}
                      </button>
                    ))}
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={() => setCounterStep(2)}
                    className="mt-7 w-full max-w-[340px] rounded-xl bg-[#0A0A0B] py-3.5 text-[15px] font-bold text-white hover:bg-black/90 transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
                  >
                    <span>Look up customer</span>
                    <IconArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 2: RECOGNITION & REWARD APPLICATION IN POS                       */}
            {/* --------------------------------------------------------------------- */}
            {counterStep === 2 && (
              <div className="rounded-[24px] bg-white p-6 sm:p-8 border border-black/[0.06] shadow-xs animate-in fade-in duration-200">
                <div>
                  <p className="text-[11.5px] font-bold text-[#71717A] uppercase tracking-wider">
                    Step 2 · Customer recognized
                  </p>
                  <h2 className="mt-1 text-[24px] font-bold tracking-tight text-[#0A0A0B]">
                    Instant reward check
                  </h2>
                  <p className="mt-1 text-[13.5px] text-[#71717A]">
                    Revisit tells the cashier if the regular has a discount before billing in their POS.
                  </p>
                </div>

                {/* Customer Snapshot Box */}
                <div className="mt-6 rounded-2xl bg-[#FAFAFA] border border-black/[0.06] p-5">
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A0A0B] text-white font-bold text-[17px]">
                        {activeCustomer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[16px] font-bold text-[#0A0A0B]">
                            {activeCustomer.name}
                          </p>
                          <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-bold text-[#047857]">
                            {activeCustomer.status}
                          </span>
                        </div>
                        <p className="tabular text-[12.5px] text-[#71717A]">
                          {activeCustomer.phone}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="rounded-full bg-[#FEF2F2] px-2.5 py-1 text-[12px] font-bold text-[#DC2626]">
                        Last visit: 12 days ago
                      </span>
                      <p className="text-[11px] text-[#71717A] mt-1">
                        Usually visits every {activeCustomer.usualGapDays} days
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 divide-x divide-black/[0.06] text-center">
                    <div>
                      <p className="tabular text-[16px] font-bold text-[#0A0A0B]">
                        {activeCustomer.visits}
                      </p>
                      <p className="text-[11.5px] text-[#71717A]">total visits</p>
                    </div>
                    <div>
                      <p className="tabular text-[16px] font-bold text-[#0A0A0B]">
                        ₹{activeCustomer.totalSpent.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11.5px] text-[#71717A]">lifetime spend</p>
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#0A0A0B]">
                        {activeCustomer.favoriteItem}
                      </p>
                      <p className="text-[11.5px] text-[#71717A]">favorite item</p>
                    </div>
                  </div>
                </div>

                {/* Big Reward Prompt */}
                <div className="mt-5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#047857]">
                        <IconGift className="h-5 w-5" />
                        <span className="text-[18px] font-bold">
                          ₹100 Reward Available
                        </span>
                      </div>
                      <p className="mt-1 text-[13.5px] text-[#065F46]">
                        Condition: Minimum bill ₹350 · Valid for this visit.
                      </p>
                    </div>

                    <span className="rounded-full bg-white px-3 py-1 text-[12px] font-bold text-[#047857] border border-[#047857]/20">
                      Pre-billing reward
                    </span>
                  </div>

                  {/* Cashier Instructions */}
                  <div className="mt-4 rounded-xl bg-white p-4 border border-[#047857]/15">
                    <p className="text-[12.5px] font-bold text-[#0A0A0B] uppercase tracking-wider">
                      Cashier Action:
                    </p>
                    <p className="text-[14px] text-[#52525B] mt-0.5">
                      Punch a <strong className="text-[#0A0A0B]">₹100 discount</strong> in your existing POS machine (Petpooja / Toast / Square) when generating Rahul&apos;s bill.
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => setIsRewardAppliedInPos(true)}
                        className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold transition-all cursor-pointer ${
                          isRewardAppliedInPos
                            ? "bg-[#047857] text-white"
                            : "bg-[#FAFAFA] border border-black/[0.08] text-[#71717A]"
                        }`}
                      >
                        ✓ ₹100 Applied in POS
                      </button>
                      <button
                        onClick={() => setIsRewardAppliedInPos(false)}
                        className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-medium transition-all cursor-pointer ${
                          !isRewardAppliedInPos
                            ? "bg-[#0A0A0B] text-white"
                            : "bg-[#FAFAFA] border border-black/[0.08] text-[#71717A]"
                        }`}
                      >
                        Skip for this bill
                      </button>
                    </div>
                  </div>
                </div>

                {/* Continue to Camera Step */}
                <div className="mt-7 flex justify-end">
                  <button
                    onClick={() => setCounterStep(3)}
                    className="rounded-xl bg-[#0A0A0B] px-6 py-3.5 text-[15px] font-bold text-white hover:bg-black/90 transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
                  >
                    <span>Proceed to bill capture</span>
                    <IconArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 3: CAMERA VIEWFINDER & LIVE OCR SIMULATION                        */}
            {/* --------------------------------------------------------------------- */}
            {counterStep === 3 && (
              <div className="rounded-[24px] bg-white p-6 sm:p-8 border border-black/[0.06] shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11.5px] font-bold text-[#71717A] uppercase tracking-wider">
                      Step 3 · Snap the printed bill
                    </p>
                    <h2 className="mt-1 text-[24px] font-bold tracking-tight text-[#0A0A0B]">
                      Take a photo of the receipt
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#FAFAFA] border border-black/[0.08] px-3 py-1 text-[12px] font-medium text-[#71717A]">
                    Customer: {activeCustomer.name.split(" ")[0]}
                  </span>
                </div>

                {/* Camera Viewfinder Simulation */}
                <div className="mt-6 relative rounded-2xl bg-[#18181B] p-4 sm:p-6 text-white overflow-hidden shadow-inner">
                  {/* Viewfinder Corners */}
                  <div className="absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-white/60" />
                  <div className="absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2 border-white/60" />
                  <div className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-white/60" />
                  <div className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-white/60" />

                  {/* Laser Scan Animation Line */}
                  {isCapturing && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-[#22C55E] shadow-[0_0_15px_#22C55E] animate-bounce z-20" />
                  )}

                  {/* Printed Receipt Model */}
                  <div className="mx-auto max-w-[340px] rounded-xl bg-white p-5 text-[#0A0A0B] shadow-2xl font-mono text-[12.5px]">
                    <div className="text-center border-b border-dashed border-black/20 pb-3">
                      <p className="font-bold text-[14px] font-sans">THE DAILY BREW</p>
                      <p className="text-[11px] text-[#71717A] font-sans">100 FT ROAD, INDIRANAGAR</p>
                      <p className="text-[11px] text-[#71717A] mt-1">Receipt #2841 · Today, 7:32 PM</p>
                    </div>

                    <div className="py-3 space-y-1.5 border-b border-dashed border-black/20">
                      <div className="flex justify-between">
                        <span>1x Cold Coffee</span>
                        <span className="font-bold">₹220.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1x Paneer Wrap</span>
                        <span className="font-bold">₹200.00</span>
                      </div>
                      <div className="flex justify-between text-[#71717A] pt-1 text-[11.5px]">
                        <span>Subtotal</span>
                        <span>₹420.00</span>
                      </div>
                      {isRewardAppliedInPos && (
                        <div className="flex justify-between text-[#047857] font-semibold">
                          <span>Revisit Reward</span>
                          <span>-₹100.00</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 flex justify-between text-[15px] font-bold">
                      <span>TOTAL PAID:</span>
                      <span>₹{isRewardAppliedInPos ? "320.00" : "420.00"}</span>
                    </div>

                    <p className="text-center text-[10px] text-[#71717A] mt-3 uppercase tracking-wider font-sans">
                      Thank you for visiting!
                    </p>
                  </div>

                  {/* Camera Action Control */}
                  <div className="mt-5 flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-[12px] text-white/70">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          ocrCompleted ? "bg-[#22C55E]" : isCapturing ? "bg-[#EAB308] animate-ping" : "bg-white/40"
                        }`}
                      />
                      <span>Status: {ocrProgress}</span>
                    </div>

                    {!ocrCompleted ? (
                      <button
                        onClick={handleSnapBill}
                        disabled={isCapturing}
                        className="rounded-full bg-white px-5 py-2.5 text-[13.5px] font-bold text-[#0A0A0B] hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                      >
                        <IconCamera className="h-4 w-4" />
                        <span>{isCapturing ? "Scanning..." : "📸 Snap Bill"}</span>
                      </button>
                    ) : (
                      <span className="rounded-full bg-[#22C55E]/20 text-[#22C55E] px-3 py-1 text-[12px] font-bold">
                        ✓ Bill Captured
                      </span>
                    )}
                  </div>
                </div>

                {/* OCR Parsed Confirmation Card */}
                {ocrCompleted && (
                  <div className="mt-5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] p-4 text-[#166534] animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-[14px]">
                        <IconCheck className="h-4 w-4 text-[#16A34A]" />
                        <span>OCR Successfully Extracted:</span>
                      </div>
                      <span className="text-[12px] text-[#15803D]">1.2s processing</span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12.5px] bg-white rounded-xl p-3 border border-[#BBF7D0]">
                      <div>
                        <p className="text-[#71717A] text-[11px]">Items read</p>
                        <p className="font-bold text-[#0A0A0B]">Cold Coffee, Paneer Wrap</p>
                      </div>
                      <div>
                        <p className="text-[#71717A] text-[11px]">Amount</p>
                        <p className="font-bold text-[#0A0A0B]">₹{isRewardAppliedInPos ? "320" : "420"}</p>
                      </div>
                      <div>
                        <p className="text-[#71717A] text-[11px]">Discount</p>
                        <p className="font-bold text-[#047857]">{isRewardAppliedInPos ? "₹100 (Revisit)" : "None"}</p>
                      </div>
                      <div>
                        <p className="text-[#71717A] text-[11px]">Attached to</p>
                        <p className="font-bold text-[#0A0A0B]">{activeCustomer.name}</p>
                      </div>
                    </div>

                    {/* Final Confirm Button */}
                    <button
                      onClick={handleConfirmSaveVisit}
                      className="mt-4 w-full rounded-xl bg-[#0A0A0B] py-3.5 text-[14.5px] font-bold text-white hover:bg-black/90 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Confirm & Save Visit</span>
                      <IconArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 4: VISIT RECORDED & PROFILE UPDATED                              */}
            {/* --------------------------------------------------------------------- */}
            {counterStep === 4 && (
              <div className="rounded-[24px] bg-white p-6 sm:p-8 border border-black/[0.06] shadow-xs text-center animate-in fade-in duration-200">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ECFDF5] text-[#047857]">
                  <IconCheck className="h-7 w-7" />
                </div>

                <h2 className="mt-3 text-[24px] font-bold tracking-tight text-[#0A0A0B]">
                  Visit successfully recorded!
                </h2>
                <p className="mt-1 text-[14px] text-[#71717A]">
                  Whole workflow took <strong className="text-[#0A0A0B]">8 seconds</strong>. Zero manual POS data entry.
                </p>

                {/* Updated Customer Summary */}
                <div className="mt-6 rounded-2xl bg-[#FAFAFA] border border-black/[0.06] p-5 max-w-[480px] mx-auto text-left">
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                    <div>
                      <p className="text-[15px] font-bold text-[#0A0A0B]">{activeCustomer.name}</p>
                      <p className="tabular text-[12px] text-[#71717A]">{activeCustomer.phone}</p>
                    </div>
                    <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#047857]">
                      Updated Just Now
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[12px]">
                    <div>
                      <p className="tabular font-bold text-[16px] text-[#0A0A0B]">{activeCustomer.visits}</p>
                      <p className="text-[#71717A]">visits (+1)</p>
                    </div>
                    <div>
                      <p className="tabular font-bold text-[16px] text-[#0A0A0B]">
                        ₹{activeCustomer.totalSpent.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[#71717A]">total spend</p>
                    </div>
                    <div>
                      <p className="font-bold text-[14px] text-[#047857]">Healthy</p>
                      <p className="text-[#71717A]">retention status</p>
                    </div>
                  </div>
                </div>

                {/* Next Steps Buttons */}
                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleResetCounter}
                    className="w-full sm:w-auto rounded-xl border border-black/[0.1] bg-white px-5 py-3 text-[13.5px] font-bold text-[#0A0A0B] hover:bg-black/5 transition-all cursor-pointer"
                  >
                    + Next Customer at Counter
                  </button>

                  <button
                    onClick={() => setActiveTab("retention")}
                    className="w-full sm:w-auto rounded-xl bg-[#0A0A0B] px-6 py-3 text-[13.5px] font-bold text-white hover:bg-black/90 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>See What Owner Sees (Retention)</span>
                    <IconArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BRING THEM BACK (OWNER RETENTION COPILOT)                           */}
        {/* ========================================================================= */}
        {activeTab === "retention" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
              <div>
                <h1 className="text-[22px] sm:text-[24px] font-bold tracking-tight text-[#0A0A0B]">
                  Customers to bring back
                </h1>
                <p className="text-[14px] text-[#71717A]">
                  AI identifies regulars who are past their usual visit gap. Owner sends 1-tap WhatsApp.
                </p>
              </div>

              {/* Pitch-closing Simulation CTA */}
              <button
                onClick={handleSimulateReturn}
                className="rounded-xl bg-[#0A0A0B] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-black/80 transition-all flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
                title="Simulate Rahul walking into the café 2 days later and placing an order"
              >
                <span>⚡ Simulate Customer Return</span>
              </button>
            </div>

            {/* Simulation Notification */}
            {simulatedReturnNotice && (
              <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 text-[14px] font-semibold text-[#047857] flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <IconCheck className="h-5 w-5 shrink-0" />
                  <span>{simulatedReturnNotice}</span>
                </div>
                <button
                  onClick={() => {
                    setActiveTab("counter");
                    setCounterStep(1);
                  }}
                  className="rounded-lg bg-[#047857] px-3 py-1 text-[12px] font-bold text-white hover:bg-[#065F46] transition-colors"
                >
                  Go to Counter →
                </button>
              </div>
            )}

            {/* Main Split Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              {/* Left Column (7 cols): Overdue Regulars List */}
              <div className="lg:col-span-7 rounded-[22px] bg-white border border-black/[0.06] shadow-xs overflow-hidden">
                <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3.5">
                  <span className="text-[13.5px] font-bold text-[#0A0A0B]">
                    Overdue regulars ({customers.filter((c) => c.isOverdue).length})
                  </span>
                  <span className="text-[12px] text-[#71717A]">Sorted by overdue days</span>
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
                            className={`tabular inline-block rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${
                              c.isOverdue
                                ? "bg-[#FEF2F2] text-[#DC2626]"
                                : "bg-[#ECFDF5] text-[#047857]"
                            }`}
                          >
                            {c.lastVisitDaysAgo === 0 ? "Today" : `${c.lastVisitDaysAgo} days ago`}
                          </span>
                        </div>

                        <span className="hidden sm:inline-flex text-[12px] font-bold text-[#0A0A0B]">
                          {isSelected ? "● Selected" : "Select →"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column (5 cols): WhatsApp Message Composer */}
              <div className="lg:col-span-5 space-y-5">
                <div className="rounded-[22px] bg-white p-5 border border-black/[0.06] shadow-xs">
                  {/* Selected Customer Header */}
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

                  {/* Visit Stats */}
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

                  {/* Suggested Message Editor */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-[#0A0A0B]">
                        AI-drafted WhatsApp note
                      </span>
                      <span className="text-[11.5px] text-[#16A34A] font-medium flex items-center gap-1">
                        <IconWhatsApp className="h-3.5 w-3.5" />
                        Manual Send
                      </span>
                    </div>

                    <textarea
                      rows={5}
                      value={retentionMessage}
                      onChange={(e) => setRetentionMessage(e.target.value)}
                      className="w-full rounded-xl border border-black/[0.08] bg-[#FAFAFA] p-3 text-[13.5px] font-medium text-[#0A0A0B] focus:border-[#0A0A0B] focus:bg-white focus:outline-none transition-colors leading-relaxed"
                    />

                    {/* Quick Tone Buttons */}
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() =>
                          setRetentionMessage(
                            `Hi ${activeRetentionCustomer.name.split(" ")[0]},\n\nYour usual ${activeRetentionCustomer.favoriteItem} is waiting! Here's ₹100 off your next visit before Sunday.`
                          )
                        }
                        className="rounded-md bg-[#FAFAFA] border border-black/[0.06] px-2 py-1 text-[11px] font-medium text-[#71717A] hover:text-[#0A0A0B]"
                      >
                        Shorter
                      </button>
                      <button
                        onClick={() =>
                          setRetentionMessage(
                            `Hey ${activeRetentionCustomer.name.split(" ")[0]} 👋 We've saved ₹100 off your favorite ${activeRetentionCustomer.favoriteItem} this weekend at The Daily Brew. Hope to see you soon!`
                          )
                        }
                        className="rounded-md bg-[#FAFAFA] border border-black/[0.06] px-2 py-1 text-[11px] font-medium text-[#71717A] hover:text-[#0A0A0B]"
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
                      Opens WhatsApp chat directly with {activeRetentionCustomer.phone}
                    </p>
                  </div>
                </div>

                {/* Return Proof Drawer */}
                <div className="rounded-[22px] bg-white p-5 border border-black/[0.06] shadow-xs">
                  <p className="text-[13px] font-bold text-[#0A0A0B]">Proof of repeat business</p>
                  <p className="text-[12px] text-[#71717A] mt-1 leading-relaxed">
                    When the customer receives your message and returns, the counter snaps their bill. Click below to simulate Rahul returning today.
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
