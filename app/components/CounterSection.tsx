import React from "react";
import Image from "next/image";
import {
  IconSearch,
  IconGift,
  IconCoffee,
  IconCheck,
  IconArrowRight,
  IconMonitor,
  IconSmartphoneOff,
  IconCoins,
} from "./Icons";

export function CounterSection() {
  return (
    <section id="counter" className="bg-[#FAFAFA] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1140px] px-5 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-[680px] text-center">
          <p className="text-[11px] font-bold tracking-[0.16em] text-[#71717A] uppercase">
            At The Counter
          </p>
          <h2 className="mt-4 text-[34px] leading-[1.1] font-bold tracking-[-0.035em] text-[#0A0A0B] sm:text-[46px]">
            When they come back,
            <br />
            <span className="text-[#64748B]">you already know them.</span>
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-[#52525B]">
            Their history is right there at the counter — including what they like and any reward they&apos;ve earned.
          </p>
        </div>

        {/* 3-Card Visual Workflow (White Apple Squircles, No Border, No Shadow) */}
        <div className="mt-14 grid items-center gap-5 lg:grid-cols-[1.1fr_auto_1.1fr_auto_1.1fr]">
          {/* Card 1: Real-Life Interaction Photo */}
          <div className="relative overflow-hidden rounded-[28px] bg-white">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/cashier_greeting.jpg"
                alt="Cashier greeting customer at counter"
                fill
                className="object-cover"
              />
              {/* Floating Customer Pill */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/95 px-4 py-2 backdrop-blur-xs">
                <p className="text-[13.5px] font-bold text-[#0A0A0B]">Rahul Sharma</p>
                <p className="tabular text-[11px] font-medium text-[#71717A]">+91 98765 43210</p>
              </div>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden justify-center text-[#A1A1AA] lg:flex">
            <IconArrowRight className="h-5 w-5" />
          </div>

          {/* Card 2: Revisit Counter Profile & Reward Screen */}
          <div className="rounded-[24px] bg-white p-5 sm:rounded-[28px] sm:p-6">
            <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
              <span className="text-[15px] font-bold tracking-tight text-[#0A0A0B]">Revisit</span>
              <IconSearch className="h-4 w-4 text-[#71717A]" />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0A0A0B] text-[15px] font-bold text-white">
                R
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14.5px] font-bold text-[#0A0A0B]">Rahul Sharma</p>
                  <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10.5px] font-bold text-[#047857]">
                    Returning customer
                  </span>
                </div>
                <p className="tabular text-[12px] text-[#71717A]">+91 98765 43210</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x divide-black/[0.04] rounded-2xl bg-[#FAFAFA] py-3 text-center">
              <div>
                <p className="tabular text-[15px] font-bold text-[#0A0A0B]">8</p>
                <p className="text-[11px] text-[#71717A]">visits</p>
              </div>
              <div>
                <p className="tabular text-[15px] font-bold text-[#0A0A0B]">₹4,280</p>
                <p className="text-[11px] text-[#71717A]">spent</p>
              </div>
              <div>
                <p className="tabular text-[15px] font-bold text-[#0A0A0B]">9 days</p>
                <p className="text-[11px] text-[#71717A]">usually</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#FAFAFA] px-4 py-2.5 text-[12.5px]">
              <IconCoffee className="h-4 w-4 text-[#71717A]" />
              <span className="text-[#71717A]">Favorite item:</span>
              <span className="font-semibold text-[#0A0A0B]">Cold Coffee</span>
            </div>

            <div className="mt-3 rounded-2xl bg-[#ECFDF5] p-3.5">
              <div className="flex items-center gap-2 text-[#047857]">
                <IconGift className="h-4 w-4" />
                <span className="text-[13px] font-bold">₹100 reward available</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[#065F46]">Valid till this week</p>
            </div>

            <button
              type="button"
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[#047857] text-[13.5px] font-bold text-white transition-colors hover:bg-[#065F46]"
            >
              Apply ₹100 reward
            </button>
          </div>

          {/* Arrow 2 */}
          <div className="hidden justify-center text-[#A1A1AA] lg:flex">
            <IconArrowRight className="h-5 w-5" />
          </div>

          {/* Card 3: POS Receipt Math with Discount Applied */}
          <div className="rounded-[24px] bg-white p-5 sm:rounded-[28px] sm:p-6">
            <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
              <span className="text-[15px] font-bold tracking-tight text-[#0A0A0B]">Bill</span>
              <span className="text-[11px] text-[#71717A]">#1042</span>
            </div>

            <div className="mt-4 space-y-2.5 text-[13.5px]">
              <div className="flex justify-between text-[#52525B]">
                <span>Cold Coffee</span>
                <span className="tabular font-medium text-[#0A0A0B]">₹180</span>
              </div>
              <div className="flex justify-between text-[#52525B]">
                <span>Paneer Wrap</span>
                <span className="tabular font-medium text-[#0A0A0B]">₹240</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-dashed border-black/[0.06] pt-3 text-[13.5px]">
              <div className="flex justify-between text-[#71717A]">
                <span>Subtotal</span>
                <span className="tabular font-medium text-[#0A0A0B]">₹420</span>
              </div>
              <div className="flex justify-between font-medium text-[#047857]">
                <span>Reward (Revisit)</span>
                <span className="tabular font-bold">- ₹100</span>
              </div>
            </div>

            <div className="mt-3 border-t border-black/[0.04] pt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] font-bold text-[#0A0A0B]">Total</span>
                <span className="tabular text-[22px] font-bold text-[#0A0A0B]">₹320</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#ECFDF5] px-4 py-2.5 text-[12px] font-semibold text-[#047857]">
              <IconCheck className="h-4 w-4" />
              <span>Reward applied · Customer saved ₹100</span>
            </div>
          </div>
        </div>

        {/* 3 Numbered Steps (Apple Squircles White) */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <div className="flex items-start gap-4 rounded-[24px] bg-white p-5 sm:p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A0A0B] text-[13px] font-bold text-white">
              1
            </span>
            <div>
              <p className="text-[15.5px] font-bold text-[#0A0A0B]">Search</p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#52525B]">
                Enter the customer&apos;s phone number when they arrive at billing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-[24px] bg-white p-5 sm:p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A0A0B] text-[13px] font-bold text-white">
              2
            </span>
            <div>
              <p className="text-[15.5px] font-bold text-[#0A0A0B]">Reward</p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#52525B]">
                See their visit history, favorite order, and apply any available reward.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-[24px] bg-white p-5 sm:p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A0A0B] text-[13px] font-bold text-white">
              3
            </span>
            <div>
              <p className="text-[15.5px] font-bold text-[#0A0A0B]">Snap</p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#52525B]">
                Take a quick photo of the printed bill. Revisit remembers the visit.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Friction-Killers Strip */}
        <div className="mt-6 grid gap-5 rounded-[24px] bg-white p-5 sm:rounded-[28px] sm:p-6 sm:grid-cols-3">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FAFAFA] text-[#0A0A0B]">
              <IconMonitor className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[14px] font-bold text-[#0A0A0B]">No POS replacement</p>
              <p className="text-[12px] text-[#71717A]">Works with your existing setup.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FAFAFA] text-[#0A0A0B]">
              <IconSmartphoneOff className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[14px] font-bold text-[#0A0A0B]">No customer app</p>
              <p className="text-[12px] text-[#71717A]">Customers don&apos;t need to download anything.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FAFAFA] text-[#0A0A0B]">
              <IconCoins className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[14px] font-bold text-[#0A0A0B]">No API fees</p>
              <p className="text-[12px] text-[#71717A]">Simple, transparent, and direct.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
