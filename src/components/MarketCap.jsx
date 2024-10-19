import React, { useEffect, useState } from "react";
import axios from "axios";

const MarketCap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchMarketTrend() {
    try {
      const response = await axios.get(
        "https://api.mobula.io/api/1/metadata/trendings"
      );
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMarketTrend();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Market Cap Trends</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <img
                src={item.logo}
                alt={`${item.name} logo`}
                className="w-16 h-16 mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-500">{item.symbol}</p>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-medium">Trending Score</h3>
              <p className="text-gray-700">{item.trending_score}</p>
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-medium">Price Change (24h)</h3>
              <p
                className={`text-lg ${
                  item.price_change_24h >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.price_change_24h >= 0 ? "+" : ""}
                {item.price_change_24h}%
              </p>
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-medium">Contracts</h3>
              {item.contracts.map((contract, index) => (
                <div key={index} className="text-gray-700">
                  <p>Address: {contract.address}</p>
                  <p>Blockchain: {contract.blockchain}</p>
                  <p>Decimals: {contract.decimals}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-lg font-medium">Platforms</h3>
              {item.platforms.map((platform, index) => (
                <div key={index} className="text-gray-700">
                  <p>
                    {platform.name} - Rank: {platform.rank}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketCap;
