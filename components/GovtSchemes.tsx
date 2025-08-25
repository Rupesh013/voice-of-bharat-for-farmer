import React, { useState, useMemo } from 'react';
import { ExternalLinkIcon, SearchIcon, BotIcon } from './common/Icons';
import SchemeAIChat from './SchemeAIChat';

interface Scheme {
  name: string;
  benefit: string;
  eligibility: string;
  applyProcess: string[];
  link?: {
    url: string;
    text: string;
  };
}

const centralSchemes: Scheme[] = [
  {
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    benefit: '₹6,000 per year in 3 installments.',
    eligibility: 'Land-owning farmers (excluding income tax payers).',
    applyProcess: [
      'Go to the official PM-KISAN website.',
      'Click on "New Farmer Registration".',
      'Enter Aadhaar, mobile, and bank details.',
      'Submit land record documents (Patta/Khata).',
    ],
    link: { url: 'https://pmkisan.gov.in', text: 'Check PM-Kisan Status' },
  },
  {
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    benefit: 'Crop insurance at a low premium of 1.5–5%.',
    eligibility: 'All farmers with insurable crops. Mandatory if a crop loan is taken.',
    applyProcess: [
      'Visit the PMFBY portal.',
      'Click on "Farmer Corner" → "Apply for Crop Insurance".',
      'Select state, season, crop, and fill in Aadhaar and land details.',
    ],
    link: { url: 'https://pmfby.gov.in', text: 'Track Application Status' },
  },
  {
    name: 'Kisan Credit Card (KCC)',
    benefit: 'Crop loans up to ₹3 lakh at a subsidized 4% interest rate.',
    eligibility: 'Cultivating farmers, tenant farmers, or those in allied sectors.',
    applyProcess: [
      'Download the KCC Form from the PM-KISAN website or a bank branch.',
      'Fill and submit it to your nearest bank with Aadhaar and land documents.',
      'Alternatively, apply via a Common Service Centre (CSC).',
    ],
    link: { url: 'https://pmkisan.gov.in/KCC.aspx', text: 'Download KCC Form' },
  },
  {
    name: 'PM-KUSUM (Solar Pump Subsidy Scheme)',
    benefit: '30–60% subsidy on solar pump installation for irrigation.',
    eligibility: 'Farmers with grid access or land for off-grid pumps.',
    applyProcess: [
      'Visit your state-specific KUSUM portal or the central MNRE site.',
      'Register using Aadhaar and land documents.',
      'Choose pump capacity and a registered vendor.',
    ],
    link: { url: 'https://mnre.gov.in/solar/schemes', text: 'Visit MNRE Site' },
  },
  {
    name: 'eNAM (National Agriculture Market)',
    benefit: 'Sell crops directly in over 1000 APMCs (mandis) digitally.',
    eligibility: 'Farmers registered with an APMC and with valid KYC.',
    applyProcess: [
      'Visit the eNAM website to begin registration.',
      'Click on "Farmer Registration".',
      'Upload KYC, bank, and land details.',
      'Receive a unique ID to trade crops online or via the mobile app.',
    ],
    link: { url: 'https://enam.gov.in', text: 'Register on eNAM' },
  },
    {
    name: 'Soil Health Card Scheme',
    benefit: 'Free soil testing and customized fertilizer recommendations every 2 years.',
    eligibility: 'All farmers are eligible to get a soil health card.',
    applyProcess: [
        'Contact your local agriculture office or Village Level Worker/Krishi Sahayak.',
        'They will collect a soil sample from your farm.',
        'The sample is sent to a lab for testing, and the card is delivered to you.',
    ],
    link: { url: 'https://soilhealth.dac.gov.in', text: 'Find Your Soil Health Card' },
  },
  {
    name: 'NABARD Subsidy Schemes',
    benefit: '25–50% capital subsidy for agri-infrastructure like cold storage, drip irrigation, dairy, etc.',
    eligibility: 'Varies by scheme; includes individual farmers, FPOs, and agri-entrepreneurs.',
    applyProcess: [
        'Visit the official NABARD website to see available schemes.',
        'Prepare a detailed project report (DPR) for your venture.',
        'Apply for a bank loan; the bank will then process the subsidy claim from NABARD.',
    ],
    link: { url: 'https://www.nabard.org', text: 'Explore NABARD Schemes' },
  },
  {
    name: 'PM Krishi Sinchai Yojana (PMKSY)',
    benefit: 'Subsidies for micro-irrigation and water conservation systems such as drip/sprinkler irrigation.',
    eligibility: 'All farmers and farmer groups.',
    applyProcess: [
      'Visit the official PMKSY website.',
      'Contact local agriculture/horticulture department for application procedures in your area.',
    ],
    link: { url: 'https://pmksy.gov.in', text: 'Visit PMKSY Portal' },
  },
  {
    name: 'Rashtriya Krishi Vikas Yojana (RKVY)',
    benefit: 'Funding and grants for agricultural development, infrastructure, technology adoption, and agri-entrepreneurship.',
    eligibility: 'Eligible agricultural stakeholders and farmer groups under state-specific criteria.',
    applyProcess: [
      'Contact your respective state agriculture department for details on ongoing projects and application processes.',
    ],
    link: { url: 'https://rkvy.nic.in', text: 'Learn More on RKVY' },
  },
  {
    name: 'National Bamboo Mission',
    benefit: 'Support for bamboo cultivation, product development, and market linkages.',
    eligibility: 'Farmers, growers, and entrepreneurs interested in the bamboo sector.',
    applyProcess: [
      'Contact your state forestry or bamboo mission offices for guidance on nurseries and subsidies.',
    ],
    link: { url: 'https://nbm.nic.in', text: 'Visit Bamboo Mission Site' },
  },
  {
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    benefit: 'Support for organic farming clusters, certification, and market access.',
    eligibility: 'Farmer groups and cooperatives adopting organic farming practices.',
    applyProcess: [
      'Register with your state agriculture or organic certification agencies.',
    ],
    link: { url: 'https://pgsindia-ncof.gov.in', text: 'Organic Farming Portal' },
  },
  {
    name: 'Agriculture Infrastructure Fund (AIF)',
    benefit: 'Loans with interest subvention for building warehouses, cold storage, processing units, and supply chain infrastructure.',
    eligibility: 'Farmer Producer Organizations (FPOs), cooperatives, startups, and agri-entrepreneurs.',
    applyProcess: [
      'Apply for loans through designated banks and financial institutions, which will process the subvention.',
    ],
    link: { url: 'https://agriinfra.dac.gov.in', text: 'Explore AIF' },
  },
  {
    name: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)',
    benefit: 'Support for fisheries and aquaculture sector including infrastructure, equipment subsidy, and marketing.',
    eligibility: 'Fisherfolk, fish farmers, and entrepreneurs in the fisheries domain.',
    applyProcess: [
      'Visit the official PMMSY website.',
      'Applications are typically processed through state fisheries departments.',
    ],
    link: { url: 'https://pmmsy.dof.gov.in', text: 'Visit Fisheries Portal' },
  },
];

