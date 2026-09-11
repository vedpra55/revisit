import React from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProblemSection } from "./components/ProblemSection";
import { CounterSection } from "./components/CounterSection";
import { ActionSection } from "./components/ActionSection";
import { LifecycleSection } from "./components/LifecycleSection";
import { CtaSection } from "./components/CtaSection";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-full bg-[#FAFAFA] text-[#0A0A0B] selection:bg-[#0A0A0B] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <CounterSection />
        <ActionSection />
        <LifecycleSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
