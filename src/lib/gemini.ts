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
  "tags": ["array", "of", "relevant", "search", "tags"]
}

Be specific about the embroidery style, fabric, and color you observe in the image.`;

export async function generateProductDetails(imageBase64: string, mimeType: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
