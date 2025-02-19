"use client";

import React, { useState } from "react";
import axios from "axios";

function App() {
  const initialFormData = {
    SeniorCitizen: 0, Partner: 0, Dependents: 0, tenure: 0,
    PhoneService: 1, MultipleLines: 0, OnlineSecurity: 0, OnlineBackup: 0,
    DeviceProtection: 0, TechSupport: 0, PaperlessBilling: 0,
    MonthlyCharges: 0, TotalCharges: 0, "TotalCharges/tenure": 0,
    "MonthlyCharges/tenure": 0, "SeniorCitizen_Monthly": 0,
    tenure_group: 1, "InternetService_Fiber optic": 0,
    "InternetService_No": 0, "Contract_One year": 0, "Contract_Two year": 0,
    "PaymentMethod_Credit card (automatic)": 0, "PaymentMethod_Electronic check": 0,
    "PaymentMethod_Mailed check": 0
  };

  const [formData, setFormData] = useState(initialFormData);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://churnpredictor-n2te.onrender.com/predict", formData);
      setPrediction(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Churn Prediction App</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Senior Citizen, Partner, Dependents */}
          <div className="grid grid-cols-3 gap-4">
            <label className="block">
              <span className="text-gray-700">Senior Citizen</span>
              <select name="SeniorCitizen" value={formData.SeniorCitizen} onChange={handleChange} className="block w-full mt-1 p-2 border rounded-md text-black">
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </label>

            <label className="block">
              <span className="text-gray-700">Partner</span>
              <select name="Partner" value={formData.Partner} onChange={handleChange} className="block w-full mt-1 p-2 border rounded-md text-black">
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </label>

            <label className="block">
              <span className="text-gray-700">Dependents</span>
              <select name="Dependents" value={formData.Dependents} onChange={handleChange} className="block w-full mt-1 p-2 border rounded-md text-black">
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </label>
          </div>

          {/* Tenure, Monthly Charges, Total Charges */}
          <div className="grid grid-cols-3 gap-4">
            <label className="block">
              <span className="text-gray-700">Tenure (Months)</span>
              <input type="number" name="tenure" value={formData.tenure} onChange={handleChange} className="block w-full mt-1 p-2 border rounded-md text-black" />
            </label>

            <label className="block">
              <span className="text-gray-700">Monthly Charges</span>
              <input type="number" name="MonthlyCharges" value={formData.MonthlyCharges} onChange={handleChange} className="block w-full mt-1 p-2 border rounded-md text-black" />
            </label>

            <label className="block">
              <span className="text-gray-700">Total Charges</span>
              <input type="number" name="TotalCharges" value={formData.TotalCharges} onChange={handleChange} className="block w-full mt-1 p-2 border rounded-md text-black" />
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button type="submit" disabled={loading} className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 transition">
              {loading ? "Predicting..." : "Predict Churn"}
            </button>
          </div>
        </form>

        {/* Prediction Output */}
        {prediction && (
          <div className="mt-6 text-center bg-gray-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">Churn Prediction: 
              <span className={prediction.churn_prediction ? "text-red-600" : "text-green-600"}>
                {prediction.churn_prediction ? " Yes" : " No"}
              </span>
            </p>
            <p className="text-lg font-semibold">Probability: <span className="text-blue-600">{(prediction.churn_probability * 100).toFixed(2)}%</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;