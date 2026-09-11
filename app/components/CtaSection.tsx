"use client";

import React, { useState } from "react";
import {
  IconArrowRight,
  IconTrendingUp,
  IconUsers,
  IconHeart,
  IconUser,
  IconStore,
  IconPhone,
  IconWhatsApp,
  IconMail,
} from "./Icons";

export function CtaSection() {
  const [name, setName] = useState("");
  const [cafeName, setCafeName] = useState("");
  const [phone, setPhone] = useState("");
  const [outlets, setOutlets] = useState("1");

  const whatsappMessage = `Hi, I'm ${name.trim() || "interested"} from ${cafeName.trim() || "my café"}. We have ${outlets.trim() || "1"} outlet(s). I would like early access to Revisit! Contact: ${phone.trim() || "my phone"}`;
  const whatsappUrl = `https://wa.me/916203703070?text=${encodeURIComponent(whatsappMessage)}`;
  const mailtoUrl = `mailto:vedna400@gmail.com?subject=${encodeURIComponent("Early Access to Revisit")}&body=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="cta" className="bg-[#FAFAFA] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1140px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Left Column */}
          <div>
            <h2 className="text-[34px] leading-[1.08] font-bold tracking-[-0.035em] text-[#0A0A0B] sm:text-[48px] lg:text-[58px]">
              Keep your
              <br />
              customers
              <br />
              <span className="text-[#64748B]">coming back.</span>
            </h2>

            <p className="mt-5 max-w-[44ch] text-[16px] leading-relaxed text-[#52525B] sm:text-[17.5px]">
              Start with one outlet and see what Revisit can do.
            </p>

            {/* 3 Metric Pills (White, No Border, No Shadow) */}
            <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[#0A0A0B] sm:px-4 sm:py-2 sm:text-[13px]">
                <IconTrendingUp className="h-4 w-4 text-[#047857]" />
                <span>More repeat visits</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[#0A0A0B] sm:px-4 sm:py-2 sm:text-[13px]">
                <IconUsers className="h-4 w-4 text-[#0A0A0B]" />
                <span>Higher customer value</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[#0A0A0B] sm:px-4 sm:py-2 sm:text-[13px]">
                <IconHeart className="h-4 w-4 text-[#E11D48]" />
                <span>Real relationships</span>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="#lead-form"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#0A0A0B] px-8 text-[15.5px] font-bold text-white transition-colors hover:bg-[#27272A]"
              >
                <span>Get early access</span>
                <IconArrowRight className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-6 text-[13px] text-[#71717A]">
              Built for cafés, restaurants and small food businesses.
            </p>
          </div>

          {/* Right Column: Interactive "Let's talk" Form (White Apple Squircle, No Border, No Shadow) */}
          <div id="lead-form" className="relative w-full max-w-full rounded-[24px] bg-white p-5 sm:rounded-[32px] sm:p-8 md:p-9">
            <div>
              <h3 className="text-[22px] font-bold tracking-tight text-[#0A0A0B] sm:text-[24px]">
                Let&apos;s talk
              </h3>
              <p className="mt-1 text-[13.5px] text-[#52525B] sm:text-[14px]">
                Share a few details and we&apos;ll get in touch.
              </p>
            </div>

            {/* Form Fields */}
            <div className="mt-6 space-y-3.5">
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A1A1AA]">
                  <IconUser className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="h-12 w-full rounded-2xl bg-[#FAFAFA] pl-11 pr-4 text-[14px] text-[#0A0A0B] placeholder-[#A1A1AA] outline-hidden focus:ring-2 focus:ring-[#0A0A0B]/20"
                />
              </div>

              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A1A1AA]">
                  <IconStore className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={cafeName}
                  onChange={(e) => setCafeName(e.target.value)}
                  placeholder="Restaurant / Café name"
                  className="h-12 w-full rounded-2xl bg-[#FAFAFA] pl-11 pr-4 text-[14px] text-[#0A0A0B] placeholder-[#A1A1AA] outline-hidden focus:ring-2 focus:ring-[#0A0A0B]/20"
                />
              </div>

              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A1A1AA]">
                  <IconPhone className="h-4 w-4" />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="h-12 w-full rounded-2xl bg-[#FAFAFA] pl-11 pr-4 text-[14px] text-[#0A0A0B] placeholder-[#A1A1AA] outline-hidden focus:ring-2 focus:ring-[#0A0A0B]/20"
                />
              </div>

              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A1A1AA]">
                  <IconStore className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={outlets}
                  onChange={(e) => setOutlets(e.target.value)}
                  placeholder="Number of outlets (e.g. 1)"
                  className="h-12 w-full rounded-2xl bg-[#FAFAFA] pl-11 pr-4 text-[14px] text-[#0A0A0B] placeholder-[#A1A1AA] outline-hidden focus:ring-2 focus:ring-[#0A0A0B]/20"
                />
              </div>
            </div>

            {/* Primary WhatsApp Action */}
            <div className="mt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#047857] px-4 text-[14px] font-bold text-white transition-colors hover:bg-[#065F46] sm:text-[14.5px]"
              >
                <IconWhatsApp className="h-5 w-5 shrink-0" />
                <span>Send on WhatsApp</span>
              </a>
              <p className="mt-2.5 text-center text-[11.5px] text-[#71717A]">
                This will open a WhatsApp chat with <span className="font-semibold text-[#0A0A0B]">+91 6203703070</span>
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-black/[0.06]" />
              <span className="absolute bg-white px-3 text-[11px] text-[#A1A1AA]">or</span>
            </div>

            {/* Secondary Email Action */}
            <a
              href={mailtoUrl}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#F4F4F5] px-4 py-2.5 text-[12.5px] font-semibold text-[#0A0A0B] transition-colors hover:bg-[#E4E4E7] sm:text-[13.5px]"
            >
              <IconMail className="h-4 w-4 shrink-0 text-[#71717A]" />
              <span className="truncate">Send via Email · vedna400@gmail.com</span>
            </a>

            <p className="mt-4 text-center text-[11.5px] leading-relaxed text-[#71717A]">
              We&apos;ll reach out to understand your setup and share early access details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
