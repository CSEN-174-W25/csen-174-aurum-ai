from flask import Flask, request, jsonify
from firebase_admin_config import verify_firebase_token

app = Flask(__name__)

@app.route("/protected", methods=["GET"])
def protected():
    token = request.headers.get("Authorization")  # Expect "Bearer <token>"
    if not token or not token.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = token.split("Bearer ")[1]  # Extract token part
    decoded_token = verify_firebase_token(token)

    if decoded_token:
        return jsonify({"message": "Access granted", "user": decoded_token})
    else:
        return jsonify({"error": "Invalid or expired token"}), 401

if __name__ == "__main__":
    app.run(debug=True)
