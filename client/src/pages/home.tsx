import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Rocket, Play, CheckCircle, Users, Bot, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductCard } from "@/components/product/product-card";
import { ProductComparison } from "@/components/product/product-comparison";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import type { Product, Testimonial } from "@shared/schema";

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 text-sm text-primary font-medium mb-4">
                <Bot className="h-4 w-4" />
                <span>AI-Powered for Developers</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Essential Tools for{" "}
                <span className="text-primary">Fullstack Developers</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover the best development tools, courses, and services curated specifically for React, Node.js, and modern fullstack development. Our AI assistant helps you choose the right tools for your projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/products">
                  <span>
                    <Button size="lg" className="text-lg w-full sm:w-auto">
                      <Rocket className="mr-2 h-5 w-5" />
                      Start Exploring
                    </Button>
                  </span>
                </Link>
                <Button variant="outline" size="lg" className="text-lg" onClick={() => {
                  // Scroll to product comparison section
                  const comparisonSection = document.querySelector('.product-comparison-section');
                  if (comparisonSection) {
                    comparisonSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}>
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span>500+ Developer Tools Reviewed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-secondary" />
                  <span>10,000+ Developers Served</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="AI-powered analytics dashboard"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <Card className="absolute -bottom-6 -left-6 p-4 shadow-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">AI Assistant Online</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-gray-600">Dev Tools Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">10K+</div>
              <div className="text-sm text-gray-600">Developers Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-gray-600">AI Assistant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Developer Tools & Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover essential tools, courses, and services for React, Node.js, and fullstack development. Curated and tested by experienced developers.
            </p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded mb-4" />
                    <div className="h-3 bg-gray-200 rounded mb-4" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Button size="lg">
              View All Products <span className="ml-2">→</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Comparison */}
      <div className="product-comparison-section">
        <ProductComparison />
      </div>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real reviews from real customers who found their perfect products through our AI-powered recommendations.
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-4 bg-gray-200 rounded mb-4" />
                    <div className="h-16 bg-gray-200 rounded mb-6" />
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mr-4" />
                      <div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-24" />
                        <div className="h-3 bg-gray-200 rounded w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials?.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                About AffiliatePro
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We're passionate about helping consumers make informed purchasing decisions. Our AI-powered platform analyzes thousands of products, reviews, and data points to provide honest, unbiased recommendations.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                As an affiliate marketing platform, we earn commissions from qualifying purchases at no extra cost to you. This allows us to provide our services for free while maintaining editorial independence.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700">Transparent affiliate disclosures</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700">AI-powered unbiased analysis</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700">Customer satisfaction guaranteed</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Team collaborating on AI technology"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <Card className="absolute -top-6 -right-6 p-6 shadow-lg border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">98%</div>
                  <div className="text-sm text-gray-600">Customer Trust</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our AI-powered recommendations and affiliate partnerships.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-xl px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
                How does your AI recommendation system work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Our AI analyzes product specifications, user reviews, price trends, and market data to provide personalized recommendations based on your specific needs and preferences.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-xl px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
                Do you earn commissions from product sales?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Yes, we earn affiliate commissions from qualifying purchases at no extra cost to you. This allows us to provide our services for free while maintaining editorial independence in our recommendations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-xl px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
                How can I trust your product reviews?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Our AI system analyzes thousands of verified customer reviews and product data to provide unbiased assessments. We clearly disclose all affiliate relationships and maintain editorial independence.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-xl px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
                Is the AI chatbot available 24/7?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Yes! Our AI chatbot is available around the clock to help you find products, answer questions, and provide personalized recommendations whenever you need them.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterForm />
    </div>
  );
}
