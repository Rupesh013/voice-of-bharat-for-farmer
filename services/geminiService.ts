
import { GoogleGenAI, Type } from "@google/genai";
import type { DiagnosisResult, WeatherData, FertilizerRecommendation, CropRecommendationResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const diagnosisSchema = {
  type: Type.OBJECT,
  properties: {
    isHealthy: {
      type: Type.BOOLEAN,
      description: "Is the plant in the image healthy?"
    },
    diseaseName: {
      type: Type.STRING,
      description: "The common name of the disease. If healthy, this should be 'Healthy'."
    },
    description: {
      type: Type.STRING,
      description: "A detailed description of the disease, its symptoms, and causes."
    },
    treatment: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "A list of actionable treatment steps or recommendations."
    }
  },
  required: ["isHealthy", "diseaseName", "description", "treatment"]
};

export const diagnoseCropDisease = async (base64Image: string): Promise<DiagnosisResult> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };

    const textPart = {
      text: `Analyze this image of a plant leaf.
      1. Identify if the plant is healthy or has a disease.
      2. If diseased, identify the specific disease.
      3. Provide a detailed description of the disease.
      4. Suggest a list of actionable treatment methods.
      5. If the image is not a plant or the quality is too poor, indicate that in the description.
      Return the result in the specified JSON format. For healthy plants, diseaseName should be 'Healthy' and treatment can be an empty array or suggest preventive care.`
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: diagnosisSchema,
        temperature: 0.2,
      }
    });

    const responseText = response.text.trim();
    const result = JSON.parse(responseText) as DiagnosisResult;
    
    return result;
  } catch (error) {
    console.error("Error diagnosing crop disease:", error);
    throw new Error("Failed to get a diagnosis from the AI. The image might be unclear or the content could not be processed.");
  }
};

export const getWeatherAdvisory = async (weatherData: WeatherData, cropName: string): Promise<string> => {
  try {
    const prompt = `You are an expert agricultural advisor. Based on the following weather data for ${weatherData.location}, provide a concise, actionable farming advisory for ${cropName} crops. Focus on irrigation, potential pest/disease risks, and any necessary crop protection measures for the next 5 days.

    Weather Data:
    - Current Temperature: ${weatherData.current.temp}°C
    - Current Condition: ${weatherData.current.condition}
    - 5-Day Forecast:
      - ${weatherData.forecast[0].day}: ${weatherData.forecast[0].temp_min}°C - ${weatherData.forecast[0].temp_max}°C, ${weatherData.forecast[0].condition}
      - ${weatherData.forecast[1].day}: ${weatherData.forecast[1].temp_min}°C - ${weatherData.forecast[1].temp_max}°C, ${weatherData.forecast[1].condition}
      - ${weatherData.forecast[2].day}: ${weatherData.forecast[2].temp_min}°C - ${weatherData.forecast[2].temp_max}°C, ${weatherData.forecast[2].condition}
      - ${weatherData.forecast[3].day}: ${weatherData.forecast[3].temp_min}°C - ${weatherData.forecast[3].temp_max}°C, ${weatherData.forecast[3].condition}
      - ${weatherData.forecast[4].day}: ${weatherData.forecast[4].temp_min}°C - ${weatherData.forecast[4].temp_max}°C, ${weatherData.forecast[4].condition}

    Provide the advisory in a clear, easy-to-read format.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error getting weather advisory:", error);
    throw new Error("Failed to get a weather advisory from the AI.");
  }
};

export const getFinancialAdvice = async (crop: string, landSize: string, financialNeed: string, details: string): Promise<string> => {
  try {
    const prompt = `You are an expert financial advisor for Indian farmers, named "Farm Connect AI Advisor".

A farmer has provided the following details:
- Crop: ${crop}
- Land Size: ${landSize} acres
- Primary Financial Need: ${financialNeed}
- Additional Details: ${details || 'None'}

Based on this information, provide a personalized financial plan. Your plan should include:
1.  **Recommended Government Schemes:** Suggest 2-3 specific central or state-level schemes that are most relevant. For each scheme, briefly explain the benefit and why it fits the farmer's needs. Use schemes like PM-KISAN, PMFBY, KCC, PM-KUSUM, etc.
2.  **Suitable Loan Products:** Recommend the type of loan they should consider (e.g., Kisan Credit Card for working capital, term loan for equipment). Explain why.
3.  **Actionable Steps:** Provide a clear, step-by-step list of what the farmer should do next (e.g., '1. Visit your nearest bank branch...', '2. Prepare documents like Aadhaar and land records...').
4.  **Risk Management Advice:** Briefly mention the importance of crop insurance (like PMFBY) if applicable.

Format your response in clear, simple language that is easy for a farmer to understand. Use headings and bullet points.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.3,
        }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error getting financial advice:", error);
    throw new Error("Failed to get a financial plan from the AI.");
  }
};

