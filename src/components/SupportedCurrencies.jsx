'use client'
import { useState, useEffect, useRef } from 'react';
import { Coins } from "lucide-react";

const supportedCurrencies = [
  "Bitcoin (BTC)",
  "Ethereum (ETH)",
  "Solana (SOL)",
  "USD Coin (USDC)",
  "Tether (USDT)",
  "Cardano (ADA)",
  "Polygon (MATIC)",
  "Binance Coin (BNB)",
  "Ripple (XRP)",
  "Avalanche (AVAX)",
];

export default function SupportedCurrencies() {
  const [count, setCount] = useState(0);
  const targetNumber = 400;
  const containerRef = useRef(null);
  const animationTriggeredRef = useRef(false);
  
  const startAnimation = () => {
    setCount(0);
    animationTriggeredRef.current = true;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetNumber / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        setCount(targetNumber);
        clearInterval(timer);
        animationTriggeredRef.current = false;
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animationTriggeredRef.current) {
          startAnimation();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div className="py-20 px-4 bg-[#192231]" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#512DA8]/20 rounded-full">
              <Coins size={40} className="text-[#512DA8]" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">Supported Currencies</h2>
          <div className="text-3xl font-bold text-[#6237c8] mb-4">
            {count}+ currencies supported
          </div>
          <p className="text-gray-400">Trade seamlessly between these popular cryptocurrencies</p>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex overflow-x-auto pb-6 scrollbar-hide snap-x">
            <div className="flex space-x-4 animate-scroll">
              {[...supportedCurrencies, ...supportedCurrencies].map((currency, index) => (
                <div
                  key={index}
                  className="flex-none w-64 snap-center"
                >
                  <div className="bg-[#1F2937] p-6 rounded-xl text-center hover:bg-[#1F2937]/80 transition-all cursor-pointer border border-gray-700 hover:border-[#512DA8]">
                    <span className="font-medium text-white">{currency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#192231] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#192231] to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}