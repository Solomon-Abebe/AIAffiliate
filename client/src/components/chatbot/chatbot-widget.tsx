import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, X, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { generateSessionId } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  message: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chatbot is first opened
      setMessages([
        {
          id: "welcome",
          message: "👋 Hi! I'm your AI shopping assistant. I can help you find products, compare options, and answer questions. What are you looking for today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        sessionId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        message: data.message,
        sender: "ai",
        timestamp: new Date(),
      }]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim() || chatMutation.isPending) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Add user message to chat
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      message: userMessage,
      sender: "user",
      timestamp: new Date(),
    }]);

    // Send to AI
    chatMutation.mutate(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    const actions = {
      laptops: "I'm looking for the best laptops",
      headphones: "Show me top-rated headphones",
      fitness: "I need fitness equipment recommendations"
    };
    
    if (actions[action as keyof typeof actions]) {
      setInputValue(actions[action as keyof typeof actions]);
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 relative"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        {!isOpen && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-secondary rounded-full animate-pulse" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="absolute bottom-20 right-0 w-96 h-96 shadow-2xl border-0 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold">AI Assistant</div>
                <div className="text-xs text-blue-200">Online • Powered by GPT</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 h-72 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3">
                {msg.sender === "ai" ? (
                  <>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl p-3 max-w-xs">
                        <p className="text-sm text-gray-800">{msg.message}</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 flex justify-end">
                      <div className="bg-primary text-white rounded-2xl p-3 max-w-xs">
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Quick Actions (only show when no messages except welcome) */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 px-11">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("laptops")}
                  className="text-xs"
                >
                  💻 Best Laptops
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("headphones")}
                  className="text-xs"
                >
                  🎧 Headphones
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction("fitness")}
                  className="text-xs"
                >
                  🏃 Fitness Gear
                </Button>
              </div>
            )}

            {chatMutation.isPending && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about products..."
                className="flex-1 text-sm"
                disabled={chatMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || chatMutation.isPending}
                size="icon"
                className="w-10 h-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
