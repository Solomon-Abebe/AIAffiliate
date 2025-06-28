import { Mail, Bot, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600">
            Have questions? Need help finding the perfect product? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-gray-600">support@affiliatepro.com</p>
                  <p className="text-sm text-gray-500">We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Chat Support</h3>
                  <p className="text-gray-600">Available 24/7 for instant help</p>
                  <p className="text-sm text-gray-500">Click the chat widget to start</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
                  <p className="text-gray-600">1-800-AFFILIATE</p>
                  <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
