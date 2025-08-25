import React, { useState, useMemo, useCallback } from 'react';
import { getPriceTrendForecast } from '../services/geminiService';
import type { MarketPrice } from '../types';
import { SearchIcon, SparklesIcon, AlertTriangleIcon } from './common/Icons';

// Mock data for market prices
const mockMarketPrices: MarketPrice[] = [
  { crop: 'Rice', variety: 'Sona Masoori', market: 'Hyderabad', price: 4500, change: 1.2 },
  { crop: 'Cotton', variety: 'Long Staple', market: 'Guntur', price: 7200, change: -0.5 },
  { crop: 'Tomato', variety: 'Hybrid', market: 'Madanapalle', price: 2500, change: 3.5 },
  { crop: 'Wheat', variety: 'Lokwan', market: 'Indore', price: 2300, change: 0.8 },
  { crop: 'Soybean', variety: 'JS-335', market: 'Nagpur', price: 5100, change: -1.1 },
  { crop: 'Maize', variety: 'Hybrid', market: 'Karimnagar', price: 2100, change: 2.0 },
  { crop: 'Chilli', variety: 'Teja', market: 'Guntur', price: 18000, change: -2.3 },
  { crop: 'Turmeric', variety: 'Finger', market: 'Nizamabad', price: 8500, change: 1.5 },
  { crop: 'Onion', variety: 'Red', market: 'Kurnool', price: 1800, change: 5.1 },
];

const MarketAccess: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>(mockMarketPrices[0].crop);
  const [forecast, setForecast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredPrices = useMemo(() => {
    if (!searchQuery) return mockMarketPrices;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return mockMarketPrices.filter(
      (p) =>
        p.crop.toLowerCase().includes(lowerCaseQuery) ||
        p.variety.toLowerCase().includes(lowerCaseQuery) ||
        p.market.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery]);
  
  const uniqueCrops = useMemo(() => [...new Set(mockMarketPrices.map(p => p.crop))], []);

  const handleGetForecast = useCallback(async () => {
    if (!selectedCrop) return;

    setLoading(true);
    setForecast(null);
    setError(null);

    try {
      const result = await getPriceTrendForecast(selectedCrop);
      setForecast(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [selectedCrop]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Market Access & Price Trends</h1>
      <p className="mt-2 text-gray-600">
        View real-time market prices and get AI-powered price forecasts to make informed selling decisions.
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700">Live Market Prices</h2>
        <div className="mt-4 mb-6 relative">
          <input
            type="text"
            placeholder="Search by crop, variety, or market..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-lg pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variety</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₹/Quintal)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrices.map((p, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.crop}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.variety}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.market}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${p.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {p.change >= 0 ? `+${p.change}` : p.change}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPrices.length === 0 && <p className="p-4 text-center text-gray-500">No matching records found.</p>}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
          <SparklesIcon className="h-7 w-7 text-green-600 mr-3" />
          AI Price Trend Forecaster
        </h2>
        <p className="mt-2 text-gray-600">
          Select a crop to get an AI-generated price trend forecast for the upcoming weeks.
        </p>
        
        <div className="mt-6 p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                    <label htmlFor="crop-select" className="block text-sm font-medium text-gray-700">Select Crop</label>
                    <select
                        id="crop-select"
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                        {uniqueCrops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                    </select>
                </div>
                <button
                    onClick={handleGetForecast}
                    disabled={loading || !selectedCrop}
                    className="w-full sm:w-auto mt-2 sm:mt-6 inline-flex justify-center items-center px-6 py-2.5 border border-transparent font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                >
                    {loading ? (
                        <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Forecasting...</>
                    ) : (
                        <><SparklesIcon className="-ml-1 mr-2 h-5 w-5" />Get Forecast</>
                    )}
                </button>
            </div>
        </div>

        {error && (
            <div className="mt-6 p-4 rounded-md bg-yellow-50 border border-yellow-200 flex items-start">
                <AlertTriangleIcon className="h-6 w-6 text-yellow-500 flex-shrink-0"/>
                <div className="ml-3"><h3 className="text-sm font-medium text-yellow-800">Forecast Failed</h3><p className="mt-1 text-sm text-yellow-700">{error}</p></div>
            </div>
        )}

        {forecast && (
            <div className="mt-6 p-6 rounded-lg bg-green-50 border border-green-200">
                <h3 className="text-xl font-bold text-green-800 flex items-center">
                    <SparklesIcon className="h-6 w-6 mr-2" />
                    Price Forecast for {selectedCrop}
                </h3>
                <div className="mt-4 text-gray-700 whitespace-pre-wrap font-sans">
                    {forecast}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default MarketAccess;