
import React, { useState } from 'react';
import { Feature } from './types';
import Sidebar from './components/Sidebar';
import CropDoctor from './components/CropDoctor';
import GovtSchemes from './components/GovtSchemes';
import ExpertGuidance from './components/ExpertGuidance';
import WeatherAlerts from './components/WeatherAlerts';
import FinancialNeeds from './components/FinancialNeeds';
import FertilizerOptimizer from './components/FertilizerOptimizer';
import MarketAccess from './components/MarketAccess';
import CropRecommendation from './components/CropRecommendation';

const featureComponentMap: Partial<Record<Feature, JSX.Element>> = {
  [Feature.CropDoctor]: <CropDoctor />,
  [Feature.GovtSchemes]: <GovtSchemes />,
  [Feature.ExpertGuidance]: <ExpertGuidance />,
  [Feature.WeatherAlerts]: <WeatherAlerts />,
  [Feature.FinancialNeeds]: <FinancialNeeds />,
  [Feature.FertilizerOptimizer]: <FertilizerOptimizer />,
  [Feature.MarketAccess]: <MarketAccess />,
  [Feature.CropRecommendation]: <CropRecommendation />,
};


const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.CropDoctor);

  const renderActiveFeature = () => {
    const Component = featureComponentMap[activeFeature];
    return Component || <div className="p-8 text-center text-gray-500">Select a feature from the menu.</div>;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {renderActiveFeature()}
        </div>
      </main>
    </div>
  );
};

export default App;
