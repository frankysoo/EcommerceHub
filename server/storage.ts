import session from "express-session";
import createMemoryStore from "memorystore";
import {
  User, InsertUser,
  Category, InsertCategory,
  Product, InsertProduct,
  CartItem, InsertCartItem,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  OrderStatus
} from "./schema";

interface ProductWithCategory extends Product {
  category?: Category;
}

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProductsWithCategory(): Promise<ProductWithCategory[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductWithCategory(id: number): Promise<ProductWithCategory | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<ProductWithCategory[]>;
  getPopularProducts(limit?: number): Promise<ProductWithCategory[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Cart methods
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItemsWithProducts(userId: number): Promise<(CartItem & { product: Product })[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  getCartItemByUserAndProduct(userId: number, productId: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, cartItem: Partial<CartItem>): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Order methods
  getOrders(): Promise<Order[]>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // User session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;

  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private cartItemIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;

  public sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();

    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Seed data
    this.seedData();
  }

  // User methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    console.log(`Looking for user with username: ${username}`);
    const user = Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
    console.log(`User found: ${!!user}`);
    return user;
  }

  // Synchronous version for internal use
  private getUserByUsernameSync(username: string): User | undefined {
    console.log(`[Sync] Looking for user with username: ${username}`);
    const user = Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
    console.log(`[Sync] User found: ${!!user}`);
    return user;
  }

  async createUser(insertUser: InsertUser & { isAdmin?: boolean }): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = {
      ...insertUser,
      id,
      isAdmin: insertUser.isAdmin === true ? true : false,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      address: insertUser.address || null,
      city: insertUser.city || null,
      state: insertUser.state || null,
      zipCode: insertUser.zipCode || null,
      country: insertUser.country || null,
      phone: insertUser.phone || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category | undefined> {
    const category = await this.getCategory(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsWithCategory(): Promise<ProductWithCategory[]> {
    const products = await this.getProducts();
    const result: ProductWithCategory[] = [];

    for (const product of products) {
      const category = await this.getCategory(product.categoryId);
      if (category) {
        result.push({
          ...product,
          categoryName: category.name,
        });
      }
    }

    return result;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductWithCategory(id: number): Promise<ProductWithCategory | undefined> {
    const product = await this.getProduct(id);
    if (!product) return undefined;

    const category = await this.getCategory(product.categoryId);
    if (!category) return undefined;

    return {
      ...product,
      categoryName: category.name,
    };
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId,
    );
  }

  async getFeaturedProducts(limit?: number): Promise<ProductWithCategory[]> {
    const products = Array.from(this.products.values())
      .filter((product) => product.isFeatured)
      .slice(0, limit);

    const result: ProductWithCategory[] = [];

    for (const product of products) {
      const category = await this.getCategory(product.categoryId);
      if (category) {
        result.push({
          ...product,
          categoryName: category.name,
        });
      }
    }

    return result;
  }

  async getPopularProducts(limit?: number): Promise<ProductWithCategory[]> {
    const products = Array.from(this.products.values())
      .filter((product) => product.isPopular)
      .slice(0, limit);

    const result: ProductWithCategory[] = [];

    for (const product of products) {
      const category = await this.getCategory(product.categoryId);
      if (category) {
        result.push({
          ...product,
          categoryName: category.name,
        });
      }
    }

    return result;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = {
      ...product,
      id,
      createdAt: new Date(),
      rating: product.rating || 0,
      ratingCount: product.ratingCount || 0,
      isFeatured: product.isFeatured || false,
      isPopular: product.isPopular || false
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = await this.getProduct(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId,
    );
  }

  async getCartItemsWithProducts(userId: number): Promise<(CartItem & { product: Product })[]> {
    const cartItems = await this.getCartItems(userId);
    const result: (CartItem & { product: Product })[] = [];

    for (const item of cartItems) {
      const product = await this.getProduct(item.productId);
      if (product) {
        result.push({
          ...item,
          product,
        });
      }
    }

    return result;
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async getCartItemByUserAndProduct(userId: number, productId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      (item) => item.userId === userId && item.productId === productId,
    );
  }

  async createCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if the item already exists for this user and product
    const existingItem = await this.getCartItemByUserAndProduct(cartItem.userId, cartItem.productId);

    if (existingItem) {
      // Update quantity instead of creating a new item
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + (cartItem.quantity || 1)
      };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }

    // Create new cart item
    const id = this.cartItemIdCounter++;
    const newCartItem: CartItem = { ...cartItem, id };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItem(id: number, cartItemData: Partial<CartItem>): Promise<CartItem | undefined> {
    const cartItem = await this.getCartItem(id);
    if (!cartItem) return undefined;

    const updatedCartItem = { ...cartItem, ...cartItemData };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }

  async deleteCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const cartItems = await this.getCartItems(userId);

    for (const item of cartItems) {
      this.cartItems.delete(item.id);
    }

    return true;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderWithItems(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;

    const items = Array.from(this.orderItems.values())
      .filter((item) => item.orderId === id);

    const itemsWithProducts: (OrderItem & { product: Product })[] = [];

    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        itemsWithProducts.push({
          ...item,
          product,
        });
      }
    }

    return {
      ...order,
      items: itemsWithProducts,
    };
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.orderIdCounter++;
    const newOrder: Order = {
      ...order,
      id,
      createdAt: new Date()
    };
    this.orders.set(id, newOrder);

    // Create order items
    for (const item of items) {
      const orderItemId = this.orderItemIdCounter++;
      const newOrderItem: OrderItem = {
        ...item,
        id: orderItemId,
        orderId: id
      };
      this.orderItems.set(orderItemId, newOrderItem);
    }

    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Seed data for testing
  private seedData(): void {
    console.log("Starting seed data process...");

    // Create admin user with a simple password for testing
    // We're using a very simple hash for testing purposes
    const adminPassword = "admin123";

    // Simple hash format: password.salt
    // In a real app, you'd use a proper hashing function
    const passwordString = `${adminPassword}.simple_salt_for_testing`;

    // Reset counter to ensure admin user is created with ID 1
    this.userIdCounter = 1;

    // Check if admin user already exists
    const existingAdmin = this.getUserByUsernameSync("admin");
    if (existingAdmin) {
      console.log("Admin user already exists:", { ...existingAdmin, password: "[REDACTED]" });
    } else {
      // Create admin user
      const adminUser = this.createUser({
        username: "admin",
        password: passwordString,
        email: "admin@example.com",
        isAdmin: true,
        firstName: "Admin",
        lastName: "User"
      });

      console.log("Admin user created:", { ...adminUser, password: "[REDACTED]" });
    }

    // Seed categories
    const categories: InsertCategory[] = [
      {
        name: "Electronics",
        description: "Premium gadgets and devices",
        image: "https://images.unsplash.com/photo-1593344484962-796055d4a3a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Fashion",
        description: "Luxury apparel and accessories",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Home & Decor",
        description: "Elegant home furnishings",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Books",
        description: "Curated collection of literature",
        image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Jewelry",
        description: "Fine jewelry and timepieces",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Beauty",
        description: "Premium skincare and cosmetics",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Gourmet",
        description: "Artisanal foods and beverages",
        image: "https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Travel",
        description: "Luxury travel accessories",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      }
    ];

    categories.forEach(category => {
      this.createCategory(category);
    });

    // Seed products
    const products: InsertProduct[] = [
      // Electronics
      {
        name: "Bose QuietComfort Ultra Headphones",
        description: "Immersive sound with 40h battery life and spatial audio",
        price: 349.99,
        oldPrice: 429.99,
        discount: 18,
        categoryId: 1,
        stock: 50,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        ratingCount: 257,
        isFeatured: true,
        isPopular: true
      },
      {
        name: "MacBook Pro M3 Max",
        description: "48GB RAM, 2TB SSD, M3 Max Processor",
        price: 2899.99,
        oldPrice: 3299.99,
        discount: 12,
        categoryId: 1,
        stock: 25,
        image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 5,
        ratingCount: 189,
        isFeatured: true,
        isPopular: true
      },
      {
        name: "Apple Watch Ultra 2",
        description: "Titanium case, precision GPS, dive computer",
        price: 749.99,
        oldPrice: 799.99,
        discount: 6,
        categoryId: 1,
        stock: 45,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        ratingCount: 136,
        isFeatured: true,
        isPopular: true
      },
      {
        name: "Sony A7IV Mirrorless Camera",
        description: "33MP full-frame sensor, 4K60p video, 10-bit color depth",
        price: 2499.99,
        oldPrice: 2799.99,
        discount: 11,
        categoryId: 1,
        stock: 18,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        ratingCount: 94,
        isFeatured: true,
        isPopular: false
      },
      {
        name: "Samsung OLED 4K Smart TV",
        description: "65-inch, self-lit pixels, AI upscaling, gaming mode",
        price: 2199.99,
        oldPrice: 2599.99,
        discount: 15,
        categoryId: 1,
        stock: 22,
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        ratingCount: 162,
        isFeatured: false,
        isPopular: true
      },

      // Fashion
      {
        name: "Artisan Leather Weekender Bag",
        description: "Full-grain leather, handcrafted in Italy",
        price: 589.99,
        oldPrice: 749.99,
        discount: 21,
        categoryId: 2,
        stock: 30,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        ratingCount: 78,
        isFeatured: true,
        isPopular: false
      },
      {
        name: "Handcrafted Italian Loafers",
        description: "Premium calfskin with hand-stitched soles",
        price: 429.99,
        oldPrice: 549.99,
        discount: 22,
        categoryId: 2,
        stock: 35,
        image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        ratingCount: 109,
        isFeatured: true,
        isPopular: false
      },
      {
        name: "Merino Wool Cashmere Sweater",
        description: "Luxurious blend, sustainably sourced materials",
        price: 289.99,
        oldPrice: 349.99,
        discount: 17,
        categoryId: 2,
        stock: 42,
        image: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        ratingCount: 63,
        isFeatured: false,
        isPopular: true
      },
      {
        name: "Designer Silk Evening Dress",
        description: "Handmade in Paris, bias-cut pure silk",
        price: 1299.99,
        oldPrice: null,
        discount: null,
        categoryId: 2,
        stock: 12,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 5,
        ratingCount: 27,
        isFeatured: true,
        isPopular: true
      },

      // Home & Decor
      {
        name: "Artisan Ceramic Vase Collection",
        description: "Handcrafted by master ceramicists",
        price: 249.99,
        oldPrice: 299.99,
        discount: 17,
        categoryId: 3,
        stock: 20,
        image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        ratingCount: 47,
        isFeatured: true,
        isPopular: false
      },
      {
        name: "Smart Home Lighting System",
        description: "Voice-controlled, color-changing fixtures",
        price: 399.99,
        oldPrice: null,
        discount: null,
        categoryId: 3,
        stock: 40,
        image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.5,
        ratingCount: 83,
        isFeatured: false,
        isPopular: true
      },
      {
        name: "Luxury Egyptian Cotton Bedding Set",
        description: "1000 thread count, organic cotton, 4-piece set",
        price: 349.99,
        oldPrice: 429.99,
        discount: 19,
        categoryId: 3,
        stock: 25,
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        ratingCount: 71,
        isFeatured: true,
        isPopular: true
      },
      {
        name: "Modern Velvet Sofa",
        description: "Kiln-dried hardwood frame, hand-tufted cushions",
        price: 1899.99,
        oldPrice: 2299.99,
        discount: 17,
        categoryId: 3,
        stock: 8,
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        ratingCount: 39,
        isFeatured: true,
        isPopular: false
      },

      // Books
      {
        name: "Limited Edition Collector's Atlas",
        description: "Hand-bound in leather with gold embossing",
        price: 189.99,
        oldPrice: 249.99,
        discount: 24,
        categoryId: 4,
        stock: 15,
        image: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        ratingCount: 28,
        isFeatured: true,
        isPopular: false
      },
      {
        name: "First Edition Signed Novel Collection",
        description: "Set of 5 modern classics, author-signed",
        price: 899.99,
        oldPrice: 1099.99,
        discount: 18,
        categoryId: 4,
        stock: 7,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 5,
        ratingCount: 13,
        isFeatured: false,
        isPopular: true
      },
      {
        name: "Artisanal Leather Journal",
        description: "Hand-stitched Italian leather, acid-free pages",
        price: 149.99,
        oldPrice: 179.99,
        discount: 17,
        categoryId: 4,
        stock: 35,
        image: "https://images.unsplash.com/photo-1531346680077-ccb2f5ab5d86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        ratingCount: 52,
        isFeatured: true,
        isPopular: true
      },

      // Jewelry
      {
        name: "Diamond Eternity Band",
        description: "1.5 carat total weight, platinum setting",
        price: 2499.99,
        oldPrice: 2999.99,
        discount: 17,
        categoryId: 5,
        stock: 10,
        image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 5,
        ratingCount: 32,
        isFeatured: true,
        isPopular: true
      },
      {
        name: "Swiss Automatic Chronograph",
        description: "Sapphire crystal, exhibition caseback",
        price: 3299.99,
        oldPrice: null,
        discount: null,
        categoryId: 5,
        stock: 8,
        image: "https://images.unsplash.com/photo-1533139143976-30918502365b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        ratingCount: 21,
        isFeatured: false,
        isPopular: true
      },
      {
        name: "South Sea Pearl Necklace",
        description: "13-15mm pearls, 18K gold clasps",
        price: 5899.99,
        oldPrice: 6999.99,
        discount: 16,
        categoryId: 5,
        stock: 5,
        image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 5,
        ratingCount: 17,
        isFeatured: true,
        isPopular: false
      },
      {
        name: "Emerald and Diamond Earrings",
        description: "Colombian emeralds, pave diamond setting",
        price: 3799.99,
        oldPrice: 4299.99,
        discount: 12,
        categoryId: 5,
        stock: 7,
        image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        ratingCount: 23,
        isFeatured: true,
        isPopular: true
      },

      // Beauty
      {
        name: "Luxury Skincare Collection",
        description: "Anti-aging serum, cream, and eye treatment",
        price: 499.99,
        oldPrice: 599.99,
        discount: 17,
        categoryId: 6,
        stock: 25,
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        ratingCount: 89,
        isFeatured: true,
        isPopular: true
      },
      {
        name: "Premium Fragrance Set",
        description: "Artisanal scents in handblown glass bottles",
        price: 389.99,
        oldPrice: 459.99,
        discount: 15,
        categoryId: 6,
        stock: 20,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        ratingCount: 56,
        isFeatured: true,
        isPopular: false
      },
      {
        name: "Japanese Bath Ritual Collection",
        description: "Ceremonial bath salts, oils, and brushes",
        price: 279.99,
        oldPrice: 329.99,
        discount: 15,
        categoryId: 6,
        stock: 30,
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        ratingCount: 43,
        isFeatured: false,
        isPopular: true
      },

      // Gourmet
      {
        name: "Single-Origin Coffee Collection",
        description: "Four premium beans from around the world",
        price: 89.99,
        oldPrice: 109.99,
        discount: 18,
        categoryId: 7,
        stock: 50,
        image: "https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        ratingCount: 112,
        isFeatured: false,
        isPopular: true
      },
      {
        name: "Aged Balsamic Vinegar Set",
        description: "25-year aged in wooden barrels, Italian-made",
        price: 199.99,
        oldPrice: 249.99,
        discount: 20,
        categoryId: 7,
        stock: 15,
        image: "https://images.unsplash.com/photo-1620991725187-aef443627f18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        ratingCount: 38,
        isFeatured: true,
        isPopular: false
      },
      {
        name: "Truffle Gift Collection",
        description: "Black and white truffles, oils, and salt",
        price: 329.99,
        oldPrice: 399.99,
        discount: 18,
        categoryId: 7,
        stock: 12,
        image: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        ratingCount: 27,
        isFeatured: true,
        isPopular: true
      },
      {
        name: "Reserve Champagne Collection",
        description: "Vintage selections from top producers",
        price: 799.99,
        oldPrice: 999.99,
        discount: 20,
        categoryId: 7,
        stock: 8,
        image: "https://images.unsplash.com/photo-1621465558572-012e8dfd7621?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 5,
        ratingCount: 19,
        isFeatured: true,
        isPopular: true
      },

      // Travel
      {
        name: "Premium Cabin Luggage Set",
        description: "Aircraft-grade aluminum with leather accents",
        price: 799.99,
        oldPrice: 999.99,
        discount: 20,
        categoryId: 8,
        stock: 15,
        image: "https://images.unsplash.com/photo-1565026057757-f7a9a593716a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        ratingCount: 67,
        isFeatured: true,
        isPopular: true
      },
      {
        name: "Luxury Travel Pillow & Mask Set",
        description: "Memory foam, silk exterior, adjustable",
        price: 149.99,
        oldPrice: 189.99,
        discount: 21,
        categoryId: 8,
        stock: 40,
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        ratingCount: 92,
        isFeatured: false,
        isPopular: true
      },
      {
        name: "Handcrafted Leather Passport Holder",
        description: "Full-grain leather, RFID protection",
        price: 89.99,
        oldPrice: 119.99,
        discount: 25,
        categoryId: 8,
        stock: 55,
        image: "https://images.unsplash.com/photo-1543994298-b005387a3e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        ratingCount: 83,
        isFeatured: true,
        isPopular: false
      }
    ];

    products.forEach(product => {
      this.createProduct(product);
    });

    // Admin user already created at the beginning of seedData
  }
}

export const storage = new MemStorage();
