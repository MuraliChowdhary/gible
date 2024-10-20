import { ArrowDownUp } from "lucide-react";
import ShineBorder from "./ui/shine-border";

const steps = [
  {
    title: "Select Currencies",
    description: "Choose the currencies you want to swap from and to",
  },
  {
    title: "Enter Amount",
    description: "Specify how much you want to exchange",
  },
  {
    title: "Review & Confirm",
    description: "Check the exchange rate and confirm your swap",
  },
  {
    title: "Complete Swap",
    description: "Receive your exchanged currencies instantly",
  },
];

export const HowToUse = () => (
  <div className="py-20 px-4 bg-[#111827]">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-[#512DA8]/20 rounded-full">
            <ArrowDownUp size={40} className="text-[#512DA8]" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-white">How to Use</h2>
        <p className="text-gray-400">Complete your swap in just a few simple steps</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((step, index) => (
          <ShineBorder
            key={index}
            className="bg-[#1F2937] p-8 rounded-xl border border-gray-700 hover:border-[#512DA8] transition-all group">
                {/* <ShineBorder /> */}
            <div className="flex items-center mb-4">
              <span className="bg-[#512DA8] text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold mr-4 group-hover:scale-110 transition-transform">
                {index + 1}
              </span>
              <h3 className="font-bold text-xl text-white">{step.title}</h3>
            </div>
            <p className="text-gray-400 ml-14">{step.description}</p>
          </ShineBorder>
        ))}
      </div>
    </div>
  </div>
);
