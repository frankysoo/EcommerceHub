import { z } from "zod";

// User schema
export const insertUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  isAdmin: z.boolean().optional().default(false),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export interface User extends InsertUser {
  id: number;
}

// Product schema
export const insertProductSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  categoryId: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;

export interface Product extends InsertProduct {
  id: number;
}

// Category schema
export const insertCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;

export interface Category extends InsertCategory {
  id: number;
}

// Cart item schema
export const insertCartItemSchema = z.object({
  userId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export interface CartItem extends InsertCartItem {
  id: number;
  product?: Product;
}

// Order status enum
export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

// Order schema
export const insertOrderSchema = z.object({
  userId: z.number().int().positive(),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  shippingAddress: z.string(),
  shippingCity: z.string(),
  shippingState: z.string(),
  shippingZipCode: z.string(),
  shippingCountry: z.string(),
  total: z.number().nonnegative(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;

export interface Order extends InsertOrder {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

// Order item schema
export const insertOrderItemSchema = z.object({
  orderId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export interface OrderItem extends InsertOrderItem {
  id: number;
  product?: Product;
}
