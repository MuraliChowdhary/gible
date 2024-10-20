import React from "react";
import { HeroSection } from "@/components/HeroSection";
import SupportedCurrencies from "@/components/SupportedCurrencies";
import { HowToUse } from "@/components/HowToUse";
import { GlobalFooter } from "@/components/GlobalFooter";

function Page() {
  return (
    <div className="min-h-screen bg-[#192231]">
      <HeroSection />
      <HowToUse />
      <SupportedCurrencies />
      <GlobalFooter />
    </div>
  );
}

export default Page;
