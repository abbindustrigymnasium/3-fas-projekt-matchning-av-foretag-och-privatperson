#Start with cmd, path: "C:\Users\23marper\Documents\Codes\pocketbase\pb_app\src", then "python getJSON.py"

import requests
from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for all domains (or specify domains as needed)
CORS(app)  # This will allow cross-origin requests from any domain

base_url = "https://student-match-pb.cloud.spetsen.net/api/collections/users/records"
headers = {
    "Authorization": "Bearer your_api_token"  # Ensure you replace with your actual API token
}

response = requests.get(base_url, headers=headers, params={"page": 1, "perPage": 50})
data = response.json()
print(data)  # Check the response for debugging

def get_all_records():
    page = 1
    per_page = 50  # Adjust this as needed for pagination
    all_records = []

    while True:
        url = f"{base_url}?page={page}&perPage={per_page}"
        response = requests.get(url, headers=headers)
        
        # Debug: Log the URL and response status
        print(f"Fetching records from: {url}")
        print(f"Response Status Code: {response.status_code}")

        if response.status_code == 200:
            records = response.json().get('items', [])
            if not records:  # If no records are found, stop fetching
                break
            all_records.extend(records)  # Add records to the list
            page += 1  # Move to the next page
        else:
            print(f"Failed to fetch records: {response.status_code}, Response: {response.text}")
            break

    return all_records

@app.route('/get-json', methods=['GET'])
def get_all_json_data():
    records = get_all_records()
    if records:
        return jsonify({"records": records})
    else:
        return jsonify({"error": "No records found"}), 404

@app.route('/get-json/<record_id>', methods=['GET'])
def get_user_json_data(record_id):
    url = f"{base_url}/{record_id}"  # Ensure the URL has '/records/' before the ID
    try:
        response = requests.get(url, headers=headers)

        if response.status_code == 404:
            return jsonify({"error": f"Record {record_id} not found"}), 404

        response.raise_for_status()
        user_data = response.json()

        file_json_data = user_data.get("fileJSON", None)
        if file_json_data is None:
            return jsonify({"error": "'fileJSON' field is missing"}), 404

        return jsonify(file_json_data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
