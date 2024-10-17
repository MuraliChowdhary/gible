"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
import { ArrowUpDown, ChevronDown, Settings } from "lucide-react";
import dynamic from "next/dynamic";
import { Dialog, Transition } from "@headlessui/react"; // For the slippage modal
import { Fragment } from "react";

// Dynamically import WalletMultiButton with ssr option set to false
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const Home = () => {
  const [tokens, setTokens] = useState([]);
  const [sellToken, setSellToken] = useState(null);
  const [buyToken, setBuyToken] = useState(null);
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [isSellingOpen, setIsSellingOpen] = useState(false);
  const [isBuyingOpen, setIsBuyingOpen] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState(null);
  const [slippage, setSlippage] = useState(1); // Slippage
  const [isClient, setIsClient] = useState(false);
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false); // Modal state for slippage

  const wallet = useWallet();

  useEffect(() => {
    setIsClient(true);
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await axios.get(
        "https://tokens.jup.ag/tokens?tags=verified"
      );
      setTokens(response.data);
      setSellToken(response.data[0]);
      setBuyToken(response.data[1]);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  const hancalculateOutAmts = (amt, token) => {
    const outAmountNumber = amt / Math.pow(10, token.decimals);
    return outAmountNumber;
  };

  const fetchQuoteResponse = useCallback(async () => {
    const parsedSellAmount = parseFloat(sellAmount);
    const slippageBps = slippage * 100;
    const apiUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${
      sellToken.address
    }&outputMint=${buyToken.address}&amount=${Math.floor(
      parsedSellAmount * LAMPORTS_PER_SOL
    )}&slippageBps=${slippageBps}`;

    try {
      const response = await axios.get(apiUrl);
      if (response.data) {
        console.log(response.data);
        const quoteData = response.data;
        setQuoteResponse(quoteData);

        const outputAmount = hancalculateOutAmts(quoteData.outAmount, buyToken);
        setBuyAmount(outputAmount.toFixed(6));
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  }, [sellToken, buyToken, sellAmount, slippage]);

  useEffect(() => {
    if (isClient) {
      fetchQuoteResponse();
    }
  }, [fetchQuoteResponse, isClient]);

  const handleSwap = async () => {
    console.log("Swap initiated");
  };

  // Slippage Modal
  const SlippageModal = () => (
    <Transition appear show={isSlippageModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsSlippageModalOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform bg-gray-900 rounded-lg p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Set Slippage Tolerance
                </Dialog.Title>
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-gray-400">
                    <span>0%</span>
                    <span>{slippage}%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={() => setIsSlippageModalOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
  const TokenSelector = ({
    isOpen,
    setIsOpen,
    selectedToken,
    setSelectedToken,
    label,
  }) => (
    <div className="w-full border rounded-xl border-gray-700 bg-gray-800 p-3 relative">
      <label className="text-lg text-gray-400 font-bold">{label}</label>
      <div className="relative w-full mt-2 flex items-center justify-between">
        <div
          onClick={() => setIsClient && setIsOpen(!isOpen)}
          className="cursor-pointer select-none bg-gray-700 text-sm py-2 px-3 rounded flex items-center justify-between w-full max-w-[12rem]"
        >
          <div className="flex items-center gap-2">
            {isClient && selectedToken && (
              <img
                src={selectedToken.logoURI}
                className="w-6 h-6 rounded-full"
                alt={selectedToken.symbol}
              />
            )}
            <h3 className="font-bold text-base">
              {selectedToken?.symbol || ""}
            </h3>
          </div>
          <ChevronDown className="ml-2" />
        </div>
        <input
          className="w-full text-right bg-transparent text-xl border-none outline-none"
          placeholder="0.00"
          value={label === "You're Selling" ? sellAmount : buyAmount}
          onChange={(e) => {
            if (label === "You're Selling") {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                setSellAmount(value);
              }
            }
          }}
          readOnly={label === "You're Buying"}
        />
      </div>
      {isClient && isOpen && (
        <div className="absolute z-10 mt-2 w-full max-w-[12rem] max-h-40 overflow-auto bg-gray-800 border border-gray-700 rounded-md shadow-lg">
          {tokens.map((token) => (
            <div
              key={token.address}
              className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setSelectedToken(token);
                setIsOpen(false);
              }}
            >
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span>{token.symbol}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white flex justify-center items-center">
      <div className="max-w-4xl w-full bg-gray-900 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Solana Swap</h1>
          {isClient && <WalletMultiButton />}
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Settings
                className="w-6 h-6 cursor-pointer"
                onClick={() => setIsSlippageModalOpen(true)}
              />
              <span className="text-sm">Slippage: {slippage}%</span>
            </div>
          </div>
          <TokenSelector
            isOpen={isSellingOpen}
            setIsOpen={setIsSellingOpen}
            selectedToken={sellToken}
            setSelectedToken={setSellToken}
            label="You're Selling"
          />
          <div className="flex justify-center">
            <button
              onClick={() => {
                const temp = sellToken;
                setSellToken(buyToken);
                setBuyToken(temp);
              }}
              className="bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors"
            >
              <ArrowUpDown className="w-6 h-6" />
            </button>
          </div>
          <TokenSelector
            isOpen={isBuyingOpen}
            setIsOpen={setIsBuyingOpen}
            selectedToken={buyToken}
            setSelectedToken={setBuyToken}
            label="You're Buying"
          />
          <button
            onClick={handleSwap}
            disabled={!isClient || !wallet.connected || sellAmount <= 0}
            className="w-full bg-blue-500 text-white p-3 rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isClient
              ? wallet.connected
                ? "Swap"
                : "Connect Wallet"
              : "Loading..."}
          </button>
        </div>
        <button onClick={fetchQuoteResponse}>Calculate Out Amount</button>
        {isClient && quoteResponse && (
          <div className="mt-4 text-center">
            <p>
              Exchange Rate: 1 {sellToken?.symbol} ≈ {buyAmount}{" "}
              {buyToken?.symbol}
            </p>
          </div>
        )}
      </div>
      <SlippageModal />
    </div>
  );
};

export default Home;
