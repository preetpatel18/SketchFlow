import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export const analyzeImage = async (base64Data) => {
  const prompt = `Analyze the provided image and generate a structured, semantic HTML layout that accurately represents its design. Ensure that:
  - The structure includes appropriate tags (<header>, <section>, <footer>, etc.).
  - Use meaningful class names for styling.
  - Add alt text for images to ensure accessibility.
  - If forms or buttons exist, include proper <input>, <button>, and <label> elements.
  - Keep the code clean, well-indented, and easy to modify.`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/png",
        },
      },
    ]);

    const rawHtml = result.response.text();

    const cleanedHtml = rawHtml
      .replace(/```html\s*/i, '')
      .replace(/```$/, '')
      .trim();

    return cleanedHtml;
  } catch (error) {
    console.error("Gemini error:", error);
    throw error;
  }
};
