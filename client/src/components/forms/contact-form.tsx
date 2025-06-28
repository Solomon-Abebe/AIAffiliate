import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you within 24 hours.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject || !formData.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full"
            required
            disabled={contactMutation.isPending}
          />
        </div>

        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full"
            required
            disabled={contactMutation.isPending}
          />
        </div>

        <div>
          <Label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </Label>
          <Select 
            value={formData.subject} 
            onValueChange={(value) => handleInputChange("subject", value)}
            disabled={contactMutation.isPending}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product-inquiry">Product Inquiry</SelectItem>
              <SelectItem value="ai-support">AI Chatbot Support</SelectItem>
              <SelectItem value="partnership">Partnership Opportunity</SelectItem>
              <SelectItem value="feedback">General Feedback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </Label>
          <Textarea
            id="message"
            rows={6}
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            className="w-full"
            required
            disabled={contactMutation.isPending}
          />
        </div>

        <Button
          type="submit"
          className="w-full py-4 font-semibold"
          disabled={contactMutation.isPending}
        >
          {contactMutation.isPending ? "Sending..." : (
            <>
              Send Message <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
