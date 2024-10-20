'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MarketCap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});

  const placeholderImage = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full//443.png';

  const fetchMarketTrend = async () => {
    try {
      const response = await axios.get(
        'https://api.mobula.io/api/1/metadata/trendings'
      );
      setData(response.data);
      setFilteredData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketTrend();
  }, []);

  useEffect(() => {
    const filterResults = () => {
      const searchTerm = searchQuery.toLowerCase().trim();
      if (!searchTerm) {
        setFilteredData(data);
        return;
      }
      const filtered = data.filter((item) => {
        const name = (item.name || '').toLowerCase();
        return name.includes(searchTerm);
      });
      setFilteredData(filtered);
    };
    filterResults();
  }, [searchQuery, data]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleExpandCard = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 mt-40 bg-[#111827]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[300px] rounded-xl bg-[#1F2937]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-40 flex items-center justify-center bg-[#111827]">
        <Card className="p-6 bg-[#192231] border-[#512DA8]">
          <CardTitle className="text-red-400 flex items-center gap-2">
            <span>Error occurred</span>
          </CardTitle>
          <p className="mt-2 text-gray-400">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-28 text-gray-100 bg-[#111827] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className='flex flex-col gap-4'>
            <h1 className="text-6xl font-bold flex items-center gap-4 text-white">
              <TrendingUp className="h-16 w-16 text-[#512DA8]" />
              Market Cap Trends
            </h1>
            <p className="text-gray-400 text-3xl mt-2">
              Track the latest trending cryptocurrencies and their performance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Card 
              key={item.id} 
              className="hover:shadow-lg transition-shadow duration-200 bg-[#192231] border-[#1F2937] hover:border-[#512DA8]"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.logo || placeholderImage}
                      alt={`${item.name} logo`}
                      className="w-12 h-12 rounded-full bg-[#1F2937]"
                    />
                    <div>
                      <CardTitle className="text-xl text-white">{item.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1 bg-[#1F2937] text-gray-300">
                        {item.symbol}
                      </Badge>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-lg font-medium ${
                      item.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {item.price_change_24h >= 0 ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5" />
                    )}
                    {Math.abs(item.price_change_24h)}%
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-[#1F2937] p-3 rounded-lg">
                    <h3 className="font-semibold mb-2 text-sm text-gray-400">
                      Trending Score
                    </h3>
                    <div className="w-full bg-[#111827] rounded-full h-2.5">
                      <div
                        className="bg-[#512DA8] h-2.5 rounded-full"
                        style={{ width: `${Math.min(item.trending_score * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-sm mt-1 text-gray-300">
                      {item.trending_score.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-gray-400">
                      Available on
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {item.platforms.map((platform, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          className="border-[#512DA8] text-gray-300 bg-[#1F2937]"
                        >
                          {platform.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-gray-400">
                      Contracts
                    </h3>
                    <div
                      className={`max-h-24 overflow-auto bg-[#1F2937] p-2 rounded-md transition-all duration-300 ${
                        expandedCards[item.id] ? 'max-h-[400px]' : ''
                      }`}
                    >
                      {item.contracts.map((contract, index) => (
                        <div key={index} className="p-2">
                          <p className="text-xs font-mono text-gray-300">
                            {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                          </p>
                          <Badge 
                            variant="secondary" 
                            className="mt-1 bg-[#111827] text-gray-300"
                          >
                            {contract.blockchain}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    {item.contracts.length > 2 && (
                      <button
                        onClick={() => toggleExpandCard(item.id)}
                        className="text-[#512DA8] hover:text-[#512DA8]/80 mt-2 transition-colors"
                      >
                        {expandedCards[item.id] ? 'Show Less' : 'Read More'}
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-400">No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketCap;