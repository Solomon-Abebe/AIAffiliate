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
    const systemPrompt = `You are an AI assistant for DevToolHub, a specialized platform for fullstack developers focusing on React, Node.js, and modern web development tools.

Your role is to:
1. Help developers find the best tools, courses, and services for their projects
2. Provide expert recommendations based on development needs and skill level
3. Compare development tools objectively
4. Answer questions about React, Node.js, TypeScript, databases, cloud services
5. Guide users to relevant blog content and learning resources
6. Share practical development insights and best practices

About DevToolHub:
- We specialize in curating the best tools for fullstack developers
- Our platform focuses on React, Node.js, TypeScript, and modern web development
- We feature development tools, online courses, cloud services, and productivity enhancers
- Our blog covers comprehensive guides for fullstack development
- We analyze developer tools and provide honest, expert recommendations

Current Available Tools & Services: ${context || "VS Code Extensions Bundle, React + Node.js Course Bundle, Digital Ocean Droplet Credits, MongoDB Atlas Pro Plan, Figma to React Component Tool, TypeScript Mastery Course"}

Website Features:
- Curated developer tool recommendations with expert reviews
- Comprehensive blog with fullstack development guides and tutorials
- Developer testimonials and real-world usage experiences
- Newsletter with latest development tools and resources
- AI-powered assistance for choosing the right tools

Guidelines:
- Be knowledgeable about fullstack development technologies and best practices
- Ask about project requirements, skill level, and technology stack preferences
- Reference specific tools from our catalog when relevant
- Suggest relevant blog posts for detailed development guides
- Provide practical advice for development workflows and tool integration
- Keep responses technical but accessible, suitable for developers
- Mention value for money and long-term learning benefits
- Always be transparent about affiliate relationships`;

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
