import { products, testimonials, newsletters, contacts, chatMessages, blogPosts, type Product, type InsertProduct, type Testimonial, type InsertTestimonial, type Newsletter, type InsertNewsletter, type Contact, type InsertContact, type ChatMessage, type InsertChatMessage, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getActiveTestimonials(): Promise<Testimonial[]>;
  
  // Newsletter
  subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  
  // Contact
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Chat
  saveChatMessage(chatMessage: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(sessionId: string): Promise<ChatMessage[]>;
  
  // Blog
  getBlogPosts(): Promise<BlogPost[]>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const result = await db.select().from(products).where(eq(products.isFeatured, true)).limit(6);
    return result;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const result = await db.select().from(products).where(eq(products.isActive, true));
    return result.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db.update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getActiveTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.isActive, true));
  }

  async subscribeNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const [newsletter] = await db.insert(newsletters).values(insertNewsletter).returning();
    return newsletter;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async saveChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db.insert(chatMessages).values(insertChatMessage).returning();
    return chatMessage;
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.category, category));
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const [blogPost] = await db.insert(blogPosts).values(insertBlogPost).returning();
    return blogPost;
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [blogPost] = await db.update(blogPosts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return blogPost || undefined;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private testimonials: Map<number, Testimonial>;
  private newsletters: Map<number, Newsletter>;
  private contacts: Map<number, Contact>;
  private chatMessages: Map<number, ChatMessage>;
  private blogPosts: Map<number, BlogPost>;
  private currentProductId: number;
  private currentTestimonialId: number;
  private currentNewsletterId: number;
  private currentContactId: number;
  private currentChatId: number;
  private currentBlogId: number;

  constructor() {
    this.products = new Map();
    this.testimonials = new Map();
    this.newsletters = new Map();
    this.contacts = new Map();
    this.chatMessages = new Map();
    this.blogPosts = new Map();
    this.currentProductId = 1;
    this.currentTestimonialId = 1;
    this.currentNewsletterId = 1;
    this.currentContactId = 1;
    this.currentChatId = 1;
    this.currentBlogId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Sample products
    const sampleProducts: Product[] = [
      {
        id: this.currentProductId++,
        name: "Premium Wireless Headphones",
        description: "Industry-leading noise cancellation with premium sound quality and 30-hour battery life.",
        category: "Audio & Electronics",
        price: "299.00",
        originalPrice: "399.00",
        rating: "4.8",
        imageUrl: "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        affiliateUrl: "#",
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Smart Fitness Tracker",
        description: "Advanced health monitoring with GPS tracking, heart rate monitoring, and 7-day battery life.",
        category: "Health & Fitness",
        price: "199.00",
        originalPrice: "249.00",
        rating: "4.6",
        imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        affiliateUrl: "#",
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Smart Home Hub",
        description: "Complete home automation control with voice commands, app integration, and energy monitoring.",
        category: "Smart Home",
        price: "149.00",
        originalPrice: "199.00",
        rating: "4.9",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        affiliateUrl: "#",
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
      },
    ];

    // Sample testimonials
    const sampleTestimonials: Testimonial[] = [
      {
        id: this.currentTestimonialId++,
        name: "Sarah M.",
        title: "Software Engineer",
        content: "The AI chatbot helped me find the perfect laptop for my needs. Saved me hours of research and got exactly what I wanted within my budget!",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b172?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
        isActive: true,
      },
      {
        id: this.currentTestimonialId++,
        name: "Mike R.",
        title: "Fitness Enthusiast",
        content: "Amazing product comparisons! The detailed analysis helped me understand which fitness tracker was best for my workout routine.",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
        isActive: true,
      },
      {
        id: this.currentTestimonialId++,
        name: "Jennifer L.",
        title: "Marketing Manager",
        content: "Trust this site completely! Their reviews are honest, detailed, and the AI recommendations are spot on. Highly recommended!",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
        isActive: true,
      },
    ];

    // Sample blog posts
    const sampleBlogPosts: BlogPost[] = [
      {
        id: this.currentBlogId++,
        title: "Best Developer Tools and Resources for 2024",
        slug: "best-developer-tools-resources-2024",
        excerpt: "Discover the essential tools every fullstack developer needs in 2024, from code editors to deployment platforms.",
        content: `## Essential Development Tools

Modern fullstack development requires the right set of tools to be productive and efficient. Here are the must-have tools and resources for developers in 2024.

### Code Editors and IDEs

**VS Code** remains the most popular choice among developers, offering excellent support for React, Node.js, and TypeScript development. With its extensive marketplace and built-in terminal, VS Code provides everything you need for modern web development.

For those working with larger codebases, Visual Studio Code extensions like GitLens and Prettier can significantly improve your workflow.

### Version Control and Collaboration

**GitHub** is the industry standard for version control and collaboration. Whether you're working on open-source projects or private repositories, GitHub's features like pull requests, actions, and project management tools are essential.

### Frontend Development

**React** continues to dominate the frontend landscape, with **Next.js** being the preferred framework for production applications. TypeScript has become essential for large-scale applications, providing better code quality and developer experience.

Popular UI libraries include:
- Tailwind CSS for utility-first styling
- Material-UI for component libraries
- Styled Components for CSS-in-JS

### Backend Development

**Node.js** remains the go-to choice for JavaScript developers building backend services. Express.js provides a minimalist framework, while NestJS offers a more structured approach similar to Angular.

Database options include:
- MongoDB for document-based storage
- PostgreSQL for relational data
- Redis for caching and sessions

### Cloud and Deployment

**AWS** leads the cloud platform space, but newer platforms like **Vercel** and **Netlify** have made deployment incredibly simple for frontend applications.

For containerization, **Docker** has become essential for consistent development and deployment environments.

### Design and Prototyping

**Figma** has revolutionized the design-to-development workflow, making it easier for developers to collaborate with designers and implement pixel-perfect interfaces.

### API Development and Testing

**Postman** remains the top choice for API development and testing, with features for documentation, monitoring, and team collaboration.

### Learning Resources

For continuous learning, platforms like **Udemy**, **Coursera**, and **Pluralsight** offer comprehensive courses on the latest technologies and best practices.

### Marketing and Business Tools

For developers building client projects or their own SaaS applications, having the right marketing tools is crucial. **GoHighLevel** provides a comprehensive marketing automation platform that can help developers and agencies manage client relationships, automate workflows, and scale their businesses effectively.

👉 Try GoHighLevel today with a free trial and see how it transforms your marketing.

## Getting Started

1. Set up your development environment with VS Code
2. Learn the fundamentals of React and Node.js
3. Master TypeScript for better code quality
4. Deploy your first project to Vercel or Netlify
5. Start building your portfolio with GitHub

The developer ecosystem continues to evolve rapidly. Stay updated with the latest trends and tools to remain competitive in the field.`,
        category: "Development",
        imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        affiliateUrl: "https://www.gohighlevel.com/?utm_source=devtoolhub&utm_medium=affiliate",
        tags: ["development", "tools", "2024", "fullstack"],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentBlogId++,
        title: "How to Choose the Perfect Headphones: Complete Guide",
        slug: "how-to-choose-perfect-headphones-guide",
        excerpt: "From noise cancellation to sound quality, our comprehensive guide helps you find the ideal headphones for your needs.",
        content: "Choosing the right headphones can make all the difference...",
        category: "Audio",
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        affiliateUrl: null,
        tags: ["headphones", "audio", "guide", "buying"],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentBlogId++,
        title: "Smart Home Automation: Getting Started",
        slug: "smart-home-automation-getting-started",
        excerpt: "Transform your home into a smart home with our beginner-friendly guide to automation and connected devices.",
        content: "Smart home technology has become more accessible than ever...",
        category: "Smart Home",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        affiliateUrl: null,
        tags: ["smart home", "automation", "iot", "guide"],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => this.products.set(product.id, product));
    sampleTestimonials.forEach(testimonial => this.testimonials.set(testimonial.id, testimonial));
    sampleBlogPosts.forEach(post => this.blogPosts.set(post.id, post));
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive).slice(0, 6);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const allProducts = Array.from(this.products.values()).filter(p => p.isActive);
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      id,
      name: insertProduct.name,
      description: insertProduct.description,
      category: insertProduct.category,
      price: insertProduct.price,
      originalPrice: insertProduct.originalPrice || null,
      rating: insertProduct.rating || "5.0",
      imageUrl: insertProduct.imageUrl,
      affiliateUrl: insertProduct.affiliateUrl,
      isActive: insertProduct.isActive !== undefined ? insertProduct.isActive : true,
      isFeatured: insertProduct.isFeatured !== undefined ? insertProduct.isFeatured : false,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...updateData,
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getActiveTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(t => t.isActive);
  }

  async subscribeNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const id = this.currentNewsletterId++;
    const newsletter: Newsletter = {
      ...insertNewsletter,
      id,
      subscribedAt: new Date(),
      isActive: true,
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async saveChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatId++;
    const chatMessage: ChatMessage = {
      ...insertChatMessage,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(p => p.isPublished);
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(p => p.slug === slug);
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(p => p.category === category && p.isPublished);
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogId++;
    const blogPost: BlogPost = {
      id,
      title: insertBlogPost.title,
      slug: insertBlogPost.slug,
      excerpt: insertBlogPost.excerpt,
      content: insertBlogPost.content,
      category: insertBlogPost.category,
      imageUrl: insertBlogPost.imageUrl,
      affiliateUrl: insertBlogPost.affiliateUrl || null,
      tags: insertBlogPost.tags || [],
      isPublished: insertBlogPost.isPublished !== undefined ? insertBlogPost.isPublished : false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) return undefined;
    
    const updatedPost: BlogPost = {
      ...existingPost,
      ...updateData,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    this.blogPosts.delete(id);
  }
}

export const storage = new DatabaseStorage();
