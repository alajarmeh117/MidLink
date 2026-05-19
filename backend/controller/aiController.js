const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // هذا السطر بيجبر الملف يقرأ الـ .env فوراً

exports.checkSymptoms = async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms) {
    return res.status(400).json({ message: "Please provide your symptoms." });
  }

  // سحب المفتاح هنا والتأكد من وجوده
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key is missing in .env file!");
    return res
      .status(500)
      .json({ message: "Server configuration error: Missing API Key." });
  }

  try {
    // تهيئة الاتصال
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
    You are a smart medical assistant for the "MidLink" healthcare platform in Jordan.
    Analyze the following patient symptoms: "${symptoms}"
    
    Provide your response ONLY in strict JSON format with exactly these three keys (Do not include markdown or \`\`\`json tags):
    {
      "specialty": "The recommended medical specialty in Arabic with the English term in brackets (e.g., طب القلب (Cardiology), طب الأعصاب (Neurology), الطب العام (General Practice))",
      "isEmergency": true or false (true if life-threatening like severe chest pain, heavy bleeding, difficulty breathing),
      "advice": "A short, friendly piece of preliminary medical advice written entirely in Arabic."
    }
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // تنظيف النص من أي علامات Markdown
    text = text
      .replace(/```json/gi, "")
      .replace(/```/gi, "")
      .trim();

    const aiResult = JSON.parse(text);
    res.status(200).json(aiResult);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res
      .status(500)
      .json({ message: "Error analyzing symptoms. Please try again later." });
  }
};
