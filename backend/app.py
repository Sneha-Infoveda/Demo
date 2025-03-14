from flask import Flask, request, jsonify, render_template
import time
import os
import re
import ast
from openai import OpenAI
import markdown
from flask_cors import CORS  # Allows cross-origin requests from React

# NEW: Import SocketIO for real-time communication
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the OpenAI API key from environment variables.
# Make sure the environment variable OPENAI_API_KEY is set externally.
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize SocketIO with CORS allowed for all origins.
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/')
def home():
    return jsonify({"message": "Welcome to ChatVeda AI Backend!"})


def extract_follow_up_questions(full_response):
    """
    Extracts follow-up questions from the response text when formatted as a Python list.
    Returns a tuple: (formatted response without questions, list of extracted questions).
    """
    follow_up_questions = []
    response_text = full_response  

    # Regular expression pattern to detect Python list format
    pattern = r'(\"follow_up_questions\":\s*\[.*?\])'

    match = re.search(pattern, full_response, re.DOTALL)
    
    if match:
        question_section = match.group(1)  # Extract the full Python list string
        try:
            # Convert the extracted Python list string to an actual list using ast.literal_eval
            extracted_dict = ast.literal_eval("{" + question_section + "}")  # Convert to dictionary
            follow_up_questions = extracted_dict.get("follow_up_questions", [])  # Extract list
            print(follow_up_questions)
        except (SyntaxError, ValueError):
            follow_up_questions = []  # If there's an error, return an empty list

        # Remove the follow-up question section from the response text
        response_text = full_response[:match.start()].strip()

    return response_text, follow_up_questions


def format_text(response_text):
    """
    Converts ChatVeda markdown-styled output into HTML for frontend rendering.
    :param response_text: The ChatVeda output with markdown-style formatting.
    :return: HTML formatted string ready for frontend rendering.
    """
    html_output = markdown.markdown(response_text)
    text = re.sub(r"```[a-zA-Z]*", "", html_output)  # Remove markdown-style code block indicators
    text = text.strip()  # Remove leading/trailing spaces
    return text


@app.route('/get_answer_mock', methods=['POST'])
def get_mock_response():
    """Returns a dummy response for UI testing."""
    data = request.json
    user_question = data.get("question", "")

    if not user_question:
        return jsonify({"error": "No question provided"}), 400

    mock_response = {
        "response": f"<b>ChatVeda AI:</b> This is a mock response for your question: <i>{user_question}</i>.",
        "follow_up_questions": [
            "What are the benefits of Karma Yoga?",
            "Can Karma Yoga help in personal growth?",
            "How does Karma Yoga compare to Bhakti Yoga?"
        ],
        "session_id": "test_session"
    }
    return jsonify(mock_response)


active_threads = {}


@app.route('/get_answer', methods=['POST'])
def ask_question():
    """Handles user queries and returns an AI response."""
    data = request.json
    user_question = data.get("question", "")
    session_id = data.get("session_id", "new")
    language = data.get("language", "en")
    if not user_question:
        return jsonify({"error": "No question provided"}), 400

    language_prompt = f"{user_question} Please translate in {language}"
    if session_id in active_threads:
        thread_id = active_threads[session_id]
    else:
        thread = client.beta.threads.create()
        thread_id = thread.id
        active_threads[session_id] = thread_id  

    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=language_prompt
    )

    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id="asst_Esyu2T2quwRAgOvkOmfIOcro"
    )

    while run.status in ["queued", "in_progress"]:
        time.sleep(2)
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
        print(f"Run Status: {run.status}")  

    messages = client.beta.threads.messages.list(thread_id=thread_id)
    if messages.data:
        full_response = messages.data[0].content[0].text.value
    else:
        full_response = "Error: Assistant did not return a response."

    print("Raw Assistant Response:", full_response)
    response_text, follow_up_questions = extract_follow_up_questions(full_response)
    formatted_response = format_text(response_text)
    return jsonify({
        "response": formatted_response, 
        "follow_up_questions": follow_up_questions, 
        "session_id": session_id
    })


@app.route('/update_instructions', methods=['POST'])
def update_instructions():
    """Updates the assistant's instructions dynamically."""
    data = request.json
    new_instructions = data.get("instructions", "")

    if not new_instructions:
        return jsonify({"error": "No new instructions provided"}), 400

    try:
        updated_assistant = client.beta.assistants.update(
            assistant_id="asst_Esyu2T2quwRAgOvkOmfIOcro",
            instructions=new_instructions
        )
        return jsonify({"message": "Instructions updated successfully", "assistant_id": updated_assistant.id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/add_files', methods=['POST'])
def add_files():
    """Adds new files to the assistant's vector store."""
    files = request.files.getlist("files")  # Accept multiple files

    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    file_ids = []
    for file in files:
        uploaded_file = client.files.create(file=file, purpose="assistants")
        file_ids.append(uploaded_file.id)

    updated_vector_store = client.beta.vector_stores.update(
        vector_store_id="vs_67c9426fdc3481919db8101d9018d206",
        file_ids=file_ids  # Add new file IDs to the existing vector store
    )

    return jsonify({
        "message": "Files added successfully", 
        "vector_store_id": updated_vector_store.id
    })


# -------------------------------
# Socket.IO event handlers for real-time support
@socketio.on('connect')
def handle_connect():
    print("Client connected via Socket.IO")


@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected via Socket.IO")


@socketio.on('stream_message')
def handle_stream_message(data):
    """
    Example Socket.IO event handler to process streaming messages from the client.
    """
    print("Received stream_message:", data)
    emit('stream_response', {"message": f"Server received: {data}"})


# NEW: Socket.IO event handler to stream answers in chunks.
@socketio.on("get_answer_stream")
def handle_get_answer_stream(data):
    """
    Processes the get_answer request and streams the answer in chunks.
    This event handler uses your existing logic to generate the answer,
    then simulates streaming by splitting the answer into chunks.
    """
    user_question = data.get("question", "")
    language = data.get("language", "en")
    
    if not user_question:
        emit("streamingData", {"error": "No question provided"})
        return
    
    language_prompt = f"{user_question} Please translate in {language}"
    
    session_id = data.get("session_id", "new")
    if session_id in active_threads:
        thread_id = active_threads[session_id]
    else:
        thread = client.beta.threads.create()
        thread_id = thread.id
        active_threads[session_id] = thread_id
    
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=language_prompt
    )
    
    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id="asst_Esyu2T2quwRAgOvkOmfIOcro"
    )
    
    # Wait for the answer to be generated (this is your existing synchronous logic)
    while run.status in ["queued", "in_progress"]:
        time.sleep(2)
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
        print(f"Run Status: {run.status}")
    
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    if messages.data:
        full_response = messages.data[0].content[0].text.value
    else:
        full_response = "Error: Assistant did not return a response."
    
    print("Raw Assistant Response:", full_response)
    
    response_text, follow_up_questions = extract_follow_up_questions(full_response)
    formatted_response = format_text(response_text)
    
    # Simulate streaming by splitting the formatted response into chunks.
    generated_chunks = [formatted_response[i:i+50] for i in range(0, len(formatted_response), 50)]
    
    for chunk in generated_chunks:
        socketio.emit("streamingData", chunk)
        time.sleep(0.1)
    
    # Optionally, signal end of stream.
    socketio.emit("streamingData", "\n[End of answer]")
    # Optionally, send back the session id as well.
    emit("streamingComplete", {"session_id": session_id})


# -------------------------------
# Run the app with Socket.IO support
if __name__ == '__main__':
    socketio.run(app, debug=True)
