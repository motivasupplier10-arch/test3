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
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User Management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Shop Management
  getAllShops(): Promise<Shop[]>;
  getShop(id: string): Promise<Shop | undefined>;
  createShop(shop: InsertShop): Promise<Shop>;
  updateShopStatus(id: string, status: string, lastSeen?: Date): Promise<Shop | undefined>;
  
  // Product Management
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Inventory Batch Management
  getAllInventoryBatches(): Promise<InventoryBatch[]>;
  getInventoryBatch(id: string): Promise<InventoryBatch | undefined>;
  getInventoryBatchesByShop(shopId: string): Promise<InventoryBatch[]>;
  getInventoryBatchesByProduct(productId: string): Promise<InventoryBatch[]>;
  createInventoryBatch(batch: InsertInventoryBatch): Promise<InventoryBatch>;
  updateInventoryBatchStock(id: string, currentStock: number): Promise<InventoryBatch | undefined>;
  
  // Stock Movement Management
  getAllStockMovements(): Promise<StockMovement[]>;
  getStockMovementsByBatch(batchId: string): Promise<StockMovement[]>;
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;
  
  // Sales Management
  getAllSales(): Promise<Sale[]>;
  getSalesByShop(shopId: string): Promise<Sale[]>;
  getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  getSaleItems(saleId: string): Promise<SaleItem[]>;
  createSaleItem(saleItem: InsertSaleItem): Promise<SaleItem>;
  
  // Supplier Management
  getAllSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  
  // Analytics and Reporting
  getLowStockItems(): Promise<Array<InventoryBatch & { product: Product; shop: Shop }>>;
  getOutOfStockItems(): Promise<Array<InventoryBatch & { product: Product; shop: Shop }>>;
  getExpiringItems(days: number): Promise<Array<InventoryBatch & { product: Product; shop: Shop }>>;
  getTopSellingProducts(limit: number): Promise<Array<{ product: Product; totalSold: number }>>;
  getShopStockSummary(): Promise<Array<{ shop: Shop; totalProducts: number; lowStock: number; outOfStock: number }>>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private shops: Map<string, Shop>;
  private products: Map<string, Product>;
  private inventoryBatches: Map<string, InventoryBatch>;
  private stockMovements: Map<string, StockMovement>;
  private sales: Map<string, Sale>;
  private saleItems: Map<string, SaleItem>;
  private suppliers: Map<string, Supplier>;

  constructor() {
    this.users = new Map();
    this.shops = new Map();
    this.products = new Map();
    this.inventoryBatches = new Map();
    this.stockMovements = new Map();
    this.sales = new Map();
    this.saleItems = new Map();
    this.suppliers = new Map();
    this.initializeSeedData();
  }

  private initializeSeedData() {
    // Add some seed data for testing
    this.createShop({ name: "Downtown Pharmacy", address: "123 Main St, Downtown", status: "online", appVersion: "v2.1.4" });
    this.createShop({ name: "Medical Center", address: "456 Health Ave, Medical District", status: "online", appVersion: "v2.1.4" });
    this.createShop({ name: "Health Plus", address: "789 Oak Dr, Suburbs", status: "offline", appVersion: "v2.1.3" });
    
    this.createProduct({ name: "Paracetamol 500mg", sku: "MED001", category: "Pain Relief", unitPrice: "0.25", reorderPoint: 100 });
    this.createProduct({ name: "Ibuprofen 400mg", sku: "MED002", category: "Pain Relief", unitPrice: "0.45", reorderPoint: 50 });
    this.createProduct({ name: "Vitamin C 1000mg", sku: "VIT001", category: "Vitamins", unitPrice: "0.80", reorderPoint: 25 });
  }

  // User Management
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "viewer",
      createdAt: new Date(),
      lastLogin: null
    };
    this.users.set(id, user);
    return user;
  }

  // Shop Management
  async getAllShops(): Promise<Shop[]> {
    return Array.from(this.shops.values());
  }

  async getShop(id: string): Promise<Shop | undefined> {
    return this.shops.get(id);
  }

  async createShop(insertShop: InsertShop): Promise<Shop> {
    const id = randomUUID();
    const shop: Shop = {
      ...insertShop,
      id,
      status: insertShop.status || "offline",
      appVersion: insertShop.appVersion || "v1.0.0",
      createdAt: new Date(),
      lastSeen: new Date()
    };
    this.shops.set(id, shop);
    return shop;
  }

  async updateShopStatus(id: string, status: string, lastSeen?: Date): Promise<Shop | undefined> {
    const shop = this.shops.get(id);
    if (!shop) return undefined;
    
    const updatedShop = {
      ...shop,
      status,
      lastSeen: lastSeen || new Date()
    };
    this.shops.set(id, updatedShop);
    return updatedShop;
  }

  // Product Management
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.sku === sku);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      reorderPoint: insertProduct.reorderPoint || 0,
      description: insertProduct.description || null,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  // Inventory Batch Management
  async getAllInventoryBatches(): Promise<InventoryBatch[]> {
    return Array.from(this.inventoryBatches.values());
  }

  async getInventoryBatch(id: string): Promise<InventoryBatch | undefined> {
    return this.inventoryBatches.get(id);
  }

  async getInventoryBatchesByShop(shopId: string): Promise<InventoryBatch[]> {
    return Array.from(this.inventoryBatches.values()).filter(batch => batch.shopId === shopId);
  }

  async getInventoryBatchesByProduct(productId: string): Promise<InventoryBatch[]> {
    return Array.from(this.inventoryBatches.values()).filter(batch => batch.productId === productId);
  }

  async createInventoryBatch(insertBatch: InsertInventoryBatch): Promise<InventoryBatch> {
    const id = randomUUID();
    const batch: InventoryBatch = {
      ...insertBatch,
      id,
      currentStock: insertBatch.currentStock || 0,
      expiryDate: insertBatch.expiryDate || null,
      receivedDate: insertBatch.receivedDate || new Date(),
      supplierId: insertBatch.supplierId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.inventoryBatches.set(id, batch);
    return batch;
  }

  async updateInventoryBatchStock(id: string, currentStock: number): Promise<InventoryBatch | undefined> {
    const batch = this.inventoryBatches.get(id);
    if (!batch) return undefined;
    
    const updatedBatch = {
      ...batch,
      currentStock,
      updatedAt: new Date()
    };
    this.inventoryBatches.set(id, updatedBatch);
    return updatedBatch;
  }

  // Stock Movement Management
  async getAllStockMovements(): Promise<StockMovement[]> {
    return Array.from(this.stockMovements.values());
  }

  async getStockMovementsByBatch(batchId: string): Promise<StockMovement[]> {
    return Array.from(this.stockMovements.values()).filter(movement => movement.batchId === batchId);
  }

  async createStockMovement(insertMovement: InsertStockMovement): Promise<StockMovement> {
    const id = randomUUID();
    const movement: StockMovement = {
      ...insertMovement,
      id,
      reason: insertMovement.reason || null,
      reference: insertMovement.reference || null,
      userId: insertMovement.userId || null,
      createdAt: new Date()
    };
    this.stockMovements.set(id, movement);
    return movement;
  }

  // Sales Management
  async getAllSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async getSalesByShop(shopId: string): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(sale => sale.shopId === shopId);
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(sale => 
      sale.createdAt >= startDate && sale.createdAt <= endDate
    );
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = randomUUID();
    const sale: Sale = {
      ...insertSale,
      id,
      customerName: insertSale.customerName || null,
      createdAt: new Date()
    };
    this.sales.set(id, sale);
    return sale;
  }

  async getSaleItems(saleId: string): Promise<SaleItem[]> {
    return Array.from(this.saleItems.values()).filter(item => item.saleId === saleId);
  }

  async createSaleItem(insertSaleItem: InsertSaleItem): Promise<SaleItem> {
    const id = randomUUID();
    const saleItem: SaleItem = {
      ...insertSaleItem,
      id
    };
    this.saleItems.set(id, saleItem);
    return saleItem;
  }

  // Supplier Management
  async getAllSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const supplier: Supplier = {
      ...insertSupplier,
      id,
      contactInfo: insertSupplier.contactInfo || null,
      createdAt: new Date()
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  // Analytics and Reporting
  async getLowStockItems(): Promise<Array<InventoryBatch & { product: Product; shop: Shop }>> {
    const result = [];
    for (const batch of Array.from(this.inventoryBatches.values())) {
      const product = this.products.get(batch.productId);
      const shop = this.shops.get(batch.shopId);
      if (product && shop && batch.currentStock <= product.reorderPoint && batch.currentStock > 0) {
        result.push({ ...batch, product, shop });
      }
    }
    return result;
  }

  async getOutOfStockItems(): Promise<Array<InventoryBatch & { product: Product; shop: Shop }>> {
    const result = [];
    for (const batch of Array.from(this.inventoryBatches.values())) {
      const product = this.products.get(batch.productId);
      const shop = this.shops.get(batch.shopId);
      if (product && shop && batch.currentStock === 0) {
        result.push({ ...batch, product, shop });
      }
    }
    return result;
  }

  async getExpiringItems(days: number): Promise<Array<InventoryBatch & { product: Product; shop: Shop }>> {
    const result = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    for (const batch of Array.from(this.inventoryBatches.values())) {
      const product = this.products.get(batch.productId);
      const shop = this.shops.get(batch.shopId);
      if (product && shop && batch.expiryDate && batch.expiryDate <= cutoffDate) {
        result.push({ ...batch, product, shop });
      }
    }
    return result;
  }

  async getTopSellingProducts(limit: number): Promise<Array<{ product: Product; totalSold: number }>> {
    const productSales = new Map<string, number>();
    
    for (const saleItem of Array.from(this.saleItems.values())) {
      const batch = this.inventoryBatches.get(saleItem.batchId);
      if (batch) {
        const currentSold = productSales.get(batch.productId) || 0;
        productSales.set(batch.productId, currentSold + saleItem.quantity);
      }
    }
    
    const result = [];
    for (const [productId, totalSold] of Array.from(productSales.entries())) {
      const product = this.products.get(productId);
      if (product) {
        result.push({ product, totalSold });
      }
    }
    
    return result.sort((a, b) => b.totalSold - a.totalSold).slice(0, limit);
  }

  async getShopStockSummary(): Promise<Array<{ shop: Shop; totalProducts: number; lowStock: number; outOfStock: number }>> {
    const result = [];
    
    for (const shop of Array.from(this.shops.values())) {
      const shopBatches = await this.getInventoryBatchesByShop(shop.id);
      let totalProducts = shopBatches.length;
      let lowStock = 0;
      let outOfStock = 0;
      
      for (const batch of shopBatches) {
        const product = this.products.get(batch.productId);
        if (product) {
          if (batch.currentStock === 0) {
            outOfStock++;
          } else if (batch.currentStock <= product.reorderPoint) {
            lowStock++;
          }
        }
      }
      
      result.push({ shop, totalProducts, lowStock, outOfStock });
    }
    
    return result;
  }
}

export const storage = new MemStorage();
