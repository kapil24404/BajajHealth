const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

// GET request: Hardcoded response
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// POST request: Dynamic processing of input data
app.post("/bfhl", (req, res) => {
  try {
    const { data: requestData } = req.body;

    if (!requestData || !Array.isArray(requestData)) {
      return res.status(400).json({
        is_success: false,
        message: "Invalid input. 'data' field must be an array.",
      });
    }

    let numbers = requestData.filter((item) => !isNaN(item));
    let alphabets = requestData.filter((item) => isNaN(item) && item.length === 1);
    let highestAlphabet = alphabets.length > 0 ? [alphabets.sort((a, b) => b.localeCompare(a))[0]] : [];

    return res.status(200).json({
      is_success: true,
      user_id: "john_doe_17091999",
      email: "john@xyz.com",
      roll_number: "ABCD123",
      numbers,
      alphabets,
      highest_alphabet: highestAlphabet,
    });
  } catch (error) {
    res.status(500).json({
      is_success: false,
      message: "Internal Server Error",
    });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
