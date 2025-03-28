import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api, Resource
from app import collect_messages
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("./credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

api = Api(app)

CONTEXT_DIR = "../public/sources"

def load_text_from_files():
    """Loads and combines content from text files in CONTEXT_DIR."""
    context_data = {}

    # Ensure directory exists before reading files
    if not os.path.exists(CONTEXT_DIR):
        print(f"🚨 Directory '{CONTEXT_DIR}' does not exist!")  # Debugging log
        return context_data  # ✅ Return empty dictionary instead of None

    for filename in os.listdir(CONTEXT_DIR):
        if filename.endswith(".txt"):
            file_path = os.path.join(CONTEXT_DIR, filename)
            try:
                with open(file_path, "r", encoding="utf-8") as file:
                    context_data[filename.replace(".txt", "")] = file.read()
            except Exception as e:
                print(f"🚨 Error reading {file_path}: {e}")  # Debugging log

    return context_data

base_system_context = '''
    You are a helpful financial assistant. You assist users with budgeting, saving, investing, and other financial topics.
    Use the provided financial information to tailor responses to the user's specific situation. Keep in mind that the text will
    be displayed in a chat interface, so keep responses concise. Refrain from using #
'''

class ChatHandler(Resource):
    def __init__(self, **kwargs):
        self.context = [{"role": "system",
                        "content": base_system_context}]

    def get(self):
        response = jsonify(context=self.context)
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")

        return response

    # @cross_origin()
    def post(self):
        rqs = request.json
        prompt = rqs.get('prompt')
        user_data = rqs.get('userData', {})
        user_id = user_data.get('uid')

        # Get real-time financial data from Firestore
        if user_id:
            try:
                doc_ref = db.collection('financialData').document(user_id)
                doc = doc_ref.get()
                if doc.exists:
                    fresh_data = doc.to_dict()
                    # Update user_data with fresh financial data
                    user_data.update({
                        'currentBalance': fresh_data.get('financialData', {}).get('currentBalance', 0),
                        'income': fresh_data.get('financialData', {}).get('income', 0),
                        'expenses': fresh_data.get('financialData', {}).get('expenses', 0),
                        'savings': fresh_data.get('financialData', {}).get('savings', 0),
                        'investments': fresh_data.get('investments', []),
                        'budgetCategories': fresh_data.get('budgetCategories', []),
                        'goals': fresh_data.get('financialGoals', [])
                    })
            except Exception as e:
                print(f"Error fetching fresh financial data: {e}")

        # Load financial context from text files
        file_contexts = load_text_from_files()

        # Combine all text file data into a system prompt
        text_context = "\n\n".join([f"### {key.capitalize()} ###\n{value}" for key, value in file_contexts.items()])


        user_context = f"""
        The user is {user_data.get('name', 'Unknown')} and last logged in on {user_data.get('lastLogin', 'Unknown')}.
        Today is {user_data.get('currentDate', 'Unknown')}.

        Their financial summary:
        - **Total Balance**: ${user_data.get('currentBalance', 0):,.2f}
        - **Monthly Income:** ${user_data.get('income', 0):,.2f}
        - **Monthly Expenses:** ${user_data.get('expenses', 0):,.2f}
        - **Total Savings:** ${user_data.get('savings', 0):,.2f}

        **Investment Allocation:**
        {chr(10).join(f"- {inv.get('type', 'Unknown')}: {inv.get('percentage', 0)}%" for inv in user_data.get('investments', []))}

        **Budget Categories:**
        {chr(10).join(f'- {cat.get("name", "Unknown")}: ${cat.get("spent", 0):,.2f} spent of ${cat.get("budget", 0):,.2f} budget' for cat in user_data.get('budgetCategories', []))}

        **Financial Goals:**
        {chr(10).join(f'- {goal.get("name", "Unknown")}: ${goal.get("current", 0):,.2f} saved of ${goal.get("target", 0):,.2f} target' for goal in user_data.get('goals', []))}

        Use this information to provide personalized financial advice.
        """

        system_context = f"""
        You are a financial assistant providing expert advice on budgeting, investing, and financial planning.
        Use the following financial knowledge as context:
        {text_context}
        
        Additionally, personalize responses using the user’s financial details:
        {user_context}
        """

        context = [{"role": "system", "content": system_context}]
        context.append({"role": "user", "content": prompt})

        response_data = collect_messages(prompt, context)
        response = jsonify(response_data)

        # Ensure CORS headers are set
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response
    
    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response


api.add_resource(ChatHandler, '/')

if __name__ == '__main__':
    app.run(debug=True, port=5001)