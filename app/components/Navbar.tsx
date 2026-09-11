import React from "react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.04] bg-[#FAFAFA]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1140px] items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="text-[20px] font-bold tracking-tight text-[#0A0A0B]">revisit</span>
        </a>

        <nav className="hidden items-center gap-8 text-[14px] font-medium text-[#52525B] sm:flex">
          <a href="#problem" className="transition-colors hover:text-black">Why Revisit</a>
          <a href="#counter" className="transition-colors hover:text-black">How it works</a>
          <a href="#action" className="transition-colors hover:text-black">Benefits</a>
          <a href="#impact" className="transition-colors hover:text-black">For restaurants</a>
        </nav>

        <div>
          <a
            href="#cta"
            className="inline-flex h-10 items-center rounded-full bg-[#0A0A0B] px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#27272A]"
          >
            Get early access
          </a>
        </div>
      </div>
    </header>
  );
}
