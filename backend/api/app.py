import os
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

# Load trained XGBoost model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/churn_xgb_optimized.pkl")
model = joblib.load(MODEL_PATH)

# Define the route for health check
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "API is running"}), 200

# Define the route for churn prediction
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON request data
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Convert input data to DataFrame
        input_df = pd.DataFrame([data])

        # ✅ Define the expected feature order (from training)
        feature_order = [
            "SeniorCitizen", "Partner", "Dependents", "tenure", "PhoneService", "MultipleLines",
            "OnlineSecurity", "OnlineBackup", "DeviceProtection", "TechSupport", "PaperlessBilling",
            "MonthlyCharges", "TotalCharges", "TotalCharges/tenure", "MonthlyCharges/tenure",
            "SeniorCitizen_Monthly", "tenure_group", "InternetService_Fiber optic",
            "InternetService_No", "Contract_One year", "Contract_Two year",
            "PaymentMethod_Credit card (automatic)", "PaymentMethod_Electronic check",
            "PaymentMethod_Mailed check"
        ]

        # ✅ Print Debugging Info
        print("\n[DEBUG] 🔹 Expected Columns in Model:", feature_order)
        print("\n[DEBUG] 🔹 Columns in Incoming Data:", input_df.columns.tolist())

        # ✅ Ensure input has the correct feature columns
        input_df = input_df.reindex(columns=feature_order, fill_value=0)

        # 🚀 **🔥 FIX FEATURE NAMES IN XGBOOST**
        input_df.columns = model.get_booster().feature_names  # Explicitly set feature names

        # ✅ Make prediction
        prediction = model.predict(input_df)
        probability = model.predict_proba(input_df)[:, 1]  # Get probability of churn

        # ✅ Return response
        response = {
            "churn_prediction": int(prediction[0]),
            "churn_probability": float(probability[0])
        }
        return jsonify(response), 200

    except Exception as e:
        print("\n[DEBUG] ❌ Error Occurred:", str(e))  # Print error in console
        return jsonify({"error": str(e)}), 500
# Run the app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)