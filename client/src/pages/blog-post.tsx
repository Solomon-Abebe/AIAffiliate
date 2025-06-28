import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: blogPost, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-3/4" />
            <div className="h-64 bg-gray-200 rounded mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Badge className="mb-4 bg-primary text-white">
            {blogPost.category}
          </Badge>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {blogPost.title}
          </h1>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">
              {new Date(blogPost.createdAt!).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <User className="h-4 w-4 mr-1" />
            <span>DevToolHub Team</span>
          </div>

          <p className="text-xl text-gray-600 leading-relaxed">
            {blogPost.excerpt}
          </p>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={blogPost.imageUrl}
            alt={blogPost.title}
            className="w-full h-64 lg:h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              {(blogPost.content || '').split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <p key={index} className="font-semibold text-gray-900 mb-4">
                      {paragraph.replace(/\*\*/g, '')}
                    </p>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  const listItems = paragraph.split('\n').filter(item => item.startsWith('- '));
                  return (
                    <ul key={index} className="list-disc list-inside mb-4 space-y-2">
                      {listItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">
                          {item.replace('- ', '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.match(/^\d+\./)) {
                  const listItems = paragraph.split('\n').filter(item => item.match(/^\d+\./));
                  return (
                    <ol key={index} className="list-decimal list-inside mb-4 space-y-2">
                      {listItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">
                          {item.replace(/^\d+\.\s*/, '')}
                        </li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blogPost.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-primary text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Looking for Product Recommendations?
            </h3>
            <p className="text-blue-100 mb-6">
              Our AI chatbot can help you find the perfect products based on your specific needs and budget.
            </p>
            <Button variant="secondary" size="lg">
              Start Chat with AI Assistant
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}