const stateSchemes: Scheme[] = [
  {
    name: 'Annadata Sukhibhava Scheme (AP)',
    benefit: '₹20,000 per year financial aid to farmers to support agricultural needs (e.g., inputs like seeds, fertilizers).',
    eligibility: 'Permanent residents of Andhra Pradesh who are farmers; income taxpayers, government employees, and pensioners above ₹10,000 excluded.',
    applyProcess: [
      'Visit the official scheme website to register and check beneficiary status.',
      'Submit Aadhaar, land documents, and other required proofs.',
      'Contact nearest Rythu Sewa Kendra for assistance and grievance redressal.',
    ],
    link: { url: 'https://annadathasukhibhava.ap.gov.in', text: 'Visit Scheme Portal' },
  },
  {
    name: 'YSR Rythu Bharosa (AP)',
    benefit: '₹13,500 per year per farmer family (₹7,500 state contribution + ₹6,000 central PM-KISAN).',
    eligibility: 'Land-owning farmers and tenant farmers with minimum leased land; disqualifications for government employees, income taxpayers.',
    applyProcess: [
      "Beneficiaries are identified via the government's land records database.",
      'Check status or file a grievance at official state portals or nearest agricultural offices.',
    ],
    link: { url: 'https://apagrisnet.gov.in', text: 'Visit AP Agriculture Portal' },
  },
  {
    name: 'YSR Jala Kala Scheme (AP)',
    benefit: 'Free borewell drilling to eligible farmers lacking irrigation facilities for water security.',
    eligibility: 'Farmers without borewells having at least 2.5 acres of continuous land.',
    applyProcess: [
      'Apply at designated government offices or through the online portal.',
      'Required documents include land records, Aadhaar, and identity proofs.',
    ],
    link: { url: 'https://ysrjalakala.ap.gov.in', text: 'Apply for YSR Jala Kala' },
  },
  {
    name: 'State Crop Insurance Scheme (AP)',
    benefit: 'Free or subsidized crop insurance for natural calamities, covering losses to farmers on specified crops.',
    eligibility: 'All farmers in Andhra Pradesh growing insurable crops.',
    applyProcess: [
      'Registration is typically facilitated at village or Mandal agriculture offices before the sowing season.',
    ],
    link: { url: 'https://apagrisnet.gov.in', text: 'Check with Local Agri Dept' },
  },
  {
    name: 'National Food Security Mission (NFSM - AP)',
    benefit: 'Financial support and subsidies for increasing foodgrain production and productivity through improved seeds, training, and infrastructure.',
    eligibility: 'Farmer groups and individuals growing specified food grains.',
    applyProcess: [
      'Contact your district agriculture office for details on active components.',
      'Visit the AP Seeds portal for updates on seed subsidies and applications.',
    ],
    link: { url: 'https://apseeds.ap.gov.in', text: 'Visit AP Seeds Portal' },
  },
  {
    name: 'MIDH - Horticulture Mission (AP)',
    benefit: 'Financial assistance for horticulture crop cultivation, post-harvest management, and marketing infrastructure.',
    eligibility: 'Eligible horticulture growers and farmer groups.',
    applyProcess: [
      'Contact the Andhra Pradesh Horticulture Department for scheme guidelines.',
      'Check the official horticulture portal for application forms and notifications.',
    ],
    link: { url: 'http://horticulture.ap.nic.in', text: 'Visit AP Horticulture Dept' },
  },
    {
    name: 'Dairy Development Schemes (AP)',
    benefit: 'Subsidies for purchase of milch animals, improved feed, veterinary services, and infrastructure (milk chilling units, diary plants).',
    eligibility: 'Small, marginal farmers and dairy entrepreneurs in AP.',
    applyProcess: [
      'Contact the Andhra Pradesh Dairy Development Department or local veterinary offices.',
      'Applications typically open periodically with scheme announcements.',
    ],
    link: { url: 'http://apdairy.gov.in', text: 'Visit AP Dairy Dept' },
  },
  {
    name: 'Fisheries & Aquaculture Schemes (PMMSY - AP)',
    benefit: 'Infrastructure and technology support, financial assistance for fish farmers and fishermen (cold storage, hatcheries, mechanized boats).',
    eligibility: 'Registered fishermen, fish farmers, and related entrepreneurs.',
    applyProcess: [
      'Visit the central PMMSY website for guidelines.',
      'Apply via the state fisheries department or local aquaculture offices.',
    ],
    link: { url: 'https://pmmsy.dof.gov.in', text: 'Visit Fisheries Portal' },
  },
  {
    name: 'Sericulture Development Schemes (AP)',
    benefit: 'Subsidies and training for mulberry cultivation, silkworm rearing, silk production infrastructure, and market access.',
    eligibility: 'Farmers engaged or interested in sericulture in AP.',
    applyProcess: [
      'Approach the Sericulture Department of Andhra Pradesh for details.',
      'Submit applications with land and ID proofs when schemes are announced.',
    ],
    link: { url: 'https://apsericulture.ap.gov.in', text: 'Visit AP Sericulture Dept' },
  },
];


