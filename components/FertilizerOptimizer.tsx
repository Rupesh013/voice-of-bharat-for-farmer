import React, { useState } from 'react';
import { getFertilizerRecommendation } from '../services/geminiService';
import type { FertilizerRecommendation } from '../types';
import { TestTubeIcon, SparklesIcon, AlertTriangleIcon } from './common/Icons';

const aiUses = [
    { title: 'Data Integration and Analysis', description: 'AI models ingest diverse data inputs like soil nutrient levels (NPK values), crop type and growth stage, weather forecasts, and historical yield data to understand complex interactions.' },
    { title: 'Predictive Modeling', description: 'Machine learning models predict the optimal fertilizer type and amount needed to maximize yield and soil health, learning from past outcomes.' },
    { title: 'Dynamic Weather-Based Recommendations', description: 'AI integrates live weather data to adjust fertilizer recommendations, for example, suggesting less fertilizer before heavy rain to reduce runoff.' },
    { title: 'Optimization Algorithms', description: 'AI uses optimization techniques to balance multiple goals: maximizing crop yield, minimizing cost, and preserving long-term soil fertility.' },
    { title: 'Natural Language Processing (NLP)', description: 'AI interfaces like chatbots can help farmers input data and understand guidelines in local languages, making technology more accessible.' },
    { title: 'Continuous Learning', description: 'With feedback loops, the AI system learns from farmer inputs and crop outputs, refining future recommendations and adapting to changing climates.' },
];

const aiTechniques = [
    { technique: 'Supervised Learning', role: 'Predict fertilizer quantity from labeled crop/soil data.' },
    { technique: 'Neural Networks (CNNs, RNNs)', role: 'Model nonlinear relationships between nutrients, crop growth, and weather.' },
    { technique: 'Reinforcement Learning', role: 'Optimize timing and type of fertilizer application dynamically.' },
    { technique: 'Time Series Forecasting', role: 'Integrate weather forecast data into fertilizer schedules.' },
    { technique: 'NLP & Voice Recognition', role: 'Facilitate farmer interaction with recommendations.' },
];

const FertilizerOptimizer: React.FC = () => {
    const [crop, setCrop] = useState('');
    const [nitrogen, setNitrogen] = useState('');
    const [phosphorus, setPhosphorus] = useState('');
    const [potassium, setPotassium] = useState('');
    const [recommendation, setRecommendation] = useState<FertilizerRecommendation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetRecommendation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!crop || !nitrogen || !phosphorus || !potassium) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        setRecommendation(null);
        setError(null);

        try {
            const result = await getFertilizerRecommendation(crop, parseFloat(nitrogen), parseFloat(phosphorus), parseFloat(potassium));
            setRecommendation(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Fertilizer Optimizer AI</h1>
            <p className="mt-2 text-gray-600">
                Leverage AI to get precise fertilizer recommendations, maximizing yield while minimizing waste and environmental impact.
            </p>

            <div className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
                    <SparklesIcon className="h-7 w-7 text-green-600 mr-3" />
                    Get Your Personalized Fertilizer Plan
                </h2>
                <p className="mt-2 text-gray-600">
                    Enter your crop and soil test results to receive a tailored fertilizer plan from our AI agronomist.
                </p>

                <form onSubmit={handleGetRecommendation} className="mt-6 p-6 bg-white rounded-xl shadow-md border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label htmlFor="crop" className="block text-sm font-medium text-gray-700">Crop Name <span className="text-red-500">*</span></label>
                            <input type="text" id="crop" value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="e.g., Wheat" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="nitrogen" className="block text-sm font-medium text-gray-700">Nitrogen (N) kg/ha <span className="text-red-500">*</span></label>
                            <input type="number" id="nitrogen" value={nitrogen} onChange={(e) => setNitrogen(e.target.value)} placeholder="e.g., 120" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="phosphorus" className="block text-sm font-medium text-gray-700">Phosphorus (P) kg/ha <span className="text-red-500">*</span></label>
                            <input type="number" id="phosphorus" value={phosphorus} onChange={(e) => setPhosphorus(e.target.value)} placeholder="e.g., 60" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="potassium" className="block text-sm font-medium text-gray-700">Potassium (K) kg/ha <span className="text-red-500">*</span></label>
                            <input type="number" id="potassium" value={potassium} onChange={(e) => setPotassium(e.target.value)} placeholder="e.g., 40" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button type="submit" disabled={loading} className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {loading ? (
                                <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating Plan...</>
                            ) : (
                                <><SparklesIcon className="-ml-1 mr-2 h-5 w-5" />Generate Recommendation</>
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

                {recommendation && (
                    <div className="mt-6 p-6 rounded-lg bg-green-50 border border-green-200">
                        <h3 className="text-xl font-bold text-green-800 flex items-center"><SparklesIcon className="h-6 w-6 mr-2" />AI-Powered Fertilizer Plan for {crop}</h3>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-800">Recommended N:P:K Ratio</h4>
                                <p className="text-lg font-bold text-green-700">{recommendation.npkRatio}</p>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="font-semibold text-gray-800 mb-2">Application Schedule</h4>
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100"><tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Stage</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Fertilizer</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Amount</th>
                                        </tr></thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {recommendation.recommendations.map((rec, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-2 text-sm font-medium text-gray-800">{rec.stage}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-600">{rec.fertilizer}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-600">{rec.amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Organic Alternatives</h4>
                                <ul className="list-disc list-inside mt-1 text-gray-600 text-sm">
                                    {recommendation.organicAlternatives.map((note, i) => <li key={i}>{note}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Important Notes</h4>
                                <ul className="list-disc list-inside mt-1 text-gray-600 text-sm">
                                    {recommendation.notes.map((note, i) => <li key={i}>{note}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">How AI is Used in Fertilizer Optimization</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aiUses.map((use) => (
                        <div key={use.title} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">{use.title}</h3>
                            <p className="mt-3 text-gray-600">{use.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">Example AI Techniques</h2>
                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Technique</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role in Fertilizer Optimizer</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {aiTechniques.map((tech) => (
                                <tr key={tech.technique}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tech.technique}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{tech.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default FertilizerOptimizer;
