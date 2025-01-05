from flask import Flask, request, jsonify, abort, render_template
import requests
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/news')
def get_news():
    country = request.args.get('country', 'us')
    category = request.args.get('category', 'general')
    api_key = os.getenv('API_KEY')

    if not api_key:
        return jsonify({'error': 'API key not set.'}), 500

    url = 'https://newsapi.org/v2/top-headlines'
    params = {
        'country': country,
        'category': category,
        'apiKey': api_key
    }


    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.HTTPError as errh:
        return jsonify({'error': f'HTTP Error: {errh}'}), 500
    except requests.exceptions.ConnectionError as errc:
        return jsonify({'error': f'Error Connecting: {errc}'}), 500
    except requests.exceptions.Timeout as errt:
        return jsonify({'error': f'Timeout Error: {errt}'}), 500
    except requests.exceptions.RequestException as err:
        return jsonify({'error': f'Error: {err}'}), 500



if __name__ == '__main__':
    app.run(debug=True)