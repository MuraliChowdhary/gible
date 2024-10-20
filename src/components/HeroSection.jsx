import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => (
  <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-[#111827] py-24 px-4">
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-r from-[#512DA8]/20 to-transparent" />
      <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-[#512DA8]/20 blur-3xl" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-[#512DA8]/30 blur-3xl" />
    </div>

    <div className="relative max-w-4xl mx-auto text-center">
      <div className="inline-block mb-6 px-6 py-2 bg-[#512DA8]/20 rounded-full">
        <span className="text-[#512DA8] font-semibold">
          New: Multi-chain swaps available
        </span>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white bg-clip-text">
        Transform Your Crypto Trading Experience
      </h1>
      <p className="text-xl md:text-2xl mb-12 text-gray-300">
        Lightning-fast cryptocurrency exchanges with institutional-grade security and best-in-class rates
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/swap">
        <button className="bg-[#512DA8] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#512DA8]/90 transition-all flex items-center justify-center group">
          Start Swapping Now
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
        </Link>
        <Link href="/market-cap">
        <button className="border border-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/5 transition-all">
          View Market Cap
        </button>
        </Link>
      </div>
    </div>
  </div>
);
