import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-black/[0.04] bg-[#FAFAFA] py-12">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col items-center justify-between gap-6 px-5 text-center sm:flex-row sm:px-8 sm:text-left">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className="text-[18px] font-bold tracking-tight text-[#0A0A0B]">revisit</span>
          <span className="text-[13px] text-[#71717A]">
            · Customer retention for independent cafés &amp; restaurants
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] text-[#71717A]">
          <a href="#problem" className="transition-colors hover:text-black">Problem</a>
          <a href="#counter" className="transition-colors hover:text-black">Counter Flow</a>
          <a href="#action" className="transition-colors hover:text-black">WhatsApp</a>
          <a href="#impact" className="transition-colors hover:text-black">Growth Loop</a>
          <a href="#cta" className="font-semibold text-[#0A0A0B] hover:underline">Get Early Access</a>
        </div>
      </div>
    </footer>
  );
}
