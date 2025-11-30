import { RequestHandler } from "express";
import { CreditScoreResult, ChatMessage } from "@shared/api";
import {
  buildCreditScoreContext,
  getCreditScoreChatbotSystemPrompt,
  validateUserMessage,
  formatChatHistory,
  ChatResponse,
} from "@shared/chatbot";

// Mock Gemini API response (for development)
// In production, replace with actual Google Generative AI SDK
function getMockGeminiResponse(message: string): ChatResponse {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("tax") || lowerMessage.includes("debt")) {
    return {
      message:
        "Tax debt is a critical factor in your credit assessment. Outstanding tax obligations signal to lenders that you may have compliance or cash flow issues. To improve your score, I recommend: 1) Setting up a payment plan with tax authorities, 2) Allocating budget specifically for resolving tax debt, 3) Ensuring future filings are on time. Many lenders will work with you if you show commitment to resolving tax issues.",
      reasoning: "Addressed tax debt concerns directly with actionable steps",
      suggestions: [
        "How long does it take to improve credit after paying taxes?",
        "Are there lenders that accept businesses with tax debt?",
      ],
    };
  }

  if (lowerMessage.includes("payment") || lowerMessage.includes("history")) {
    return {
      message:
        "Your payment history shows how reliably you meet financial obligations. A lower payment history percentage indicates missed or late payments, which concerns lenders. To improve: 1) Set up automatic payments for critical obligations, 2) Prioritize vendor and loan payments, 3) Negotiate extended terms if needed, 4) Consider hiring a bookkeeper to track payments. Building a 6-month track record of on-time payments will noticeably boost your score.",
      reasoning: "Provided practical steps to improve payment reliability",
      suggestions: [
        "How long to see improvement in payment history?",
        "What payment tools can help me?",
      ],
    };
  }

  if (lowerMessage.includes("debt ratio") || lowerMessage.includes("debt")) {
    return {
      message:
        "Your debt ratio compares total debt to annual revenue. A high ratio indicates you're heavily leveraged, which increases lender risk. Strategies to improve: 1) Focus on revenue growth through sales/marketing, 2) Pay down existing debt with cash flow, 3) Avoid taking new debt until ratio improves, 4) Consider debt consolidation at better rates. Even a 10-20% improvement in revenue can significantly help your ratio.",
      reasoning: "Explained debt ratio impact with improvement strategies",
      suggestions: [
        "How much should my debt ratio be?",
        "What's the quickest way to lower debt?",
      ],
    };
  }

  if (lowerMessage.includes("young") || lowerMessage.includes("age")) {
    return {
      message:
        "Company age matters because newer businesses have limited track records. While you can't change your founding date, you can strengthen other areas: 1) Build solid financial records from day one, 2) Demonstrate consistent revenue and growth, 3) Maintain clean tax and payment history, 4) Look for lenders specializing in new businesses. Many modern lenders now focus on recent companies and may have better terms than traditional banks.",
      reasoning: "Addressed age concerns with alternative strategies",
      suggestions: [
        "Are there loans for new businesses like mine?",
        "How do I demonstrate reliability as a young company?",
      ],
    };
  }

  return {
    message:
      "That's a great question about your credit profile. Based on your breakdown, the key areas to focus on are your tax debt, payment history, and debt ratio. Each of these has a direct impact on how lenders view your business. Would you like me to dive deeper into any specific area? I can provide targeted advice to help you improve your score.",
    reasoning: "Provided general credit improvement guidance",
    suggestions: [
      "What's the most important factor to improve?",
      "How long does score improvement take?",
    ],
  };
}

// Rate limiting tracker (simple in-memory, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientId);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }

  if (entry.count >= 30) {
    // 30 requests per minute
    return false;
  }

  entry.count++;
  return true;
}

/**
 * POST /api/chat/analyze-credit-score
 * Analyze credit score using Gemini AI and provide credit score insights
 */
export const handleAnalyzeCreditScore: RequestHandler = async (req, res) => {
  try {
    const { creditScore, message, chatHistory } = req.body as {
      creditScore?: CreditScoreResult;
      message: string;
      chatHistory?: ChatMessage[];
    };

    // Validate input
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const validation = validateUserMessage(message);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    // Rate limiting
    const clientId = req.ip || "unknown";
    if (!checkRateLimit(clientId)) {
      res
        .status(429)
        .json({ error: "Too many requests. Please try again later." });
      return;
    }

    // Require credit score on first message
    if (!chatHistory || chatHistory.length === 0) {
      if (!creditScore) {
        res
          .status(400)
          .json({ error: "Credit score required for initial message" });
        return;
      }
    }

    // For now, use mock response
    // In production, integrate with Google Generative AI SDK:
    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    // const chat = model.startChat({ history: formatChatHistory(chatHistory || []) });
    // const result = await chat.sendMessage(message);

    const mockResponse = getMockGeminiResponse(message);

    res.json({
      message: mockResponse.message,
      suggestions: mockResponse.suggestions || [],
      reasoning: mockResponse.reasoning,
    } as ChatResponse);
  } catch (error) {
    console.error("Error analyzing credit score:", error);
    res.status(500).json({
      error: "Failed to analyze credit score",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
