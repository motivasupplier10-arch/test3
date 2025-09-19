import { eq, sql, and, desc, asc } from "drizzle-orm";
import { db } from "./db";
import { 
  users, shops, products, inventoryBatches, stockMovements, 
  sales, saleItems, suppliers 
} from "@shared/schema";
import { 
  type User, type InsertUser,
  type Shop, type InsertShop,
  type Product, type InsertProduct,
  type InventoryBatch, type InsertInventoryBatch,
  type StockMovement, type InsertStockMovement,
  type Sale, type InsertSale,
  type SaleItem, type InsertSaleItem,
  type Supplier, type InsertSupplier
} from "@shared/schema";
import { type IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User Management
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Shop Management
  async getAllShops(): Promise<Shop[]> {
    return await db.select().from(shops).orderBy(asc(shops.name));
  }

  async getShop(id: string): Promise<Shop | undefined> {
    const result = await db.select().from(shops).where(eq(shops.id, id));
    return result[0];
  }

  async createShop(shop: InsertShop): Promise<Shop> {
    const result = await db.insert(shops).values(shop).returning();
    return result[0];
  }

  async updateShopStatus(id: string, status: string, lastSeen?: Date): Promise<Shop | undefined> {
    const result = await db
      .update(shops)
      .set({ 
        status, 
        lastSeen: lastSeen || new Date() 
      })
      .where(eq(shops.id, id))
      .returning();
    return result[0];
  }

  // Product Management
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(asc(products.name));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.sku, sku));
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  // Inventory Batch Management
  async getAllInventoryBatches(): Promise<InventoryBatch[]> {
    return await db.select().from(inventoryBatches).orderBy(desc(inventoryBatches.updatedAt));
  }

  async getInventoryBatch(id: string): Promise<InventoryBatch | undefined> {
    const result = await db.select().from(inventoryBatches).where(eq(inventoryBatches.id, id));
    return result[0];
  }

  async getInventoryBatchesByShop(shopId: string): Promise<InventoryBatch[]> {
    return await db
      .select()
      .from(inventoryBatches)
      .where(eq(inventoryBatches.shopId, shopId))
      .orderBy(desc(inventoryBatches.updatedAt));
  }

  async getInventoryBatchesByProduct(productId: string): Promise<InventoryBatch[]> {
    return await db
      .select()
      .from(inventoryBatches)
      .where(eq(inventoryBatches.productId, productId))
      .orderBy(desc(inventoryBatches.updatedAt));
  }

  async createInventoryBatch(batch: InsertInventoryBatch): Promise<InventoryBatch> {
    const result = await db.insert(inventoryBatches).values(batch).returning();
    return result[0];
  }

  async updateInventoryBatchStock(id: string, currentStock: number): Promise<InventoryBatch | undefined> {
    const result = await db
      .update(inventoryBatches)
      .set({ 
        currentStock, 
        updatedAt: new Date() 
      })
      .where(eq(inventoryBatches.id, id))
      .returning();
    return result[0];
  }

  // Stock Movement Management
  async getAllStockMovements(): Promise<StockMovement[]> {
    return await db.select().from(stockMovements).orderBy(desc(stockMovements.createdAt));
  }

  async getStockMovementsByBatch(batchId: string): Promise<StockMovement[]> {
    return await db
      .select()
      .from(stockMovements)
      .where(eq(stockMovements.batchId, batchId))
      .orderBy(desc(stockMovements.createdAt));
  }

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    const result = await db.insert(stockMovements).values(movement).returning();
    return result[0];
  }

  // Sales Management
  async getAllSales(): Promise<Sale[]> {
    return await db.select().from(sales).orderBy(desc(sales.createdAt));
  }

  async getSalesByShop(shopId: string): Promise<Sale[]> {
    return await db
      .select()
      .from(sales)
      .where(eq(sales.shopId, shopId))
      .orderBy(desc(sales.createdAt));
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return await db
      .select()
      .from(sales)
      .where(and(
        sql`${sales.createdAt} >= ${startDate}`,
        sql`${sales.createdAt} <= ${endDate}`
      ))
      .orderBy(desc(sales.createdAt));
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    const result = await db.insert(sales).values(sale).returning();
    return result[0];
  }

  async getSaleItems(saleId: string): Promise<SaleItem[]> {
    return await db.select().from(saleItems).where(eq(saleItems.saleId, saleId));
  }

  async createSaleItem(saleItem: InsertSaleItem): Promise<SaleItem> {
    const result = await db.insert(saleItems).values(saleItem).returning();
    return result[0];
  }

  // Supplier Management
  async getAllSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).orderBy(asc(suppliers.name));
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    const result = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return result[0];
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const result = await db.insert(suppliers).values(supplier).returning();
    return result[0];
  }

  // Analytics and Reporting
  async getLowStockItems(): Promise<Array<InventoryBatch & { product: Product; shop: Shop }>> {
    const result = await db
      .select({
        batch: inventoryBatches,
        product: products,
        shop: shops
      })
      .from(inventoryBatches)
      .innerJoin(products, eq(inventoryBatches.productId, products.id))
      .innerJoin(shops, eq(inventoryBatches.shopId, shops.id))
      .where(and(
        sql`${inventoryBatches.currentStock} <= ${products.reorderPoint}`,
        sql`${inventoryBatches.currentStock} > 0`
      ));

    return result.map(r => ({ ...r.batch, product: r.product, shop: r.shop }));
  }

  async getOutOfStockItems(): Promise<Array<InventoryBatch & { product: Product; shop: Shop }>> {
    const result = await db
      .select({
        batch: inventoryBatches,
        product: products,
        shop: shops
      })
      .from(inventoryBatches)
      .innerJoin(products, eq(inventoryBatches.productId, products.id))
      .innerJoin(shops, eq(inventoryBatches.shopId, shops.id))
      .where(eq(inventoryBatches.currentStock, 0));

    return result.map(r => ({ ...r.batch, product: r.product, shop: r.shop }));
  }

  async getExpiringItems(days: number): Promise<Array<InventoryBatch & { product: Product; shop: Shop }>> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    const result = await db
      .select({
        batch: inventoryBatches,
        product: products,
        shop: shops
      })
      .from(inventoryBatches)
      .innerJoin(products, eq(inventoryBatches.productId, products.id))
      .innerJoin(shops, eq(inventoryBatches.shopId, shops.id))
      .where(and(
        sql`${inventoryBatches.expiryDate} IS NOT NULL`,
        sql`${inventoryBatches.expiryDate} <= ${cutoffDate}`
      ));

    return result.map(r => ({ ...r.batch, product: r.product, shop: r.shop }));
  }

  async getTopSellingProducts(limit: number): Promise<Array<{ product: Product; totalSold: number }>> {
    const result = await db
      .select({
        product: products,
        totalSold: sql<number>`COALESCE(SUM(${saleItems.quantity}), 0)::integer`
      })
      .from(products)
      .leftJoin(inventoryBatches, eq(products.id, inventoryBatches.productId))
      .leftJoin(saleItems, eq(inventoryBatches.id, saleItems.batchId))
      .groupBy(products.id)
      .orderBy(desc(sql`COALESCE(SUM(${saleItems.quantity}), 0)`))
      .limit(limit);

    return result;
  }

  async getShopStockSummary(): Promise<Array<{ shop: Shop; totalProducts: number; lowStock: number; outOfStock: number }>> {
    const result = await db
      .select({
        shop: shops,
        totalProducts: sql<number>`COUNT(DISTINCT ${inventoryBatches.id})::integer`,
        lowStock: sql<number>`COUNT(CASE WHEN ${inventoryBatches.currentStock} > 0 AND ${inventoryBatches.currentStock} <= ${products.reorderPoint} THEN 1 END)::integer`,
        outOfStock: sql<number>`COUNT(CASE WHEN ${inventoryBatches.currentStock} = 0 THEN 1 END)::integer`
      })
      .from(shops)
      .leftJoin(inventoryBatches, eq(shops.id, inventoryBatches.shopId))
      .leftJoin(products, eq(inventoryBatches.productId, products.id))
      .groupBy(shops.id)
      .orderBy(asc(shops.name));

    return result;
  }
}