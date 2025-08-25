import React, { useState } from 'react';
import { DollarIcon, LeafIcon, CloudRainIcon, AlertTriangleIcon, MarketIcon, SparklesIcon, CheckCircleIcon, ScaleIcon } from './common/Icons';
import { getFinancialAdvice } from '../services/geminiService';

interface KeyNeed {
  title: string;
  description: string;
  icon: JSX.Element;
}

const keyNeeds: KeyNeed[] = [
  {
    title: 'Crop Production Finance',
    description: 'Loans for seeds, fertilizers, pesticides, labor, and machinery. Includes working capital loans timed with sowing and harvesting cycles.',
    icon: <LeafIcon className="h-8 w-8 text-green-500" />,
  },
  {
    title: 'Irrigation & Infrastructure',
    description: 'Funds for drip/sprinkler systems, borewells, pumps, and infrastructure for storage (warehouses, silos) and post-harvest processing.',
    icon: <CloudRainIcon className="h-8 w-8 text-blue-500" />,
  },
  {
    title: 'Equipment & Mechanization',
    description: 'Loans or subsidies to buy tractors, harvesters, threshers, and drones to reduce labor dependency and increase efficiency.',
    icon: <ScaleIcon className="h-8 w-8 text-gray-500" />,
  },
  {
    title: 'Crop Insurance & Risk Mitigation',
    description: 'Insurance premiums to protect against crop failure from weather, pests, or diseases, securing income stability.',
    icon: <AlertTriangleIcon className="h-8 w-8 text-yellow-500" />,
  },
  {
    title: 'Livestock & Allied Activities',
    description: 'Finance to invest in dairy cattle, poultry, fisheries, sericulture, and related businesses for income diversification.',
    icon: <SparklesIcon className="h-8 w-8 text-purple-500" />,
  },
  {
    title: 'Market Access & Working Capital',
    description: 'Credit to manage supply chain activities like storage, transportation, and marketing to hold produce for better prices.',
    icon: <MarketIcon className="h-8 w-8 text-orange-500" />,
  },
];

const assessmentBenefits = [
  {
    title: 'Tailored Loan Products',
    description: 'Matches farmers with loans suitable for their cropping patterns, land size, and risk profile (e.g., Kisan Credit Card).',
  },
  {
    title: 'Optimized Repayment Cycles',
    description: 'Aligns loan tenure and repayment schedules to crop cycles and income flow.',
  },
  {
    title: 'Access to Subsidies & Schemes',
    description: 'Identifies eligibility for government financial support (PM-KISAN, crop insurance, subsidies).',
  },
  {
    title: 'Financial Literacy',
    description: 'Educates farmers on credit management, digital payments, and insurance benefits.',
  },
];

const financialProducts = [
    { need: 'Crop Production', product: 'Kisan Credit Card (Working Capital Loan)', scheme: 'KCC' },
    { need: 'Irrigation', product: 'Subsidized loans + PMKSY schemes', scheme: 'PMKSY' },
    { need: 'Equipment & Mechanization', product: 'Capital loans & subsidies', scheme: 'RKVY, NABARD-assisted loans' },
    { need: 'Crop Insurance', product: 'Low-cost premium insurance', scheme: 'PMFBY' },
    { need: 'Livestock & Allied', product: 'Loans and subsidies for allied sectors', scheme: 'PMMSY' },
    { need: 'Market Access', product: 'Infrastructure fund loans for storage & marketing', scheme: 'AgriInfra Fund' },
];


const FinancialNeeds: React.FC = () => {
  const [crop, setCrop] = useState('');
  const [landSize, setLandSize] = useState('');
  const [financialNeed, setFinancialNeed] = useState(keyNeeds[0].title);
  const [details, setDetails] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop || !landSize || !financialNeed) {
      setError("Please fill in all required fields: Crop, Land Size, and Financial Need.");
      return;
    }
    
    setLoading(true);
    setAdvice(null);
    setError(null);

    try {
      const result = await getFinancialAdvice(crop, landSize, financialNeed, details);
      setAdvice(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Financial Needs for Farmers</h1>
      <p className="mt-2 text-gray-600">
        Understanding the financial requirements to support agricultural activities, improve productivity, and ensure livelihood security.
      </p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">Key Financial Needs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keyNeeds.map((need) => (
            <div key={need.title} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center">
                {need.icon}
                <h3 className="ml-4 text-lg font-bold text-gray-800">{need.title}</h3>
              </div>
              <p className="mt-3 text-gray-600">{need.description}</p>
            </div>
          ))}
          <div className="bg-green-50 p-6 rounded-xl border border-green-200 md:col-span-2 lg:col-span-1 flex flex-col justify-center">
             <div className="flex items-center">
                <DollarIcon className="h-8 w-8 text-green-600"/>
                <h3 className="ml-4 text-lg font-bold text-green-800">Long-term Investment</h3>
              </div>
              <p className="mt-3 text-green-700">Capital for diversification into horticulture, organic farming, agro-processing, or value addition.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">How Assessment Helps</h2>
           <ul className="space-y-4">
             {assessmentBenefits.map((benefit) => (
                <li key={benefit.title} className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-800">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </li>
             ))}
           </ul>
        </div>
        
        <div>
           <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">Products Linked to Needs</h2>
           <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
             <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial Need</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product/Support</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example Scheme</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financialProducts.map((product) => (
                    <tr key={product.need}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.need}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.scheme}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
          <SparklesIcon className="h-7 w-7 text-green-600 mr-3" />
          AI Financial Advisor
        </h2>
        <p className="mt-2 text-gray-600">
          Get a personalized financial plan by providing a few details about your farm.
        </p>

        <form onSubmit={handleGetAdvice} className="mt-6 p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="crop" className="block text-sm font-medium text-gray-700">
                Primary Crop <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="crop"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g., Rice, Cotton"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="landSize" className="block text-sm font-medium text-gray-700">
                Land Size (in acres) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="landSize"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                placeholder="e.g., 5"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="financialNeed" className="block text-sm font-medium text-gray-700">
                Primary Financial Need <span className="text-red-500">*</span>
              </label>
              <select
                id="financialNeed"
                value={financialNeed}
                onChange={(e) => setFinancialNeed(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                {keyNeeds.map(need => <option key={need.title}>{need.title}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                Additional Details (Optional)
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="e.g., I need a loan for a new tractor and want to set up drip irrigation."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
                  Get AI Financial Plan
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-md bg-yellow-50 border border-yellow-200 flex items-start">
              <AlertTriangleIcon className="h-6 w-6 text-yellow-500 flex-shrink-0"/>
              <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Plan Generation Failed</h3>
                  <p className="mt-1 text-sm text-yellow-700">{error}</p>
              </div>
          </div>
        )}

        {advice && (
          <div className="mt-6 p-6 rounded-lg bg-green-50 border border-green-200">
              <h3 className="text-xl font-bold text-green-800 flex items-center">
                  <SparklesIcon className="h-6 w-6 mr-2" />
                  Your Personalized Financial Plan
              </h3>
              <div className="mt-4 text-gray-700 whitespace-pre-wrap font-sans">
                  {advice}
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialNeeds;