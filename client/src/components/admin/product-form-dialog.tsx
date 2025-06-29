import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product, Category } from "@shared/schema";

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  originalPrice: z.string().optional().transform(val => val === "" ? undefined : val),
  rating: z.string().min(1, "Rating is required"),
  imageUrl: z.string().min(1, "Image URL is required").refine(
    (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Must be a valid URL" }
  ),
  affiliateUrl: z.string().min(1, "Affiliate URL is required").refine(
    (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Must be a valid URL" }
  ),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

const defaultCategories = [
  "Development Tools",
  "Code Editors",
  "Cloud Services",
  "Courses",
  "Libraries",
  "Frameworks",
  "Databases",
  "DevOps",
  "Testing",
  "Design Tools",
];

export function ProductFormDialog({ open, onClose, product }: ProductFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  // Fetch existing categories
  const { data: categoriesData = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: open,
  });

  // Combine default and fetched categories, removing duplicates
  const allCategories = [
    ...defaultCategories,
    ...categoriesData.map(cat => cat.name).filter(name => !defaultCategories.includes(name))
  ];

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      originalPrice: "",
      rating: "5.0",
      imageUrl: "",
      affiliateUrl: "",
      isActive: true,
      isFeatured: false,
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryName: string) => {
      const response = await apiRequest("POST", "/api/categories", { name: categoryName });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await apiRequest("POST", "/api/products", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      if (!product) throw new Error("No product to update");
      const response = await apiRequest("PUT", `/api/products/${product.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (product) {
      // Check if the product category is in the predefined list
      const isCustomCategory = !defaultCategories.includes(product.category);
      if (isCustomCategory) {
        setShowCustomCategory(true);
        setCustomCategory(product.category);
      } else {
        setShowCustomCategory(false);
        setCustomCategory("");
      }

      form.reset({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice || "",
        rating: product.rating,
        imageUrl: product.imageUrl,
        affiliateUrl: product.affiliateUrl,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      });
    } else {
      setShowCustomCategory(false);
      setCustomCategory("");
      form.reset({
        name: "",
        description: "",
        category: "",
        price: "",
        originalPrice: "",
        rating: "5.0",
        imageUrl: "",
        affiliateUrl: "",
        isActive: true,
        isFeatured: false,
      });
    }
  }, [product, form]);

  const onSubmit = async (data: ProductFormData) => {
    // Validate custom category if it's being used
    if (showCustomCategory && !customCategory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a custom category name",
        variant: "destructive",
      });
      return;
    }

    let categoryName = data.category;
    
    // Create custom category first if needed
    if (showCustomCategory && customCategory.trim()) {
      try {
        await createCategoryMutation.mutateAsync(customCategory.trim());
        categoryName = customCategory.trim();
      } catch (error) {
        // Category might already exist, continue with the name
        categoryName = customCategory.trim();
      }
    }

    // Use custom category if it's being used
    const finalData = {
      ...data,
      category: categoryName
    };

    if (product) {
      updateProductMutation.mutate(finalData);
    } else {
      createProductMutation.mutate(finalData);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setShowCustomCategory(true);
      form.setValue("category", "");
    } else {
      setShowCustomCategory(false);
      setCustomCategory("");
      form.setValue("category", value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Visual Studio Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    {!showCustomCategory ? (
                      <Select onValueChange={handleCategoryChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">
                            + Add Custom Category
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="space-y-2">
                        <Input
                          placeholder="Enter custom category"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowCustomCategory(false);
                            setCustomCategory("");
                            form.setValue("category", "");
                          }}
                        >
                          Use Predefined Categories
                        </Button>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the product and its key features..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="29.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="39.99 (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1-5)</FormLabel>
                    <FormControl>
                      <Input placeholder="4.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="affiliateUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affiliate URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-6">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
              >
                {product ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}