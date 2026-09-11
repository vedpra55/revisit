import React from "react";
import Image from "next/image";
import { IconArrowRight } from "./Icons";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#FAFAFA] pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-28">
      <div className="mx-auto w-full max-w-[1140px] px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8">
          {/* Left Column */}
          <div className="max-w-[620px] lg:max-w-none">
            <h1 className="text-[38px] leading-[1.08] font-bold tracking-[-0.04em] text-[#0A0A0B] sm:text-[62px] lg:text-[72px]">
              Know your
              <br />
              customer.
              <br />
              <span className="text-[#64748B]">Bring them back.</span>
            </h1>

            <p className="mt-6 text-[17px] leading-[1.6] text-[#52525B] sm:text-[20px]">
              We remember your regular customers and give them a reason to come
              back — straight from your counter.
            </p>

            <div className="mt-8 flex flex-col items-start gap-2.5">
              <a
                href="#cta"
                className="inline-flex h-[54px] items-center justify-center gap-2.5 rounded-full bg-[#0A0A0B] px-8 text-[15.5px] font-bold text-white transition-all hover:bg-[#27272A]"
              >
                <span>Start 1-week free trial</span>
                <IconArrowRight className="h-4 w-4" />
              </a>
              <p className="text-[13px] text-[#71717A]">
                No charge · Zero commitment required
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-[#71717A] sm:text-[13.5px]">
              <span className="whitespace-nowrap">Takes 10 seconds per bill</span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="sm:whitespace-nowrap">Brings regular customers back more often</span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="whitespace-nowrap font-medium text-[#52525B]">Keep your current POS</span>
            </div>
          </div>

          {/* Right Column: Hero Terminal Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] sm:max-w-[520px]">
              <Image
                src="/images/hero.png"
                alt="Revisit counter tablet terminal and printed receipt"
                width={1214}
                height={1295}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