const fertilizerSchema = {
  type: Type.OBJECT,
  properties: {
    npkRatio: {
      type: Type.STRING,
      description: "The recommended N:P:K ratio for the crop at its current stage based on soil data."
    },
    recommendations: {
      type: Type.ARRAY,
      description: "A list of fertilizer application recommendations.",
      items: {
        type: Type.OBJECT,
        properties: {
          stage: { type: Type.STRING, description: "The crop growth stage for this application (e.g., Basal Dose, Tillering Stage, Flowering Stage)." },
          fertilizer: { type: Type.STRING, description: "The name of the fertilizer to apply (e.g., Urea, DAP, MOP)." },
          amount: { type: Type.STRING, description: "The recommended amount of fertilizer to apply, including units (e.g., '50 kg/acre')." }
        },
        required: ["stage", "fertilizer", "amount"]
      }
    },
    notes: {
      type: Type.ARRAY,
      description: "Additional important notes or advice, such as application methods or precautions.",
      items: { type: Type.STRING }
    },
    organicAlternatives: {
      type: Type.ARRAY,
      description: "A list of organic alternatives to chemical fertilizers (e.g., 'Compost', 'Vermi-compost', 'Neem Cake').",
      items: { type: Type.STRING }
    }
  },
  required: ["npkRatio", "recommendations", "notes", "organicAlternatives"]
};

export const getFertilizerRecommendation = async (crop: string, nitrogen: number, phosphorus: number, potassium: number): Promise<FertilizerRecommendation> => {
  try {
    const prompt = `You are an expert agronomist AI. A farmer needs a fertilizer recommendation.
    
    Crop: ${crop}
    Soil Test Results:
    - Nitrogen (N): ${nitrogen} kg/ha
    - Phosphorus (P): ${phosphorus} kg/ha
    - Potassium (K): ${potassium} kg/ha

    Provide a detailed fertilizer plan tailored to these conditions. The plan should include:
    1.  A recommended N:P:K ratio.
    2.  Specific fertilizer recommendations (like Urea, DAP, MOP) with amounts per acre.
    3.  Application divided by crop stages (e.g., Basal, Tillering, Flowering).
    4.  Important notes about application techniques.
    5.  Suggestions for organic alternatives.

    Return the result in the specified JSON format.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: fertilizerSchema,
        temperature: 0.2,
      }
    });

    const responseText = response.text.trim();
    const result = JSON.parse(responseText) as FertilizerRecommendation;
    
    return result;
  } catch (error) {
    console.error("Error getting fertilizer recommendation:", error);
    throw new Error("Failed to get a fertilizer recommendation from the AI. Please check the input values.");
  }
};

export const getPriceTrendForecast = async (cropName: string): Promise<string> => {
  try {
    const prompt = `You are an expert agricultural market analyst. Provide a short-term (2-4 weeks) market price trend forecast for ${cropName} in India.

    Your analysis should consider the following factors:
    - Current supply and demand dynamics.
    - Recent weather patterns affecting the crop.
    - Government policies or announcements (e.g., MSP, import/export duties).
    - Festive season demand, if applicable.
    
    Provide a concise summary with a clear trend prediction (e.g., "Prices are expected to rise slightly," "Prices likely to remain stable," "A downward correction is anticipated"). Conclude with one or two key reasons for your forecast.
    
    Format the response in a clear, easy-to-read paragraph.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.4,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error getting price trend forecast:", error);
    throw new Error("Failed to get a price forecast from the AI.");
  }
};

const cropRecommendationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      cropName: { type: Type.STRING, description: "The name of the recommended crop." },
      reasoning: { type: Type.STRING, description: "A detailed explanation of why this crop is suitable, considering soil, climate, and market factors." },
      estimatedProfitability: { type: Type.STRING, description: "An estimation of the crop's market profitability (e.g., 'High', 'Medium', 'Low')." },
      suitableRegions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Specific regions or districts in the provided state/location where this crop grows best."
      }
    },
    required: ["cropName", "reasoning", "estimatedProfitability", "suitableRegions"]
  }
};


export const getCropRecommendation = async (location: string, soilType: string, annualRainfall: number): Promise<CropRecommendationResult[]> => {
  try {
    const prompt = `You are an expert agricultural scientist specializing in Indian farming conditions. A farmer needs a crop recommendation based on the following data:
    - Location (State/District): ${location}
    - Soil Type: ${soilType}
    - Average Annual Rainfall (mm): ${annualRainfall}

    Based on this information, provide a list of 3-5 suitable crops. For each crop, explain the reasoning, estimate its profitability, and list specific suitable regions within the given location. Consider factors like climate suitability, soil compatibility, water requirements, market demand (referencing Indian markets), and resistance to common local pests.

    Return the result as a JSON array matching the provided schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: cropRecommendationSchema,
        temperature: 0.3,
      }
    });

    const responseText = response.text.trim();
    const result = JSON.parse(responseText) as CropRecommendationResult[];
    return result;
  } catch (error) {
    console.error("Error getting crop recommendation:", error);
    throw new Error("Failed to get a crop recommendation from the AI. Please check the input values.");
  }
};
