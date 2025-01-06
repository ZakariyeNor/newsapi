from flask import Flask, request, jsonify, abort, render_template
import requests
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__, static_folder='static')


#To Get or Fetch Data from public news API
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/posts', methods=['GET'])
def get_posts():
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


post_id = 1
posts = []

#To Post data from public news API
@app.route('/submit', methods=['POST'])
def post_news():
    # Example: Posting user feedback or preferences to an external API
    data = request.json  # Assuming JSON data is sent from the frontend
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        return jsonify({'error': 'Title and content are required.'}), 400
    
    # Store the post locally
    post = {
        'title': title,
        'content': content
    }
    posts.append(post)
    post_id += 1

    # Return the stored post
    return jsonify(posts)
    


#Update route
@app.route('/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    data = request.get_json()
    post = next((p for p in posts if p['id'] == post_id),None)
    if post:
        post['title'] = data.get('title', post['title'])
        post['content'] = data.get('content', post['content'])
        return jsonify(post)
    else:
        return jsonify({'error': 'Post not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)