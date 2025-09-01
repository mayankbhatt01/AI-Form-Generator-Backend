"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFormSchema = generateFormSchema;
const genai_1 = require("@google/genai");
const apiKey = "AIzaSyBP1KYVlqViO0xadqYKiAklDcoaKQE0lDI";
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}
const ai = new genai_1.GoogleGenAI({
    apiKey: apiKey,
});
async function generateFormSchema(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `You are a JSON generator. Based on the user prompt, return ONLY a JSON object that strictly adheres to this structure:
{
  "title": "string",
  "formStructure": {
    "title": "string",
    "fields": [
      { "id": "string", "label": "string", "type": "text|email|number|textarea|select|checkbox|radio|file", "required": true|false, "placeholder": "string (optional)", "options": ["string"] (if select/radio/checkbox), "accept": ["image/*"] (if file) }
    ],
    "submitText": "string"
  }
}
User prompt: ${prompt}`
                    }
                ]
            }
        ]
    });
    // The rest of your code to process the response
    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        console.error("Gemini API returned an empty or invalid response.");
        throw new Error("Gemini API returned an empty response. Please try a different prompt.");
    }
    try {
        const cleanedText = text.replace(/```json\n|```/g, '').trim();
        const generatedForm = JSON.parse(cleanedText);
        // This is the object you should use for creating your Mongoose document.
        console.log(JSON.stringify(generatedForm, null, 2));
        return generatedForm;
    }
    catch (err) {
        console.error('Error parsing JSON:', err);
        throw new Error("Invalid JSON from Gemini: " + text);
    }
}
