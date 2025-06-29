import { useQuery } from "@tanstack/react-query";
import { Package, FileText, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "./admin-layout";
import type { Product, BlogPost, Testimonial } from "@shared/schema";

export default function AdminDashboard() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: testimonials } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const stats = [
    {
      title: "Total Products",
      value: products?.length || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Blog Posts",
      value: blogPosts?.length || 0,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Testimonials",
      value: testimonials?.length || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Published Posts",
      value: blogPosts?.filter(post => post.isPublished).length || 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to your admin dashboard. Here's an overview of your content.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products?.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${product.price}
                    </div>
                  </div>
                ))}
                {(!products || products.length === 0) && (
                  <p className="text-gray-500 text-sm">No products found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Blog Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blogPosts?.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-start space-x-4">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </p>
                      <p className="text-sm text-gray-500">{post.category}</p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            post.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!blogPosts || blogPosts.length === 0) && (
                  <p className="text-gray-500 text-sm">No blog posts found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}