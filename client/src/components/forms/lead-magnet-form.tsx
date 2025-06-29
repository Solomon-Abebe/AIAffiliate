import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Download, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const leadMagnetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type LeadMagnetFormData = z.infer<typeof leadMagnetSchema>;

interface LeadMagnetFormProps {
  variant?: "hero" | "inline";
}

export function LeadMagnetForm({ variant = "hero" }: LeadMagnetFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LeadMagnetFormData>({
    resolver: zodResolver(leadMagnetSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const { mutate: submitLeadMagnet, isPending } = useMutation({
    mutationFn: async (data: LeadMagnetFormData) => {
      // Subscribe to newsletter and trigger lead magnet delivery
      await apiRequest("POST", "/api/newsletter/subscribe", { email: data.email });
      
      // In a real app, you would also send the lead magnet email here
      // For now, we'll simulate the lead magnet delivery
      return data;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter"] });
      toast({
        title: "Success!",
        description: "Check your email for the Developer Tools Checklist download link.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LeadMagnetFormData) => {
    submitLeadMagnet(data);
  };

  if (isSubmitted) {
    return (
      <Card className={`${variant === "hero" ? "bg-white/90 backdrop-blur-sm border-green-200" : ""} transition-all duration-300`}>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Check Your Email!
          </h3>
          <p className="text-gray-600 mb-4">
            Your Ultimate Developer Tools Checklist is on its way to your inbox.
          </p>
          <p className="text-sm text-gray-500">
            Don't forget to check your spam folder if you don't see it within a few minutes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${variant === "hero" ? "bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl" : ""} transition-all duration-300 hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Free Developer Tools Checklist
          </h3>
          <p className="text-gray-600 text-sm">
            Get our curated list of 50+ essential tools every fullstack developer needs, organized by category with setup guides.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Your email address"
                      {...field}
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Get Free Checklist
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="flex items-center justify-center mt-4 space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Instant download</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>No spam</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Unsubscribe anytime</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}