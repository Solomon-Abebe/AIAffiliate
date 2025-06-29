import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";
import Home from "@/pages/home";
import Products from "@/pages/products";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import ProductsAdmin from "@/pages/admin/products-admin";
import BlogAdmin from "@/pages/admin/blog-admin";
import UsersAdmin from "@/pages/admin/users-admin";
import SettingsAdmin from "@/pages/admin/settings-admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/products" component={ProductsAdmin} />
          <Route path="/admin/blog" component={BlogAdmin} />
          <Route path="/admin/users" component={UsersAdmin} />
          <Route path="/admin/settings" component={SettingsAdmin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
