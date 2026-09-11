import React from "react";
import { IconPerson, IconArrowRight } from "./Icons";

export function ProblemSection() {
  return (
    <section id="problem" className="bg-[#FAFAFA] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1140px] px-5 sm:px-8">
        {/* Top Header Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1px_0.8fr] lg:items-center">
          <div>
            <p className="text-[11px] font-bold tracking-[0.16em] text-[#71717A] uppercase">
              The Problem
            </p>
            <h2 className="mt-4 text-[34px] leading-[1.1] font-bold tracking-[-0.035em] text-[#0A0A0B] sm:text-[46px]">
              Getting a customer once
              <br />
              is easy.
              <br />
              <span className="text-[#64748B]">Getting them back is harder.</span>
            </h2>
            <p className="mt-4 max-w-[48ch] text-[16.5px] leading-relaxed text-[#52525B]">
              Customers get busy, forget, or choose somewhere else. Most restaurants never
              know until they&apos;re gone.
            </p>
          </div>

          {/* Vertical Divider */}
          <div className="hidden h-36 w-px bg-black/[0.06] lg:block" />

          {/* Right Stat */}
          <div className="lg:pl-4">
            <p className="tabular text-[56px] leading-none font-bold tracking-tight text-[#0A0A0B] sm:text-[68px]">
              ~70%
            </p>
            <p className="mt-3 text-[15.5px] leading-snug font-medium text-[#52525B]">
              of first-time restaurant customers never return for a second visit.
            </p>
            <p className="mt-4 text-[12px] text-[#A1A1AA]">
              Source: Petpooja, 2023
            </p>
          </div>
        </div>

        {/* The 10-Person Customer Drop-off Funnel Card (Apple Squircle White, No Border) */}
        <div className="mt-16 rounded-[24px] bg-white p-5 sm:rounded-[28px] sm:p-10">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
            {/* Stage 1: 100 First-Time */}
            <div className="flex flex-col items-center text-center">
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <IconPerson key={i} className="h-5 w-5 text-[#0A0A0B] sm:h-6 sm:w-6" />
                ))}
              </div>
              <p className="tabular mt-4 text-[22px] font-bold text-[#0A0A0B]">100</p>
              <p className="text-[13px] text-[#71717A]">first-time customers</p>
            </div>

            {/* Arrow 1 */}
            <div className="hidden pt-6 text-[#A1A1AA] md:block">
              <IconArrowRight className="h-5 w-5" />
            </div>

            {/* Stage 2: ~30 Return */}
            <div className="flex flex-col items-center text-center">
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <IconPerson
                    key={i}
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      i < 3 ? "text-[#0A0A0B]" : "text-[#D4D4D8]"
                    }`}
                  />
                ))}
              </div>
              <p className="tabular mt-4 text-[22px] font-bold text-[#0A0A0B]">~30</p>
              <p className="text-[13px] text-[#71717A]">come back for a second visit</p>
            </div>

            {/* Arrow 2 */}
            <div className="hidden pt-6 text-[#A1A1AA] md:block">
              <IconArrowRight className="h-5 w-5" />
            </div>

            {/* Stage 3: Only a few become regular customers */}
            <div className="flex flex-col items-center text-center">
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <IconPerson
                    key={i}
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      i < 1 ? "text-[#0A0A0B]" : "text-[#D4D4D8]"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 text-[22px] font-bold text-[#0A0A0B]">Only a few</p>
              <p className="text-[13px] text-[#71717A]">become regular customers</p>
            </div>
          </div>

          {/* Bottom Punchline */}
          <div className="mt-12 flex items-center justify-center border-t border-black/[0.04] pt-8 text-center">
            <p className="text-[15px] leading-relaxed text-[#52525B]">
              <span className="font-bold text-[#0A0A0B]">
                The problem isn’t getting people through the door.
              </span>{" "}
              It’s giving them a reason to come back.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
