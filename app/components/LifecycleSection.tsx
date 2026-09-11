import React from "react";
import Image from "next/image";
import { IconTrendingUp } from "./Icons";

const STAGES = [
  {
    step: "1",
    img: "/assets/lifecycle/1_first_visit.png",
    title: "First visit",
    desc: "They discover your café.",
  },
  {
    step: "2",
    img: "/assets/lifecycle/2_they_return.png",
    title: "They return",
    desc: "You stay on their radar.",
  },
  {
    step: "3",
    img: "/assets/lifecycle/3_become_regular.png",
    title: "They become a regular",
    desc: "More visits. Higher spend.",
  },
  {
    step: "4",
    img: "/assets/lifecycle/4_get_rewarded.png",
    title: "They get rewarded",
    desc: "Personal offers bring them back again.",
  },
  {
    step: "5",
    img: "/assets/lifecycle/5_bring_friend.png",
    title: "They bring a friend",
    desc: "Happy customers create new customers.",
  },
];

export function LifecycleSection() {
  return (
    <section id="impact" className="bg-[#FAFAFA] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1140px] px-5 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-[700px] text-center">
          <p className="text-[11px] font-bold tracking-[0.16em] text-[#71717A] uppercase">
            Real Business Impact
          </p>
          <h2 className="mt-4 text-[34px] leading-[1.1] font-bold tracking-[-0.035em] text-[#0A0A0B] sm:text-[46px]">
            More customers come back.
            <br />
            <span className="text-[#64748B]">And some bring others with them.</span>
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-[#52525B]">
            Revisit turns customer history into repeat visits, regular customers, and
            word-of-mouth — so the value of each customer keeps growing.
          </p>
        </div>

        {/* 5-Stage Illustration Cards (White Apple Squircles, No Border, No Shadow) */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STAGES.map((s) => (
            <div
              key={s.title}
              className="flex flex-col items-center rounded-[24px] bg-white p-5 text-center"
            >
              <div className="relative aspect-square w-full max-w-[140px] overflow-hidden rounded-[20px] bg-[#FAFAFA] p-2">
                <Image
                  src={s.img}
                  alt={s.title}
                  width={200}
                  height={200}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-4 text-[15px] font-bold text-[#0A0A0B]">{s.title}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-[#71717A]">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom Banner (White Apple Squircle, No Border, No Shadow) */}
        <div className="mt-12 rounded-[28px] bg-white p-6 sm:p-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#047857]">
              <IconTrendingUp className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[19px] font-bold tracking-tight text-[#0A0A0B] sm:text-[22px]">
                One customer can lead to many more.
              </p>
              <p className="mt-1 text-[14.5px] text-[#52525B]">
                That&apos;s the loop Revisit is built to create.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
