
import React, { useState, useCallback, ChangeEvent } from 'react';
import { diagnoseCropDisease } from '../services/geminiService';
import type { DiagnosisResult } from '../types';
import { UploadCloudIcon, CheckCircleIcon, XCircleIcon, SparklesIcon, AlertTriangleIcon } from './common/Icons';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

const DiagnosisResultCard: React.FC<{ result: DiagnosisResult }> = ({ result }) => {
  const isHealthy = result.isHealthy;
  return (
    <div className={`mt-6 p-6 rounded-lg shadow-lg ${isHealthy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
      <div className="flex items-center">
        {isHealthy ? <CheckCircleIcon className="h-8 w-8 text-green-500" /> : <XCircleIcon className="h-8 w-8 text-red-500" />}
        <h2 className="ml-3 text-2xl font-bold">{result.diseaseName}</h2>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">Description</h3>
        <p className="mt-1 text-gray-600">{result.description}</p>
      </div>
      {!isHealthy && result.treatment && result.treatment.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Recommended Treatment</h3>
          <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
            {result.treatment.map((step, index) => <li key={index}>{step}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

const CropDoctor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };
  
  const handleDiagnose = useCallback(async () => {
    if (!image) return;
    
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "crop_image.jpg", { type: blob.type });

      const base64Image = await fileToBase64(file);
      const diagnosisResult = await diagnoseCropDisease(base64Image);
      setResult(diagnosisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, [image]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Crop Doctor AI</h1>
      <p className="mt-2 text-gray-600">Upload an image of a crop leaf to diagnose diseases and get treatment recommendations.</p>

      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              {image ? (
                <img src={image} alt="Crop preview" className="h-full w-full object-contain rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloudIcon className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, or JPEG</p>
                </div>
              )}
              <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg" />
            </label>
          </div>
          <div className="mt-6">
            <button
              onClick={handleDiagnose}
              disabled={!image || loading}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Diagnosing...
                </>
              ) : (
                <>
                  <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
                  Diagnose with AI
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-md bg-yellow-50 border border-yellow-200 flex items-start">
             <AlertTriangleIcon className="h-6 w-6 text-yellow-500 flex-shrink-0"/>
             <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Diagnosis Failed</h3>
                <p className="mt-1 text-sm text-yellow-700">{error}</p>
             </div>
          </div>
        )}
        
        {result && <DiagnosisResultCard result={result} />}
      </div>
    </div>
  );
};

export default CropDoctor;
