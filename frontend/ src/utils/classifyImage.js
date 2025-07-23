export const classifyImage = async (base64ImageData, uploadedImage, saveToHistoryFn) => {
    const prompt = `Analyze this image of a painting. Identify its primary artistic style (e.g., Impressionism, Cubism, Surrealism). Provide a confidence score between 0.0 and 1.0 for your prediction. Then, write a 2-3 sentence description explaining the key characteristics that support your classification, as if you were an AI art curator.`;
  
    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: base64ImageData } }
        ]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            style: { type: "STRING" },
            confidence: { type: "NUMBER" },
            description: { type: "STRING" }
          },
          required: ["style", "confidence", "description"]
        }
      }
    };
  
    const apiKey = ""; // Handled by environment
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) throw new Error("Failed to classify image");
  
    const result = await response.json();
    const content = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(content);
    await saveToHistoryFn(parsed);
    return parsed;
  };
  