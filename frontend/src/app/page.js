"use client";

import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://churnpredictor-n2te.onrender.com";

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
      const response = await axios.post(`${API_URL}/predict`, formData);
      setPrediction(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffffff", // White background
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#f9f9f9",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "450px", // Keeps everything inside
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#333", marginBottom: "15px" }}>
          Churn Prediction App
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Senior Citizen, Partner, Dependents */}
          <div style={{ display: "flex", gap: "10px" }}>
            {["SeniorCitizen", "Partner", "Dependents"].map((field) => (
              <label key={field} style={{ flex: "1", textAlign: "left", fontSize: "14px", color: "#333" }}>
                {field.replace(/([A-Z])/g, " $1")}
                <select name={field} value={formData[field]} onChange={handleChange} 
                        style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </label>
            ))}
          </div>

          {/* Tenure, Monthly Charges, Total Charges */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {["tenure", "MonthlyCharges", "TotalCharges"].map((field) => (
              <label key={field} style={{ textAlign: "left", fontSize: "14px", color: "#333" }}>
                {field.replace(/([A-Z])/g, " $1")}
                <input type="number" name={field} value={formData[field]} onChange={handleChange} 
                       style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
              </label>
            ))}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} 
                  style={{
                    backgroundColor: "#007bff",
                    color: "#ffffff",
                    padding: "12px",
                    borderRadius: "5px",
                    fontSize: "16px",
                    cursor: "pointer",
                    border: "none",
                    fontWeight: "bold",
                    width: "100%"
                  }}>
            {loading ? "Predicting..." : "🔮 Predict Churn"}
          </button>
        </form>

        {/* Prediction Output */}
        {prediction && (
          <div style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#e9ecef",
            borderRadius: "5px",
            fontSize: "16px"
          }}>
            <p style={{ fontWeight: "bold", color: "#333" }}>
              Churn Prediction: 
              <span style={{ color: prediction.churn_prediction ? "red" : "green", marginLeft: "5px" }}>
                {prediction.churn_prediction ? "Yes" : "No"}
              </span>
            </p>
            <p style={{ fontWeight: "bold", color: "#007bff" }}>
              Probability: {(prediction.churn_probability * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;