import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Management
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("viewer"), // admin, viewer
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  lastLogin: timestamp("last_login"),
});

// Shop Management
export const shops = pgTable("shops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  status: text("status").notNull().default("offline"), // online, offline, away, busy
  appVersion: text("app_version").notNull().default("v1.0.0"),
  lastSeen: timestamp("last_seen").default(sql`now()`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Product Catalog
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  category: text("category").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  reorderPoint: integer("reorder_point").notNull().default(0),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Inventory Batches
export const inventoryBatches = pgTable("inventory_batches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  shopId: varchar("shop_id").notNull(), 
  batchNumber: text("batch_number").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  expiryDate: timestamp("expiry_date"),
  receivedDate: timestamp("received_date").notNull().default(sql`now()`),
  supplierId: varchar("supplier_id"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Stock Movements (for tracking history)
export const stockMovements = pgTable("stock_movements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchId: varchar("batch_id").notNull(),
  movementType: text("movement_type").notNull(), // "in", "out", "adjustment", "transfer"
  quantity: integer("quantity").notNull(),
  reason: text("reason"),
  reference: text("reference"), // order_id, transfer_id, etc.
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Sales Transactions
export const sales = pgTable("sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shopId: varchar("shop_id").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMode: text("payment_mode").notNull(), // cash, card, digital
  customerName: text("customer_name"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const saleItems = pgTable("sale_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleId: varchar("sale_id").notNull(),
  batchId: varchar("batch_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

// Suppliers (optional but useful)
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  contactInfo: text("contact_info"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Insert and Select Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, lastLogin: true });
export const insertShopSchema = createInsertSchema(shops).omit({ id: true, createdAt: true, lastSeen: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertInventoryBatchSchema = createInsertSchema(inventoryBatches).omit({ id: true, createdAt: true, updatedAt: true });
export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({ id: true, createdAt: true });
export const insertSaleSchema = createInsertSchema(sales).omit({ id: true, createdAt: true });
export const insertSaleItemSchema = createInsertSchema(saleItems).omit({ id: true });
export const insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true, createdAt: true });

// Type Exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Shop = typeof shops.$inferSelect;
export type InsertShop = z.infer<typeof insertShopSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type InventoryBatch = typeof inventoryBatches.$inferSelect;
export type InsertInventoryBatch = z.infer<typeof insertInventoryBatchSchema>;

export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;

export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;

export type SaleItem = typeof saleItems.$inferSelect;
export type InsertSaleItem = z.infer<typeof insertSaleItemSchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
