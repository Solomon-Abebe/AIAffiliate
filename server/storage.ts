import { products, testimonials, newsletters, contacts, chatMessages, blogPosts, type Product, type InsertProduct, type Testimonial, type InsertTestimonial, type Newsletter, type InsertNewsletter, type Contact, type InsertContact, type ChatMessage, type InsertChatMessage, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  
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
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
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
    const result = await db.select().from(products).where(eq(products.isActive, true)).limit(6);
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
        title: "Best Tech Products of 2024: AI-Powered Review",
        slug: "best-tech-products-2024-ai-review",
        excerpt: "Our AI analyzed thousands of products to bring you the top tech picks for 2024, from smartphones to smart home devices.",
        content: "Technology continues to evolve at breakneck speed in 2024...",
        category: "Technology",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tags: ["tech", "ai", "review", "2024"],
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
}

export const storage = new DatabaseStorage();
