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

@app.route("/api/fraud_personal")
def api_fraud_personal():

    df = pd.read_csv('Fraud_Personal.csv')
    sample_perosnaldf = df.sample(n=10000)
    personal_totals = sample_perosnaldf['gender']
    output_personal = personal_totals.tolist()
    return jsonify(output_personal)
   
@app.route("/api/Fraud_Merch")
def api_Fraud_Merch():

    df = pd.read_csv('Fraud_Merch.csv')
    sample_df = df.sample(n=10000) #sample of 1000 values from the Data Frame
    category_totals = sample_df.groupby('category')['amt'].sum().reset_index()
    output_merchdata = category_totals.to_dict(orient="records")
    return jsonify(output_merchdata)

@app.route("/api/Fraud_Date")
def api_Fraud_Date():

    df = pd.read_csv('fraud_by_date_category.csv')
    output_date_category = df.to_dict(orient="records")
    return jsonify(output_date_category)

@app.route('/api/fraud_address')
def map():
    # Create a map centered at the first entry's coordinates
    map_center = [data.iloc[0]['lat'], data.iloc[0]['long']]
    fraud_map = folium.Map(location=map_center, zoom_start=6)

    # Add markers for each fraud address
    for _, row in data.iterrows():
        popup_text = f"{row['first']} {row['last']}<br>{row['street']}<br>{row['city']}, {row['state']}<br>Population: {row['city_pop']}"
        folium.Marker(location=[row['lat'], row['long']], popup=popup_text).add_to(fraud_map)

    # Save the map to an HTML file
    map_file = "fraud_map.html"
    fraud_map.save(map_file)

    # Render the template with the map file path
    return render_template('index.html', map_file=map_file)

if __name__ == "__main__":
    app.run()