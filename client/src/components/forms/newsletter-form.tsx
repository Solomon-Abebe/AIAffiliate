import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscriptionMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/newsletter/subscribe", { email });
      return response.json();
    },
    onSuccess: () => {
      setEmail("");
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter. Check your email for confirmation.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Please try again with a valid email address.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    subscriptionMutation.mutate(email);
  };

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Stay Updated with AI-Powered Deals
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Get personalized product recommendations and exclusive deals delivered to your inbox weekly.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white border-0 focus:ring-4 focus:ring-blue-300"
            required
            disabled={subscriptionMutation.isPending}
          />
          <Button
            type="submit"
            className="bg-secondary text-white hover:bg-green-600 px-8 font-semibold whitespace-nowrap"
            disabled={subscriptionMutation.isPending}
          >
            {subscriptionMutation.isPending ? "Subscribing..." : (
              <>
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        
        <p className="text-sm text-blue-200 mt-4">
          No spam, unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
