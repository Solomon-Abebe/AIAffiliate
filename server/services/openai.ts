import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ChatResponse {
  message: string;
  recommendations?: string[];
}

export async function generateChatResponse(userMessage: string, context?: string): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are an AI shopping assistant for AffiliatePro, an affiliate marketing website. Your role is to:

1. Help users find products that match their needs
2. Provide honest, unbiased product recommendations
3. Compare products objectively
4. Answer questions about product features, specs, and use cases
5. Be transparent about affiliate relationships

Context about available products: ${context || "Various electronics, fitness trackers, smart home devices, laptops, headphones, and other consumer products"}

Guidelines:
- Be helpful, friendly, and knowledgeable
- Ask clarifying questions when needed
- Provide specific product recommendations when possible
- Mention that recommendations are based on extensive analysis
- Keep responses concise but informative
- Always disclose that purchases through affiliate links support the platform`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiMessage = response.choices[0].message.content || "I'm sorry, I couldn't process your request. Please try again.";

    return {
      message: aiMessage,
      recommendations: extractRecommendations(aiMessage)
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      message: "I'm experiencing some technical difficulties right now. Please try again in a moment or contact our support team for assistance.",
    };
  }
}

function extractRecommendations(message: string): string[] {
  // Extract product names or recommendations from the AI response
  const recommendations: string[] = [];
  const lines = message.split('\n');
  
  lines.forEach(line => {
    if (line.includes('recommend') || line.includes('suggest') || line.includes('consider')) {
      const cleanLine = line.trim().replace(/^[-*•]\s*/, '');
      if (cleanLine.length > 10 && cleanLine.length < 100) {
        recommendations.push(cleanLine);
      }
    }
  });
  
  return recommendations.slice(0, 3); // Return max 3 recommendations
}

export async function generateProductRecommendations(userQuery: string, products: any[]): Promise<string[]> {
  try {
    const productList = products.map(p => `${p.name} - ${p.category} - $${p.price}`).join('\n');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a product recommendation expert. Based on the user's query and available products, recommend the most suitable products. Respond with a JSON array of product names only."
        },
        {
          role: "user",
          content: `User query: ${userQuery}\n\nAvailable products:\n${productList}\n\nRecommend the best matching products:`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 200,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
    return result.recommendations || [];
  } catch (error) {
    console.error("Product recommendation error:", error);
    return [];
  }
}
