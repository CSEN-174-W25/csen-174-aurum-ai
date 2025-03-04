from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api, Resource
from app import collect_messages

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

api = Api(app)


base_system_context = '''
    You are a helpful financial assistant. You assist users with budgeting, saving, investing, and other financial topics.
    Use the provided financial information to tailor responses to the user's specific situation. Keep in mind that the text will
    be displayed in a chat interface, so keep responses concise and do not use **bold** or other formatting that is not supported in plain text.
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

        user_context = f"""
        The user is {user_data.get('name', 'Unknown')} and last logged in on {user_data.get('lastLogin', 'Unknown')}.
        Today is {user_data.get('currentDate', 'Unknown')}.

        Their financial summary:
        - **Income:** ${user_data.get('income', 0)}
        - **Expenses:** ${user_data.get('expenses', 0)}
        - **Savings:** ${user_data.get('savings', 0)}
        - **Investment Allocation:**
          - Stocks: {user_data.get('investments', {}).get('Stocks', 0)}%
          - Bonds: {user_data.get('investments', {}).get('Bonds', 0)}%
          - Real Estate: {user_data.get('investments', {}).get('Real Estate', 0)}%
          - Cash: {user_data.get('investments', {}).get('Cash', 0)}%

        - **Budget Progress:**
        """ + '\n'.join([
            f"  - {cat['name']}: Spent ${cat['spent']} out of ${cat['budget']}" 
            for cat in user_data.get('budgetCategories', [])
        ]) + """
        
        - **Financial Goals:**
        """ + '\n'.join([
            f"  - {goal['name']}: ${goal['current']} saved out of ${goal['target']}"
            for goal in user_data.get('goals', [])
        ]) + """

        Use this information to personalize your financial advice.
        """

        context = [{"role": "system", "content": base_system_context + user_context}]
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