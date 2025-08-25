import React, { useState, useCallback } from 'react';
import { getWeatherAdvisory } from '../services/geminiService';
import type { WeatherData } from '../types';
import { SearchIcon, SparklesIcon, AlertTriangleIcon, ThermometerIcon, WindIcon, CloudRainIcon, CloudIcon, SunIcon } from './common/Icons';

// Mock weather data since we don't have a live API key
const getMockWeatherData = (location: string): WeatherData => ({
  location: location,
  current: {
    temp: 28,
    condition: 'Partly Cloudy',
    wind_speed: 15,
    humidity: 75,
  },
  forecast: [
    { day: 'Mon', temp_max: 30, temp_min: 22, condition: 'Sunny' },
    { day: 'Tue', temp_max: 32, temp_min: 23, condition: 'Partly Cloudy' },
    { day: 'Wed', temp_max: 29, temp_min: 21, condition: 'Light Rain' },
    { day: 'Thu', temp_max: 31, temp_min: 22, condition: 'Sunny' },
    { day: 'Fri', temp_max: 28, temp_min: 20, condition: 'Thunderstorm' },
  ],
});

const WeatherIcon: React.FC<{ condition: string; className?: string }> = ({ condition, className }) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('rain') || lowerCondition.includes('thunderstorm')) return <CloudRainIcon className={className} />;
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return <SunIcon className={className} />;
  if (lowerCondition.includes('cloud')) return <CloudIcon className={className} />;
  return <SunIcon className={className} />;
};

const WeatherAlerts: React.FC = () => {
  const [location, setLocation] = useState('');
  const [crop, setCrop] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [advisory, setAdvisory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    setWeatherData(getMockWeatherData(location));
    setAdvisory(null); // Clear previous advisory on new search
    setCrop(''); // Clear crop on new search
    setError(null);
  };
  
  const handleGetAdvisory = useCallback(async () => {
    if (!weatherData || !crop.trim()) return;
    
    setLoading(true);
    setAdvisory(null);
    setError(null);

    try {
      const result = await getWeatherAdvisory(weatherData, crop);
      setAdvisory(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, [weatherData, crop]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Weather Alerts & AI Advisory</h1>
      <p className="mt-2 text-gray-600">Get weather forecasts and AI-powered farming advice for your location.</p>

      <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto">
        <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your city or area (e.g., Hyderabad)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
        </div>
        <button type="submit" className="mt-3 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Search Weather
        </button>
      </form>

      {weatherData && (
        <div className="mt-8 max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{weatherData.location} Weather</h2>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-bold text-lg text-blue-800">Current Conditions</h3>
                    <div className="flex items-center justify-between mt-2">
                        <div>
                            <p className="text-4xl font-bold text-gray-800">{weatherData.current.temp}°C</p>
                            <p className="text-gray-600">{weatherData.current.condition}</p>
                        </div>
                        <WeatherIcon condition={weatherData.current.condition} className="h-16 w-16 text-yellow-500" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                            <ThermometerIcon className="h-5 w-5 text-gray-500" />
                            <span>Humidity: {weatherData.current.humidity}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <WindIcon className="h-5 w-5 text-gray-500" />
                            <span>Wind: {weatherData.current.wind_speed} km/h</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-bold text-lg text-green-800">5-Day Forecast</h3>
                    <div className="mt-2 space-y-2">
                        {weatherData.forecast.map(day => (
                            <div key={day.day} className="flex items-center justify-between text-sm">
                                <span className="font-semibold w-10">{day.day}</span>
                                <WeatherIcon condition={day.condition} className="h-6 w-6 text-gray-600" />
                                <span className="text-gray-600 flex-1 text-center">{day.condition}</span>
                                <span className="font-semibold text-gray-800">{day.temp_max}° / {day.temp_min}°</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 border-t pt-6">
                <h3 className="text-xl font-bold text-gray-800">Get AI Farming Advisory</h3>
                <p className="mt-1 text-sm text-gray-600">Enter your crop name to receive tailored advice based on the weather forecast.</p>
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                    <input
                        type="text"
                        value={crop}
                        onChange={(e) => setCrop(e.target.value)}
                        placeholder="e.g., Rice, Wheat, Tomato"
                        className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        onClick={handleGetAdvisory}
                        disabled={!crop.trim() || loading}
                        className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
                                Get AI Advisory
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
      )}

      {error && (
        <div className="mt-6 max-w-4xl mx-auto p-4 rounded-md bg-yellow-50 border border-yellow-200 flex items-start">
            <AlertTriangleIcon className="h-6 w-6 text-yellow-500 flex-shrink-0"/>
            <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Advisory Failed</h3>
                <p className="mt-1 text-sm text-yellow-700">{error}</p>
            </div>
        </div>
      )}

      {advisory && (
        <div className="mt-6 max-w-4xl mx-auto p-6 rounded-lg bg-green-50 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 flex items-center">
                <SparklesIcon className="h-6 w-6 mr-2" />
                AI-Powered Advisory for {crop}
            </h3>
            <div className="mt-4 text-gray-700 whitespace-pre-wrap">
                {advisory}
            </div>
        </div>
      )}
    </div>
  );
};

export default WeatherAlerts;