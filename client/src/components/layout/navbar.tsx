import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { data: searchResults } = useQuery<Product[]>({
    queryKey: ["/api/products/search", { q: searchQuery }],
    enabled: searchQuery.length > 2,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.length > 2);
  };

  const handleSearchSelect = () => {
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/admin", label: "Admin" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Bot className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">DevToolHub</h1>
              </div>
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-primary"
                        : "text-gray-600 hover:text-primary"
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                className="w-64 pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs text-gray-500 mb-2 px-2">
                      Found {searchResults.length} products
                    </div>
                    {searchResults.slice(0, 5).map((product) => (
                      <Link key={product.id} href="/products">
                        <div 
                          className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={handleSearchSelect}
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.category} • ${product.price}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {searchResults.length > 5 && (
                      <Link href="/products">
                        <div 
                          className="text-center p-2 text-primary text-sm hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={handleSearchSelect}
                        >
                          View all {searchResults.length} results →
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <Button className="hidden md:inline-flex">
              Get Started
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <span 
                          className={`block px-3 py-2 text-base font-medium transition-colors ${
                            isActive(item.href)
                              ? "text-primary"
                              : "text-gray-600 hover:text-primary"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                  
                  <Button className="w-full">
                    Get Started
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
