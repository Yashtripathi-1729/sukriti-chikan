import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const CHIKAN_PROMPT = `You are an expert in Lucknowi Chikankari embroidery and Indian ethnic fashion.
Analyze this product image and generate details for an e-commerce listing.

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "name": "A catchy product name (e.g., 'Ivory Jaali Work Cotton Kurti')",
  "description": "A 2-3 sentence appealing product description highlighting the craftsmanship, fabric feel, and styling suggestions",
  "category": "One of: kurti, suit, saree, dupatta, fabric, men, kids, accessories",
  "fabric": "Detected fabric type (e.g., Cotton, Georgette, Chiffon, Modal, Linen)",
  "work_type": "Detected chikankari stitch types (e.g., Shadow Work, Jaali, Tepchi, Murri, Phanda)",
  "colour": "Main colour in one or two words (e.g., Ivory, Powder Blue, Deep Plum)",
  "tags": ["array", "of", "relevant", "search", "tags"]
}

Be specific about the embroidery style, fabric, and color you observe in the image.
If no chikankari work is visible, still describe the garment as accurately as you can and leave work_type empty.
Never refuse; always return the JSON object.`;

// Retries cover temporary "high demand" 503s and the occasional non-JSON reply
export async function generateProductDetails(imageBase64: string, mimeType: string, attempts = 3) {
  for (let i = 1; ; i++) {
    try {
      return await callGemini(imageBase64, mimeType);
    } catch (err) {
      if (i >= attempts) throw err;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

async function callGemini(imageBase64: string, mimeType: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-4-hydrogen",
    generationConfig: { responseMimeType: "application/json" },
  });

  const result = await model.generateContent([
    CHIKAN_PROMPT,
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ]);

  const text = result.response.text().trim();
  // Strip markdown code fences if present
  const cleaned = text.replace(/^```json?\s*/, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}
