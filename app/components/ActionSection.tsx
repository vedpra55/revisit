import React from "react";
import {
  IconArrowRight,
  IconClock,
  IconCoffee,
  IconRupee,
  IconCheck,
  IconGift,
  IconMessageSquare,
  IconUsers,
  IconStar,
  IconWhatsApp,
  IconSend,
} from "./Icons";

export function ActionSection() {
  return (
    <section id="action" className="bg-[#FAFAFA] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1140px] px-5 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-[680px] text-center">
          <p className="text-[11px] font-bold tracking-[0.16em] text-[#71717A] uppercase">
            Turn Insights Into Action
          </p>
          <h2 className="mt-4 text-[34px] leading-[1.1] font-bold tracking-[-0.035em] text-[#0A0A0B] sm:text-[46px]">
            The right customer.
            <br />
            <span className="text-[#64748B]">The right message.</span>
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-[#52525B]">
            Revisit gives you the customer, the reason to reach out, and a message ready to send.
            You stay in control.
          </p>
        </div>

        {/* 3 Cards Progression */}
        <div className="mt-14 grid items-center gap-5 lg:grid-cols-[1.1fr_auto_1.1fr_auto_1.1fr]">
          {/* Card 1: Trigger / Profile */}
          <div className="flex flex-col justify-between rounded-[24px] bg-white p-5 sm:rounded-[28px] sm:p-7">
            <div>
              <div className="flex items-center gap-3 border-b border-black/[0.04] pb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0A0A0B] text-[16px] font-bold text-white">
                  R
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#0A0A0B]">Rahul Sharma</p>
                  <p className="text-[12px] font-medium text-[#71717A]">Regular customer</p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-[13.5px]">
                <div className="flex items-center justify-between text-[#52525B]">
                  <span>Usually visits</span>
                  <span className="font-semibold text-[#0A0A0B]">Every 9 days</span>
                </div>

                {/* Overdue highlight */}
                <div className="flex items-center justify-between rounded-2xl bg-[#FEF2F2] px-3.5 py-2.5 text-[#991B1B]">
                  <div className="flex items-center gap-2">
                    <IconClock className="h-4 w-4" />
                    <span>Last visit</span>
                  </div>
                  <span className="tabular font-bold">12 days ago</span>
                </div>

                <div className="flex items-center justify-between text-[#52525B]">
                  <div className="flex items-center gap-2">
                    <IconCoffee className="h-4 w-4 text-[#71717A]" />
                    <span>Favorite</span>
                  </div>
                  <span className="font-semibold text-[#0A0A0B]">Cold Coffee</span>
                </div>

                <div className="flex items-center justify-between text-[#52525B]">
                  <div className="flex items-center gap-2">
                    <IconRupee className="h-4 w-4 text-[#71717A]" />
                    <span>Total spent</span>
                  </div>
                  <span className="tabular font-semibold text-[#0A0A0B]">₹4,280</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#ECFDF5] p-3.5 text-[12.5px] text-[#065F46]">
              <span className="font-bold">💡 He&apos;s past his usual visit time.</span> A good time to reach out.
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden justify-center text-[#A1A1AA] lg:flex">
            <IconArrowRight className="h-5 w-5" />
          </div>

          {/* Card 2: WhatsApp Dispatch */}
          <div className="flex flex-col justify-between rounded-[24px] bg-white p-5 sm:rounded-[28px] sm:p-7">
            <div>
              <div className="flex items-center gap-2.5 border-b border-black/[0.04] pb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <IconWhatsApp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13.5px] font-bold text-[#0A0A0B]">Ready to send</p>
                  <p className="text-[11px] text-[#71717A]">A message crafted based on Rahul&apos;s history.</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#FAFAFA] px-3 py-1.5 text-[12px]">
                <span className="text-[#71717A]">To</span>
                <span className="tabular font-semibold text-[#0A0A0B]">+91 98765 43210</span>
              </div>

              {/* Message Bubble */}
              <div className="mt-3 rounded-2xl bg-[#F4F4F5] p-3.5 text-[13px] leading-relaxed text-[#1E293B]">
                <p>Hi Rahul,</p>
                <p className="mt-2">It&apos;s been a while!</p>
                <p>Your usual Cold Coffee is waiting.</p>
                <p className="mt-1">Here&apos;s ₹100 off your next visit this week.</p>
                <p className="mt-1">Hope to see you soon!</p>
                <div className="mt-2 text-right text-[10px] text-[#94A3B8]">112/1,000</div>
              </div>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#047857] text-[13.5px] font-bold text-white transition-colors hover:bg-[#065F46]"
              >
                <IconSend className="h-4 w-4" />
                <span>Send message</span>
              </a>
            </div>

            <p className="mt-3 text-center text-[11px] text-[#71717A]">
              ⓘ You decide when it goes out. Nothing is sent automatically.
            </p>
          </div>

          {/* Arrow 2 */}
          <div className="hidden justify-center text-[#A1A1AA] lg:flex">
            <IconArrowRight className="h-5 w-5" />
          </div>

          {/* Card 3: Financial Return Payoff */}
          <div className="flex flex-col justify-between rounded-[24px] bg-white p-5 sm:rounded-[28px] sm:p-7">
            <div>
              <div className="flex items-center gap-2.5 border-b border-black/[0.04] pb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5] text-[#047857]">
                  <IconCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13.5px] font-bold text-[#0A0A0B]">Message sent</p>
                  <p className="text-[11px] text-[#71717A]">Rahul received your message.</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-5 space-y-4 text-[13px]">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-3 w-3 shrink-0 rounded-full border-2 border-[#0A0A0B] bg-white" />
                  <div>
                    <p className="font-bold text-[#0A0A0B]">Day 0</p>
                    <p className="text-[12px] text-[#71717A]">You sent the message</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-3 w-3 shrink-0 rounded-full border-2 border-[#0A0A0B] bg-white" />
                  <div>
                    <p className="font-bold text-[#0A0A0B]">Day 2</p>
                    <p className="text-[12px] text-[#71717A]">Rahul visits your café</p>
                  </div>
                </div>

                {/* Outcome Node */}
                <div className="mt-3 rounded-2xl bg-[#ECFDF5] p-3.5">
                  <div className="flex items-baseline justify-between">
                    <span className="tabular text-[20px] font-bold text-[#047857]">₹520 bill</span>
                    <span className="text-[11.5px] font-semibold text-[#065F46]">Cold Coffee + Sandwich</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#FAFAFA] p-3 text-center text-[12px] font-medium text-[#52525B]">
              One message can bring back more than just a visit.
            </div>
          </div>
        </div>

        {/* 4 Feature Pillars Below (White Apple Squircles, No Border) */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3.5 rounded-[20px] bg-white p-5 sm:rounded-[24px] sm:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FAFAFA] text-[#0A0A0B]">
              <IconGift className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[14.5px] font-bold text-[#0A0A0B]">Reward</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-[#52525B]">
                Give them a reason to visit again.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-[20px] bg-white p-5 sm:rounded-[24px] sm:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FAFAFA] text-[#0A0A0B]">
              <IconMessageSquare className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[14.5px] font-bold text-[#0A0A0B]">Message</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-[#52525B]">
                Send a personal reminder at the right time.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-[20px] bg-white p-5 sm:rounded-[24px] sm:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FAFAFA] text-[#0A0A0B]">
              <IconUsers className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[14.5px] font-bold text-[#0A0A0B]">Refer</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-[#52525B]">
                Let regular customers bring friends.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-[20px] bg-white p-5 sm:rounded-[24px] sm:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FAFAFA] text-[#0A0A0B]">
              <IconStar className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[14.5px] font-bold text-[#0A0A0B]">Reviews</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-[#52525B]">
                Ask happy customers at the right time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
