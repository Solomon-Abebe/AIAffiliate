import { ExternalLink, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount, formatRating } from "@/lib/utils";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  const rating = formatRating(product.rating);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-secondary text-white">
            {discount}% OFF
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm">{product.category}</p>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(rating) ? "★" : "☆"}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-600 ml-1">{rating}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-sm">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <Button asChild className="flex-1">
            <a 
              href={product.affiliateUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Deal
            </a>
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
