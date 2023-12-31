from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Setup basic logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

user_paths = []
default_host = None

@app.route('/set_paths', methods=['POST', 'OPTIONS'])
def set_paths():
    app.logger.debug("Received request on /set_paths")
    global user_paths, default_host
    if request.method == 'OPTIONS':
        return app.make_default_options_response()
    else:
        data = request.json
        user_paths = data.get('paths', [])
        default_host = data.get('host', '')
        response = jsonify({"message": "Paths and host updated successfully"})
        app.logger.debug("Response: " + str(response))
        return response

if __name__ == '__main__':
    app.run(host='localhost', port=8089, debug=True)
