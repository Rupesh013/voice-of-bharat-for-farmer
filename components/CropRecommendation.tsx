
import React, { useState } from 'react';
import { getCropRecommendation } from '../services/geminiService';
import type { CropRecommendationResult } from '../types';
import { BrainCircuitIcon, SparklesIcon, AlertTriangleIcon, TestTubeIcon, SunIcon, MarketIcon, MessageSquareIcon, SproutIcon, MapPinIcon, DropletIcon } from './common/Icons';

const soilTypes = ["Alluvial", "Black (Regur)", "Red and Yellow", "Laterite", "Arid", "Saline", "Peaty (Kari)", "Forest"];

const recommendationSteps = [
    {
        title: "Identify Soil Type",
        description: "AI uses soil testing data, local databases, and even satellite imagery to accurately classify soil properties like pH, organic matter, and water retention.",
        icon: <TestTubeIcon className="h-8 w-8 text-green-500" />
    },
    {
        title: "Analyze Climate Data",
        description: "Machine learning models analyze historical and real-time weather data from sources like IMD to predict rainfall patterns and temperature suitability for various crops.",
        icon: <SunIcon className="h-8 w-8 text-yellow-500" />
    },
    {
        title: "Consult Digital Platforms",
        description: "AI-driven platforms like this one process your inputs to provide tailored crop suggestions based on a massive dataset of agricultural knowledge.",
        icon: <BrainCircuitIcon className="h-8 w-8 text-blue-500" />
    },
    {
        title: "Market Linkages",
        description: "AI forecasts market demand and price trends by analyzing data from platforms like eNAM, helping you choose crops with the highest profitability.",
        icon: <MarketIcon className="h-8 w-8 text-orange-500" />
    },
    {
        title: "Agronomic Advice",
        description: "The AI cross-references its findings with local agricultural knowledge from extension officers and KVKs to provide a final, validated recommendation.",
        icon: <MessageSquareIcon className="h-8 w-8 text-purple-500" />
    },
];


const CropRecommendation: React.FC = () => {
    const [location, setLocation] = useState('');
    const [soilType, setSoilType] = useState(soilTypes[0]);
    const [rainfall, setRainfall] = useState('');
    const [recommendations, setRecommendations] = useState<CropRecommendationResult[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetRecommendation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location || !soilType || !rainfall) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        setRecommendations(null);
        setError(null);

        try {
            const result = await getCropRecommendation(location, soilType, parseFloat(rainfall));
            setRecommendations(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Modern Crop Recommendation Systems</h1>
            <p className="mt-2 text-gray-600">
                Leveraging AI to get personalized crop recommendations based on your local conditions.
            </p>

            <div className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
                    <SparklesIcon className="h-7 w-7 text-green-600 mr-3" />
                    AI-Powered Crop Recommender
                </h2>
                <p className="mt-2 text-gray-600">
                    Enter your farm's details to receive tailored crop suggestions from our AI.
                </p>

                <form onSubmit={handleGetRecommendation} className="mt-6 p-6 bg-white rounded-xl shadow-md border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (State/District) <span className="text-red-500">*</span></label>
                            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Anantapur, Andhra Pradesh" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="soilType" className="block text-sm font-medium text-gray-700">Soil Type <span className="text-red-500">*</span></label>
                            <select id="soilType" value={soilType} onChange={(e) => setSoilType(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md" required>
                                {soilTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rainfall" className="block text-sm font-medium text-gray-700">Avg. Annual Rainfall (mm) <span className="text-red-500">*</span></label>
                            <input type="number" id="rainfall" value={rainfall} onChange={(e) => setRainfall(e.target.value)} placeholder="e.g., 600" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button type="submit" disabled={loading} className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {loading ? (
                                <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating Recommendations...</>
                            ) : (
                                <><SparklesIcon className="-ml-1 mr-2 h-5 w-5" />Get AI Recommendation</>
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="mt-6 p-4 rounded-md bg-yellow-50 border border-yellow-200 flex items-start">
                        <AlertTriangleIcon className="h-6 w-6 text-yellow-500 flex-shrink-0"/>
                        <div className="ml-3"><h3 className="text-sm font-medium text-yellow-800">Recommendation Failed</h3><p className="mt-1 text-sm text-yellow-700">{error}</p></div>
                    </div>
                )}

                {recommendations && (
                    <div className="mt-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4"><SparklesIcon className="h-6 w-6 mr-2 text-green-600" />AI Recommendations for {location}</h3>
                        <div className="space-y-4">
                            {recommendations.map((rec, i) => (
                                <div key={i} className="p-5 rounded-lg bg-green-50 border border-green-200">
                                    <div className="flex items-center">
                                        <SproutIcon className="h-7 w-7 text-green-600"/>
                                        <h4 className="ml-3 text-lg font-bold text-green-800">{rec.cropName}</h4>
                                        <span className={`ml-auto px-3 py-1 text-xs font-semibold rounded-full ${rec.estimatedProfitability === 'High' ? 'bg-green-200 text-green-800' : rec.estimatedProfitability === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                                            {rec.estimatedProfitability} Profitability
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">{rec.reasoning}</p>
                                    <div className="mt-3">
                                        <h5 className="text-sm font-semibold text-gray-700">Suitable Regions:</h5>
                                        <p className="text-sm text-gray-600">{rec.suitableRegions.join(', ')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">How It Works: AI-Powered Recommendation Steps</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendationSteps.map((step) => (
                        <div key={step.title} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <div className="flex items-start">
                                {step.icon}
                                <h3 className="ml-4 text-lg font-bold text-gray-800">{step.title}</h3>
                            </div>
                            <p className="mt-3 text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 p-5 rounded-lg bg-blue-50 border border-blue-200 text-center">
                <p className="text-blue-800 font-semibold">For the most accurate recommendation, combine location, soil testing, and digital tools tailored to local Indian conditions.</p>
            </div>

        </div>
    );
};

export default CropRecommendation;
