const { OpenAI } = require("openai");
require("dotenv").config();

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate AI response
const generateResponse = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model:  "gpt-3.5-turbo", //  gpt-4o-mini
      messages: [
        { role: "system", content: "You are a helpful assistant specialized in telemedicine." },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content.trim(); // extract AI response
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    throw new Error("Unable to process your request at this time.");
  }
};

module.exports = { generateResponse };
