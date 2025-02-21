from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import re

app = FastAPI()

# Static user details
USER_ID = "john_doe_17091999"
EMAIL = "john@xyz.com"
ROLL_NUMBER = "ABCD123"

# Define request model
class InputData(BaseModel):
    data: List[str]

# Function to separate numbers and alphabets
def process_data(data):
    numbers = [item for item in data if item.isdigit()]
    alphabets = [item for item in data if item.isalpha()]
    highest_alphabet = [max(alphabets, key=str.lower)] if alphabets else []
    return numbers, alphabets, highest_alphabet

# 📌 GET Endpoint - Returns operation_code
@app.get("/bfhl")
def get_operation_code():
    return {"operation_code": 1}

# 📌 POST Endpoint - Processes Input Data
@app.post("/bfhl")
def post_process_data(input_data: InputData):
    data = input_data.data

    if not isinstance(data, list) or not all(isinstance(item, str) for item in data):
        raise HTTPException(status_code=400, detail="Invalid input: Data should be a list of strings.")

    numbers, alphabets, highest_alphabet = process_data(data)

    return {
        "is_success": True,
        "user_id": USER_ID,
        "email": EMAIL,
        "roll_number": ROLL_NUMBER,
        "numbers": numbers,
        "alphabets": alphabets,
        "highest_alphabet": highest_alphabet
    }

# Run Locally with: uvicorn main:app --reload
