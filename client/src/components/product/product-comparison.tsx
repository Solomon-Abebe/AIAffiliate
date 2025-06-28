import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface ComparisonProduct {
  name: string;
  price: string;
  image: string;
  processor: string;
  ram: string;
  storage: string;
  battery: string;
  rating: number;
}

const comparisonProducts: ComparisonProduct[] = [
  {
    name: "Premium Laptop",
    price: "1299",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=80",
    processor: "Intel i7 12th Gen",
    ram: "16GB DDR4",
    storage: "512GB SSD",
    battery: "12 hours",
    rating: 4.8,
  },
  {
    name: "Budget Option",
    price: "699",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=80",
    processor: "Intel i5 11th Gen",
    ram: "8GB DDR4",
    storage: "256GB SSD",
    battery: "8 hours",
    rating: 4.2,
  },
  {
    name: "Gaming Beast",
    price: "1899",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=80",
    processor: "Intel i9 12th Gen",
    ram: "32GB DDR5",
    storage: "1TB SSD",
    battery: "6 hours",
    rating: 4.9,
  },
];

export function ProductComparison() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Product Comparisons
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI analyzes thousands of data points to help you make informed decisions with side-by-side comparisons.
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-6 px-6 font-semibold text-gray-900">Features</th>
                    {comparisonProducts.map((product) => (
                      <th key={product.name} className="text-center py-6 px-6 min-w-[200px]">
                        <div className="flex flex-col items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-12 object-cover rounded-lg mb-2"
                          />
                          <div className="font-semibold text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-600">{formatPrice(product.price)}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium text-gray-900">Processor</td>
                    {comparisonProducts.map((product) => (
                      <td key={`${product.name}-processor`} className="py-4 px-6 text-center">
                        {product.processor}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">RAM</td>
                    {comparisonProducts.map((product) => (
                      <td key={`${product.name}-ram`} className="py-4 px-6 text-center">
                        {product.ram}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium text-gray-900">Storage</td>
                    {comparisonProducts.map((product) => (
                      <td key={`${product.name}-storage`} className="py-4 px-6 text-center">
                        {product.storage}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">Battery Life</td>
                    {comparisonProducts.map((product, index) => (
                      <td key={`${product.name}-battery`} className="py-4 px-6 text-center">
                        <span className={index === 0 ? "text-secondary font-medium" : ""}>
                          {product.battery}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900">AI Rating</td>
                    {comparisonProducts.map((product) => (
                      <td key={`${product.name}-rating`} className="py-4 px-6 text-center">
                        <div className="flex justify-center items-center space-x-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-sm">
                                {i < Math.floor(product.rating) ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
