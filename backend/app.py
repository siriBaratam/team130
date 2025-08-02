from flask import Flask, request, jsonify
import uuid
import os
import pdfplumber
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

app = Flask(__name__)


# Store results in memory (you can use a DB later)
results = {}

# Load environment variables
from dotenv import load_dotenv
load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")


# Load LLM (use small one if no GPU, or run this in Colab)
model_name = "mistralai/Mistral-7B-Instruct-v0.2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    token=HF_TOKEN,
    device_map="auto",
    torch_dtype="auto",
)
llm = pipeline("text-generation", model=model, tokenizer=tokenizer, max_new_tokens=512)


# Extract text from PDF
def extract_text(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text[:3000]  # Trim long docs


# LLM tasks
def run_task(task, text):
    prompts = {
        "summary": f"Summarize the following text:\n\n{text}",
        "quiz": f"Generate a 5-question multiple choice quiz from the following content:\n\n{text}",
        "flashcards": f"Create flashcards (question and answer pairs) from the following content:\n\n{text}",
        "qa": f"Generate a list of comprehension questions and answers based on the following content:\n\n{text}",
    }
    if task not in prompts:
        return "Invalid task"

    response = llm(prompts[task])[0]["generated_text"]
    return response


# POST /upload
@app.route("/upload", methods=["POST"])
def upload():
    file = request.files.get("file")
    task = request.form.get("task")

    if not file or not task:
        return jsonify({"error": "File and task are required"}), 400

    temp_path = f"temp_{uuid.uuid4()}.pdf"
    file.save(temp_path)

    try:
        text = extract_text(temp_path)
        output = run_task(task.lower(), text)

        job_id = str(uuid.uuid4())
        results[job_id] = output

        return jsonify({"job_id": job_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(temp_path)


# GET /result/<job_id>
@app.route("/result/<job_id>", methods=["GET"])
def get_result(job_id):
    result = results.get(job_id)
    if result:
        return jsonify({"result": result})
    return jsonify({"error": "Job not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
