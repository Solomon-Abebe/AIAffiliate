import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@shared/schema";

export default function Products() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our complete collection of AI-reviewed products with detailed comparisons and honest recommendations.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && (!products || products.length === 0) && (
          <div className="text-center py-20">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Check back soon for new product reviews!</p>
          </div>
        )}
      </div>
    </div>
  );
}
