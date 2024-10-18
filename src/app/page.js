"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
import { ArrowUpDown, ChevronDown, Settings, Github } from "lucide-react";
import dynamic from "next/dynamic";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

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
  const [slippage, setSlippage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);
  const [tokenPrices, setTokenPrices] = useState({});
  const [buyTokenUSD, setBuyTokenUSD] = useState(null);
  const [sellTokenUSD, setSellTokenUSD] = useState(null);

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

  const handleCalculateOutAmts = (amt, token) => {
    // Special handling for USDC and USDT on Solana
    if (
      (token.symbol === "USDC" || token.symbol === "USDT") &&
      token.address.startsWith("EPj")
    ) {
      return amt / Math.pow(10, 6);
    }
    // For all other tokens, use the token's decimals
    return amt / Math.pow(10, token.decimals);
  };

  // Usage in fetchQuoteResponse
  const fetchQuoteResponse = useCallback(async () => {
    if (!sellToken || !buyToken || !sellAmount) return;

    const parsedSellAmount = parseFloat(sellAmount);
    const slippageBps = slippage * 100;
    const apiUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${
      sellToken.address
    }&outputMint=${buyToken.address}&amount=${Math.floor(
      parsedSellAmount * Math.pow(10, sellToken.decimals)
    )}&slippageBps=${slippageBps}`;

    try {
      const response = await axios.get(apiUrl);
      if (response.data) {
        console.log(response.data);
        const quoteData = response.data;
        setQuoteResponse(quoteData);
        console.log(quoteResponse);

        const outputAmount = handleCalculateOutAmts(
          quoteData.outAmount,
          buyToken
        );
        setBuyAmount(outputAmount.toFixed(6));
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  }, [sellToken, buyToken, sellAmount, slippage]);
  async function fetchUsdPrices(token) {
    const response = await axios.get(
      `https://api.jup.ag/price/v2?ids=${token.address}`
    );
    if (token == buyToken)
      setBuyTokenUSD(response.data.data[token.address].price);
    else setSellTokenUSD(response.data.data[token.address].price);
  }
  useEffect(() => {
    if (isClient) {
      fetchQuoteResponse();
      fetchUsdPrices(sellToken);
      fetchUsdPrices(buyToken);
    }
  }, [fetchQuoteResponse, isClient]);

  const handleSwap = async () => {
    console.log("Swap initiated");
    // Implement the actual swap logic here
  };

  const TokenSelector = ({
    isOpen,
    setIsOpen,
    selectedToken,
    setSelectedToken,
    label,
  }) => (
    <div className="w-full border rounded-xl border-gray-700 bg-gray-800 p-3 relative">
      <label className="text-sm text-gray-400 font-medium">{label}</label>
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
          <ChevronDown className="ml-2 w-4 h-4" />
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

        {selectedToken === buyToken ? (
          <p className="text-lg font-bold text-green-600">
            ${buyTokenUSD.toLocaleString()}
          </p>
        ) : (
          <p className="text-lg font-bold text-red-600">
            ${sellTokenUSD.toLocaleString()}
          </p>
        )}
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
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
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
                    max="5"
                    step="0.1"
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-gray-400 mt-2">
                    <span>0%</span>
                    <span>{slippage}%</span>
                    <span>5%</span>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white flex justify-center items-center p-4">
      <div className="max-w-6xl w-full bg-gray-900 rounded-2xl p-8 shadow-lg flex flex-col md:flex-row">
        {/* Left side: Swap interface */}
        <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gible Swap</h1>
            <div className="flex items-center gap-4">
              {isClient && <WalletMultiButton />}
              <a
                href="https://github.com/YadlaMani/gible"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-6 h-6 text-white hover:text-gray-300 transition-colors" />
              </a>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Settings
                  className="w-5 h-5 cursor-pointer text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsSlippageModalOpen(true)}
                />
                <span className="text-sm text-gray-400">
                  Slippage: {slippage}%
                </span>
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
                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <ArrowUpDown className="w-5 h-5" />
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
              disabled={true}
              className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {isClient
                ? wallet.connected
                  ? "Insufficient Balance"
                  : "Connect Wallet"
                : "Loading..."}
            </button>
          </div>
          {isClient && quoteResponse && (
            <div className="mt-4 text-center text-gray-400">
              <p>
                Exchange Rate: 1 {sellToken?.symbol} ≈{" "}
                {parseFloat(buyAmount / sellAmount).toFixed(6)}{" "}
                {buyToken?.symbol}
              </p>
            </div>
          )}
        </div>

        {/* Right side: Gible image */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl p-4 w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src="https://d.furaffinity.net/art/thundurburd/1566605711/1566605711.thundurburd_gible_bounce.gif"
              alt="Gible"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      <SlippageModal />
    </div>
  );
};

export default Home;
