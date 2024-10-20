'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ArrowDownUp } from "lucide-react";

const steps = [
  {
    title: "Select Currencies",
    description: "Choose the currencies you want to swap from and to",
    icon: "1"
  },
  {
    title: "Enter Amount",
    description: "Specify how much you want to exchange",
    icon: "2"
  },
  {
    title: "Review & Confirm",
    description: "Check the exchange rate and confirm your swap",
    icon: "3"
  },
  {
    title: "Complete Swap",
    description: "Receive your exchanged currencies instantly",
    icon: "4"
  },
];

const ShineBorder = ({ children, className }) => (
  <div className={`relative group h-full flex flex-col ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
    <div className="relative bg-[#1F2937] p-8 rounded-xl flex-1 flex flex-col">{children}</div>
  </div>
);

const AnimatedCard = ({ step, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div 
        className={`transform transition-transform duration-500 ${isVisible ? 'translate-y-0' : 'translate-y-10'}`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <ShineBorder className="min-h-[170px]">
          <div className="flex items-start mb-4">
            <span className="bg-gradient-to-br from-[#512DA8] to-[#8E24AA] text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold mr-4 text-xl shadow-lg flex-shrink-0">
              {step.icon}
            </span>
            <div>
              <h3 className="font-bold text-2xl text-white mb-2">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </div>
          </div>
        </ShineBorder>
      </div>
    </div>
  );
};

export const HowToUse = () => (
  <div className="py-20 px-4 bg-[#111827]">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16 animate-fadeIn">
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-gradient-to-br from-[#512DA8] to-[#8E24AA] rounded-full shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
            <ArrowDownUp size={48} className="text-white animate-spin-slow" />
          </div>
        </div>
        <h2 className="text-4xl font-extrabold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-[#512DA8] to-[#8E24AA]">How to Use</h2>
        <p className="text-gray-300 text-xl">Complete your swap in just a few simple steps</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <AnimatedCard key={index} step={step} index={index} />
        ))}
      </div>
    </div>
  </div>
);

export default HowToUse;
