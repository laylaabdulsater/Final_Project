from flask import Flask, jsonify, render_template
import pandas as pd 

app = Flask(__name__)

@app.route("/")
def index(): 
    return render_template("index.html")


@app.route("/api/fraud_address")
def api_fraud_address():
    
    df = pd.read_csv('Fraud_address.csv')
    output_data = df.to_dict()
    keys = output_data.keys()
    print(keys)
    return jsonify(output_data)

@app.route("/api/Fraud_Merch")
def api_Fraud_Merch():

    df = pd.read_csv('Fraud_Merch.csv')
    sample_df = df.sample(n=10000) #sample of 1000 values from the Data Frame
    category_totals = sample_df.groupby('category')['amt'].sum().reset_index()
    output_merchdata = category_totals.to_dict(orient="records")
    return jsonify(output_merchdata)
   
@app.route("/api/Multiple_fraud")
def api_Multiple_Fraud():
    df = pd.read_csv('Multiple_fraud.csv')
    sample_df = df.sample(n=5000) #sample of 500 values from the Data Frame
    output_Multiplefraud = sample_df.to_dict(orient="records")
    return jsonify(output_Multiplefraud)

if __name__ == "__main__":
    app.run()