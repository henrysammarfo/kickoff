import { createFileRoute } from "@tanstack/react-router";
import { ScrollytellingCanvas } from "@/components/ScrollytellingCanvas";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import {
  WhatItIs, HowItWorks, Features, Proof, FinalCTA, SiteFooter, Spacer,
} from "@/components/Sections";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <>
      <ScrollytellingCanvas />
      <div className="relative z-10">
        <SiteHeader />
        <Hero />
        <Spacer />
        <WhatItIs />
        <Spacer />
        <HowItWorks />
        <Spacer />
        <Features />
        <Spacer />
        <Proof />
        <Spacer />
        <FinalCTA />
        <SiteFooter />
      </div>
    </>
  );
}
