from flask import Flask
from flask import request
from flask import Response                                
from flask_cors import CORS
import os

import vertexai                                           
from vertexai.language_models import TextGenerationModel  

# Default quiz settings
TOPIC = "Cloud Computing"
NUM_QNS = 5
DIFFICULTY = "Medium"
LANGUAGE = "English"

PROMPT = """
Generate a quiz according to the following specifications:

- Topic: {topic}
- Number of Questions: {num_qns}
- Difficulty: {difficulty}
- Language: {language}

The output must be in the following format:
[
    {{
        "question": "question 1",
        "options": {{
            "a": "option a",
            "b": "option b",
            "c": "option c"
        }},
        "answer": "b"
    }},
    {{
        "question": "question 2",
        "options": {{
            "a": "option a",
            "b": "option b",
            "c": "option c"
        }},
        "answer": "a"
    }}
]

DO NOT ADD QUOTES OUTSIDE THE LIST
"""

app = Flask(__name__)  # Create a Flask object.
CORS(app)
PORT = os.environ.get("PORT")  # Get PORT setting from environment.
if not PORT:
    PORT = 8080

# Initialize Vertex AI access.
vertexai.init(project="cz4052-cloud-computing-418808", location="us-central1") 
parameters = {                                                 
    "candidate_count": 1,                                      
    "max_output_tokens": 1024,                                 
    "temperature": 0.5,                                        
    "top_p": 0.8,                                              
    "top_k": 40,                                               
}                                                              
model = TextGenerationModel.from_pretrained("text-bison@002")             

# This function takes a dictionary, a name, and a default value.
# If the name exists as a key in the dictionary, the corresponding
# value is returned. Otherwise, the default value is returned.
def check(args, name, default):
    if name in args:
        return args[name]
    return default

# The app.route decorator routes any GET requests sent to the /generate
# path to this function, which responds with "Generating:" followed by
# the body of the request.
@app.route("/", methods=["GET"])
# This function generates a quiz using Vertex AI.
def generate():
    args = request.args.to_dict()
    topic = check(args, "topic", TOPIC)
    num_qns = check(args, "num_qns", NUM_QNS)
    difficulty = check(args, "difficulty", DIFFICULTY)
    language = check(args, "language", LANGUAGE)
    prompt = PROMPT.format(topic=topic, num_qns=num_qns, difficulty=difficulty, language=language)
    response = model.predict(prompt, **parameters)      
    print(f"Response from Model: {response.text}")      
    html = f"{response.text}"                           
    return Response(html, mimetype="application/json") 

# This code ensures that your Flask app is started and listens for
# incoming connections on the local interface and port 8080.
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)