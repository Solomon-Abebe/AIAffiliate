import { Shield, Bot, Heart, Users, Target, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About DevToolHub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're the premier platform for fullstack developers, curating the best tools, courses, and services for React, Node.js, and modern web development.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We're passionate about helping fullstack developers discover the best tools and resources for their projects. Our AI-powered platform analyzes development tools, courses, and services to provide honest, expert recommendations.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                As a specialized affiliate platform for developers, we earn commissions from qualifying purchases at no extra cost to you. This allows us to provide our curation services for free while maintaining editorial independence focused on quality developer tools.
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

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything we do is guided by these core principles that ensure we serve our customers' best interests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600">
                We clearly disclose all affiliate relationships and maintain full transparency about how our platform works and how we earn revenue.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                We leverage cutting-edge AI technology to provide the most accurate, personalized, and helpful product recommendations possible.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer First</h3>
              <p className="text-gray-600">
                Every recommendation we make is in our customers' best interest, not influenced by commission rates or partnerships.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600">
                We build a community of informed consumers who help each other make better purchasing decisions through shared experiences.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Accuracy</h3>
              <p className="text-gray-600">
                Our AI analyzes vast amounts of data to ensure our recommendations are accurate, relevant, and truly helpful for each user's needs.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality</h3>
              <p className="text-gray-600">
                We maintain the highest standards in our reviews, recommendations, and customer service to ensure exceptional user experience.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 border-l-4 border-l-accent">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Affiliate Disclosure
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                AffiliatePro participates in various affiliate marketing programs, which means we may receive commissions on purchases made through our links to retailer sites. This comes at no additional cost to you.
              </p>
              <p>
                Our primary goal is to provide honest, unbiased product recommendations that genuinely help our users make informed purchasing decisions. We only recommend products that we believe offer real value, regardless of commission rates.
              </p>
              <p>
                All affiliate relationships are clearly disclosed, and our editorial content remains independent of our affiliate partnerships. We are committed to transparency and maintaining your trust.
              </p>
              <p className="font-semibold text-gray-900">
                Thank you for supporting our platform through your purchases, which allows us to continue providing free, high-quality content and AI-powered recommendations.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
