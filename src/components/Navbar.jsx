'use client';

import React from "react";
import { Dock, DockIcon } from "./ui/dock";
import Link from "next/link";
import { Home, Repeat2, TrendingUp } from 'lucide-react';
import { BorderBeam } from "./ui/border-beam";

const Navbar = () => {
  const iconSize = 24;

  return (
    <Dock 
      className="fixed top-1  z-50 flex justify-center items-center gap-9 left-1/2 transform -translate-x-1/2 bg-[#192231] rounded-2xl p-2 px-16 shadow-lg backdrop-blur-sm"
      direction="bottom"
    >
        <BorderBeam/>
      {/* Home Icon */}
      <DockIcon className="relative group">
        <Link 
          href="/" 
          className="flex  flex-col items-center justify-center p-3 rounded-xl transition-all duration-300
                     bg-[#4a5564] hover:bg-[#512DA8] hover:scale-110 text-gray-300 hover:text-white"
        >
          <div className="flex items-center justify-center">
            <Home size={iconSize} />
          </div>
          <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-sm whitespace-nowrap bg-[#111827] px-2 py-1 rounded">
            Home
          </span>
        </Link>
      </DockIcon>

      {/* Swap Icon */}
      <DockIcon className="relative group">
        <Link 
          href="/swap" 
          className="flex  flex-col items-center justify-center p-3 rounded-xl transition-all duration-300
                     bg-[#4a5564] hover:bg-[#512DA8] hover:scale-110 text-gray-300 hover:text-white"
        >
          <div className="flex items-center justify-center">
            <Repeat2 size={iconSize} />
          </div>
          <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-sm whitespace-nowrap bg-[#111827] px-2 py-1 rounded">
            Swap
          </span>
        </Link>
      </DockIcon>

      {/* Market Cap Icon */}
      <DockIcon className="relative group">
        <Link 
          href="/market-cap" 
          className="flex  flex-col items-center justify-center p-3 rounded-xl transition-all duration-300
                     bg-[#4a5564] hover:bg-[#512DA8] hover:scale-110 text-gray-300 hover:text-white"
        >
          <div className="flex items-center justify-center">
            <TrendingUp size={iconSize} /> 
          </div>
          <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-sm whitespace-nowrap bg-[#111827] px-2 py-1 rounded">
            Market Cap
          </span>
        </Link>
      </DockIcon>
    </Dock>
  );
};

export default Navbar;
