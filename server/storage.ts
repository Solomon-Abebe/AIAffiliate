import { products, testimonials, newsletters, contacts, chatMessages, type Product, type InsertProduct, type Testimonial, type InsertTestimonial, type Newsletter, type InsertNewsletter, type Contact, type InsertContact, type ChatMessage, type InsertChatMessage } from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  
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
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private testimonials: Map<number, Testimonial>;
  private newsletters: Map<number, Newsletter>;
  private contacts: Map<number, Contact>;
  private chatMessages: Map<number, ChatMessage>;
  private currentProductId: number;
  private currentTestimonialId: number;
  private currentNewsletterId: number;
  private currentContactId: number;
  private currentChatId: number;

  constructor() {
    this.products = new Map();
    this.testimonials = new Map();
    this.newsletters = new Map();
    this.contacts = new Map();
    this.chatMessages = new Map();
    this.currentProductId = 1;
    this.currentTestimonialId = 1;
    this.currentNewsletterId = 1;
    this.currentContactId = 1;
    this.currentChatId = 1;
    
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

    sampleProducts.forEach(product => this.products.set(product.id, product));
    sampleTestimonials.forEach(testimonial => this.testimonials.set(testimonial.id, testimonial));
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
}

export const storage = new MemStorage();
