import { Card, CardContent } from "@/components/ui/card";
import type { Testimonial } from "@shared/schema";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < testimonial.rating ? "★" : "☆"}>
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">{testimonial.rating}.0</span>
        </div>
        
        <p className="text-gray-700 mb-6 italic">
          "{testimonial.content}"
        </p>
        
        <div className="flex items-center">
          {testimonial.avatarUrl && (
            <img
              src={testimonial.avatarUrl}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
          )}
          <div>
            <div className="font-semibold text-gray-900">{testimonial.name}</div>
            <div className="text-sm text-gray-600">{testimonial.title}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
