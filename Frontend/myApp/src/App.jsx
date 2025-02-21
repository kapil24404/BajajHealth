import React, { useState } from "react";
import Select from "react-select";

export default function App() {
  document.title = "22BCS10251_KAPIL"; // Roll number as title

  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Dropdown filter options
  const options = [
    { value: "numbers", label: "Numbers" },
    { value: "alphabets", label: "Alphabets" },
    { value: "highest_alphabet", label: "Highest Alphabet" },
  ];

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate JSON input
      let parsedInput;
      try {
        parsedInput = JSON.parse(jsonInput);
      } catch {
        throw new Error("Invalid JSON format. Please enter a valid JSON object.");
      }

      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error("Invalid JSON format. Ensure 'data' is an array.");
      }

      setError(""); // Clear previous errors

      // Send API request
      const response = await fetch("http://localhost:5000/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedInput),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data from server.");
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  // Filter API response based on selected filters
  const filteredResponse = response
    ? Object.fromEntries(
        Object.entries(response).filter(([key]) =>
          selectedFilters.some((filter) => filter.value === key)
        )
      )
    : {};

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      {/* API Input Box */}
      <div className="w-full max-w-md p-4 border bg-white rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">BAJAJ FINSERV HEALTH DEV CHALLENGE</h2>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"data":["M","1","334","4","B"]}'
          className="border p-2 w-full rounded h-24 resize-none"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full mt-3"
        >
          Submit
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Multi-Select Dropdown */}
      {response && (
        <div className="w-full max-w-md p-4 mt-4 border bg-white rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Multi Filter</h2>
          <Select
            options={options}
            isMulti
            onChange={setSelectedFilters}
            className="mb-4"
          />

          {/* Filtered Response */}
          <h3 className="font-semibold">Filtered Response</h3>
          <div className="bg-gray-100 p-2 mt-2 rounded">
            {selectedFilters.length === 0 ? (
              <p className="text-gray-600 italic">Select a filter to see results.</p>
            ) : (
              Object.entries(filteredResponse).map(([key, value]) => (
                <p key={key} className="text-gray-800">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {Array.isArray(value) ? value.join(", ") : value}
                </p>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
