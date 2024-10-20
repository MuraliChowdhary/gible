import { Globe } from "lucide-react";

export const GlobalFooter = () => (
  <div className="bg-[#131b2c] py-16 px-4 border-t border-gray-800">
    <div className="max-w-4xl mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-[#512DA8]/20 rounded-full">
          <Globe size={32} className="text-[#512DA8]" />
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white">Available Worldwide</h3>
      <p className="text-gray-400 max-w-xl mx-auto">
        Experience seamless cryptocurrency swaps from anywhere in the world, with 24/7 support and lightning-fast transactions
      </p>
    </div>
  </div>
);