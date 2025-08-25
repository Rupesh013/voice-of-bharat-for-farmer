
import React from 'react';
import { Feature } from '../types';
import { LeafIcon, MarketIcon, SunIcon, DollarIcon, ScaleIcon, TestTubeIcon, FileTextIcon, MessageSquareIcon, BrainCircuitIcon } from './common/Icons';

interface SidebarProps {
  activeFeature: Feature;
  setActiveFeature: (feature: Feature) => void;
}

const featureList = [
  { id: Feature.CropDoctor, name: 'Crop Doctor AI', icon: <LeafIcon className="h-5 w-5" /> },
  { id: Feature.MarketAccess, name: 'Market Access', icon: <MarketIcon className="h-5 w-5" /> },
  { id: Feature.FertilizerOptimizer, name: 'Fertilizer Optimizer', icon: <TestTubeIcon className="h-5 w-5" /> },
  { id: Feature.CropRecommendation, name: 'Crop Recommendation', icon: <BrainCircuitIcon className="h-5 w-5" /> },
  { id: Feature.ContractFarming, name: 'Contract Farming', icon: <FileTextIcon className="h-5 w-5" /> },
  { id: Feature.FinancialNeeds, name: 'Financial Needs', icon: <DollarIcon className="h-5 w-5" /> },
  { id: Feature.GovtSchemes, name: 'Government Schemes', icon: <ScaleIcon className="h-5 w-5" /> },
  { id: Feature.WeatherAlerts, name: 'Weather Alerts', icon: <SunIcon className="h-5 w-5" /> },
  { id: Feature.ExpertGuidance, name: 'Expert Guidance', icon: <MessageSquareIcon className="h-5 w-5" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeFeature, setActiveFeature }) => {
  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0 hidden md:block">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-green-700">Farm Connect</h1>
        <p className="text-sm text-gray-500">AI Empowerment Platform</p>
      </div>
      <nav className="mt-4">
        <ul>
          {featureList.map((feature) => {
            const isEnabled = feature.id !== Feature.ContractFarming;
            return (
              <li key={feature.id} className="px-4 py-1">
                <button
                  onClick={() => setActiveFeature(feature.id)}
                  className={`w-full flex items-center p-2 rounded-lg transition-colors duration-200 ${
                    activeFeature === feature.id
                      ? 'bg-green-100 text-green-800 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  } ${!isEnabled ? 'cursor-not-allowed opacity-60' : ''}`}
                  disabled={!isEnabled}
                >
                  {feature.icon}
                  <span className="ml-3">{feature.name}</span>
                  {!isEnabled && <span className="ml-auto text-xs text-gray-400">(Soon)</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