const SchemeCard: React.FC<{ scheme: Scheme }> = ({ scheme }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
    <h3 className="text-xl font-bold text-green-800">{scheme.name}</h3>
    <div className="mt-4 space-y-4">
      <div>
        <h4 className="font-semibold text-gray-700">Benefit</h4>
        <p className="text-gray-600">{scheme.benefit}</p>
      </div>
      <div>
        <h4 className="font-semibold text-gray-700">Eligibility</h4>
        <p className="text-gray-600">{scheme.eligibility}</p>
      </div>
      <div>
        <h4 className="font-semibold text-gray-700">How to Apply</h4>
        <ol className="list-decimal list-inside space-y-1 text-gray-600 mt-1">
          {scheme.applyProcess.map((step, index) => <li key={index}>{step}</li>)}
        </ol>
      </div>
    </div>
    {scheme.link && (
      <div className="mt-5">
        <a
          href={scheme.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {scheme.link.text}
          <ExternalLinkIcon className="ml-2 h-4 w-4" />
        </a>
      </div>
    )}
  </div>
);

const GovtSchemes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const allSchemes = useMemo(() => [...centralSchemes, ...stateSchemes], []);

  const filterSchemes = (schemes: Scheme[], query: string) => {
    if (!query) {
      return schemes;
    }
    const lowerCaseQuery = query.toLowerCase();
    return schemes.filter(scheme =>
      scheme.name.toLowerCase().includes(lowerCaseQuery) ||
      scheme.benefit.toLowerCase().includes(lowerCaseQuery) ||
      scheme.eligibility.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const filteredCentralSchemes = useMemo(() => filterSchemes(centralSchemes, searchQuery), [searchQuery]);
  const filteredStateSchemes = useMemo(() => filterSchemes(stateSchemes, searchQuery), [searchQuery]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Government Schemes</h1>
      <p className="mt-2 text-gray-600">Explore central and state-level schemes to support your farming activities.</p>

      <div className="mt-8 mb-6 relative">
        <input
          type="text"
          placeholder="Search for schemes by name, benefit, or eligibility..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-10">
        {filteredCentralSchemes.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">🇮🇳 Central Government Schemes</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCentralSchemes.map(scheme => <SchemeCard key={scheme.name} scheme={scheme} />)}
            </div>
          </div>
        )}

        {filteredStateSchemes.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">🌾 State-Level Schemes (Andhra Pradesh)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredStateSchemes.map(scheme => <SchemeCard key={scheme.name} scheme={scheme} />)}
            </div>
          </div>
        )}

        {filteredCentralSchemes.length === 0 && filteredStateSchemes.length === 0 && (
          <div className="text-center py-10 px-4">
            <h3 className="text-lg font-medium text-gray-800">No Schemes Found</h3>
            <p className="mt-1 text-gray-500">Your search for "{searchQuery}" did not match any schemes.</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          aria-label="Open Scheme AI Assistant"
        >
          <BotIcon className="h-8 w-8" />
        </button>
      </div>

      {isChatOpen && (
        <SchemeAIChat
          schemes={allSchemes}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default GovtSchemes;
