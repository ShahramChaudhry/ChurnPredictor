import os
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  


MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/churn_xgb_optimized.pkl")
model = joblib.load(MODEL_PATH)


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "API is running"}), 200


@app.route("/predict", methods=["POST"])
def predict():
    try:
   
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        input_df = pd.DataFrame([data])
        feature_order = [
            "SeniorCitizen", "Partner", "Dependents", "tenure", "PhoneService", "MultipleLines",
            "OnlineSecurity", "OnlineBackup", "DeviceProtection", "TechSupport", "PaperlessBilling",
            "MonthlyCharges", "TotalCharges", "TotalCharges/tenure", "MonthlyCharges/tenure",
            "SeniorCitizen_Monthly", "tenure_group", "InternetService_Fiber optic",
            "InternetService_No", "Contract_One year", "Contract_Two year",
            "PaymentMethod_Credit card (automatic)", "PaymentMethod_Electronic check",
            "PaymentMethod_Mailed check"
        ]

        print("\n[DEBUG] 🔹 Expected Columns in Model:", feature_order)
        print("\n[DEBUG] 🔹 Columns in Incoming Data:", input_df.columns.tolist())
        input_df = input_df.reindex(columns=feature_order, fill_value=0)

        input_df.columns = model.get_booster().feature_names 

        prediction = model.predict(input_df)
        probability = model.predict_proba(input_df)[:, 1] 

        response = {
            "churn_prediction": int(prediction[0]),
            "churn_probability": float(probability[0])
        }
        return jsonify(response), 200

    except Exception as e:
        print("\n[DEBUG] ❌ Error Occurred:", str(e))  
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)