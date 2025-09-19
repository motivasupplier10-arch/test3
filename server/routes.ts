import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { DatabaseStorage } from "./database-storage";

const storage = new DatabaseStorage();
import { 
  insertShopSchema,
  insertProductSchema,
  insertInventoryBatchSchema,
  insertStockMovementSchema,
  insertSaleSchema,
  insertSaleItemSchema,
  insertSupplierSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Shop Management Routes
  app.get("/api/shops", async (req, res) => {
    try {
      const shops = await storage.getAllShops();
      res.json(shops);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shops" });
    }
  });

  app.get("/api/shops/:id", async (req, res) => {
    try {
      const shop = await storage.getShop(req.params.id);
      if (!shop) {
        return res.status(404).json({ error: "Shop not found" });
      }
      res.json(shop);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shop" });
    }
  });

  app.post("/api/shops", async (req, res) => {
    try {
      const shopData = insertShopSchema.parse(req.body);
      const shop = await storage.createShop(shopData);
      res.status(201).json(shop);
      
      // Broadcast to WebSocket clients
      broadcastToClients({ type: "shop_created", data: shop });
    } catch (error) {
      res.status(400).json({ error: "Invalid shop data" });
    }
  });

  app.put("/api/shops/:id/status", async (req, res) => {
    try {
      const { status, lastSeen } = req.body;
      const shop = await storage.updateShopStatus(req.params.id, status, lastSeen ? new Date(lastSeen) : undefined);
      if (!shop) {
        return res.status(404).json({ error: "Shop not found" });
      }
      res.json(shop);
      
      // Broadcast to WebSocket clients
      broadcastToClients({ type: "shop_status_updated", data: shop });
    } catch (error) {
      res.status(500).json({ error: "Failed to update shop status" });
    }
  });

  // Product Management Routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  // Inventory Batch Management Routes
  app.get("/api/inventory", async (req, res) => {
    try {
      const { shopId, productId } = req.query;
      let batches;
      
      if (shopId) {
        batches = await storage.getInventoryBatchesByShop(shopId as string);
      } else if (productId) {
        batches = await storage.getInventoryBatchesByProduct(productId as string);
      } else {
        batches = await storage.getAllInventoryBatches();
      }
      
      // Enrich with product and shop information
      const enrichedBatches = await Promise.all(batches.map(async (batch) => {
        const product = await storage.getProduct(batch.productId);
        const shop = await storage.getShop(batch.shopId);
        return { ...batch, product, shop };
      }));
      
      res.json(enrichedBatches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const batchData = insertInventoryBatchSchema.parse(req.body);
      const batch = await storage.createInventoryBatch(batchData);
      res.status(201).json(batch);
      
      // Broadcast to WebSocket clients
      broadcastToClients({ type: "inventory_updated", data: batch });
    } catch (error) {
      res.status(400).json({ error: "Invalid inventory data" });
    }
  });

  app.put("/api/inventory/:id/stock", async (req, res) => {
    try {
      const { currentStock } = req.body;
      const originalBatch = await storage.getInventoryBatch(req.params.id);
      if (!originalBatch) {
        return res.status(404).json({ error: "Inventory batch not found" });
      }
      
      // Calculate the movement delta before updating
      const oldStock = originalBatch.currentStock;
      const stockDelta = currentStock - oldStock;
      
      // Update the stock
      const updatedBatch = await storage.updateInventoryBatchStock(req.params.id, currentStock);
      
      // Create stock movement record with the correct delta
      const movement = await storage.createStockMovement({
        batchId: originalBatch.id,
        movementType: "adjustment",
        quantity: stockDelta, // Use the calculated delta
        reason: "Manual stock adjustment"
      });
      
      res.json(updatedBatch);
      
      // Broadcast to WebSocket clients
      broadcastToClients({ type: "stock_updated", data: { batch: updatedBatch, movement } });
    } catch (error) {
      res.status(500).json({ error: "Failed to update stock" });
    }
  });

  // Stock Movement Routes
  app.get("/api/stock-movements", async (req, res) => {
    try {
      const { batchId } = req.query;
      let movements;
      
      if (batchId) {
        movements = await storage.getStockMovementsByBatch(batchId as string);
      } else {
        movements = await storage.getAllStockMovements();
      }
      
      res.json(movements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock movements" });
    }
  });

  app.post("/api/stock-movements", async (req, res) => {
    try {
      const movementData = insertStockMovementSchema.parse(req.body);
      const movement = await storage.createStockMovement(movementData);
      res.status(201).json(movement);
      
      // Update inventory batch stock based on movement
      const batch = await storage.getInventoryBatch(movement.batchId);
      if (batch) {
        let newStock = batch.currentStock;
        if (movement.movementType === "in") {
          newStock += movement.quantity;
        } else if (movement.movementType === "out") {
          newStock -= movement.quantity;
        } else if (movement.movementType === "adjustment") {
          // For adjustments, quantity represents the delta change, not absolute value
          newStock += movement.quantity;
        }
        
        await storage.updateInventoryBatchStock(batch.id, Math.max(0, newStock));
        
        // Broadcast to WebSocket clients
        broadcastToClients({ type: "stock_movement_created", data: movement });
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid stock movement data" });
    }
  });

  // Sales Management Routes
  app.get("/api/sales", async (req, res) => {
    try {
      const { shopId, startDate, endDate } = req.query;
      let sales;
      
      if (startDate && endDate) {
        sales = await storage.getSalesByDateRange(new Date(startDate as string), new Date(endDate as string));
      } else if (shopId) {
        sales = await storage.getSalesByShop(shopId as string);
      } else {
        sales = await storage.getAllSales();
      }
      
      // Enrich with shop information and sale items
      const enrichedSales = await Promise.all(sales.map(async (sale) => {
        const shop = await storage.getShop(sale.shopId);
        const items = await storage.getSaleItems(sale.id);
        return { ...sale, shop, items };
      }));
      
      res.json(enrichedSales);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales" });
    }
  });

  app.post("/api/sales", async (req, res) => {
    try {
      const saleData = insertSaleSchema.parse(req.body);
      const sale = await storage.createSale(saleData);
      res.status(201).json(sale);
    } catch (error) {
      res.status(400).json({ error: "Invalid sale data" });
    }
  });

  app.post("/api/sales/:saleId/items", async (req, res) => {
    try {
      const saleItemData = insertSaleItemSchema.parse({
        ...req.body,
        saleId: req.params.saleId
      });
      const saleItem = await storage.createSaleItem(saleItemData);
      
      // Update inventory stock
      const batch = await storage.getInventoryBatch(saleItem.batchId);
      if (batch && batch.currentStock >= saleItem.quantity) {
        await storage.updateInventoryBatchStock(
          batch.id, 
          batch.currentStock - saleItem.quantity
        );
        
        // Create stock movement
        await storage.createStockMovement({
          batchId: batch.id,
          movementType: "out",
          quantity: saleItem.quantity,
          reason: "Sale",
          reference: saleItem.saleId
        });
      }
      
      res.status(201).json(saleItem);
      
      // Broadcast to WebSocket clients
      broadcastToClients({ type: "sale_completed", data: { saleItem, batch } });
    } catch (error) {
      res.status(400).json({ error: "Invalid sale item data" });
    }
  });

  // Analytics and Reporting Routes
  app.get("/api/analytics/low-stock", async (req, res) => {
    try {
      const lowStockItems = await storage.getLowStockItems();
      res.json(lowStockItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch low stock items" });
    }
  });

  app.get("/api/analytics/out-of-stock", async (req, res) => {
    try {
      const outOfStockItems = await storage.getOutOfStockItems();
      res.json(outOfStockItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch out of stock items" });
    }
  });

  app.get("/api/analytics/expiring", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const expiringItems = await storage.getExpiringItems(days);
      res.json(expiringItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expiring items" });
    }
  });

  app.get("/api/analytics/top-products", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topProducts = await storage.getTopSellingProducts(limit);
      res.json(topProducts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top selling products" });
    }
  });

  app.get("/api/analytics/shop-summary", async (req, res) => {
    try {
      const shopSummary = await storage.getShopStockSummary();
      res.json(shopSummary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shop summary" });
    }
  });

  // Dashboard KPI endpoint
  app.get("/api/dashboard/kpis", async (req, res) => {
    try {
      const [shops, lowStockItems, outOfStockItems, topProducts, inventory] = await Promise.all([
        storage.getAllShops(),
        storage.getLowStockItems(),
        storage.getOutOfStockItems(),
        storage.getTopSellingProducts(5),
        storage.getAllInventoryBatches()
      ]);
      
      // Calculate total stock value
      const products = await storage.getAllProducts();
      const productMap = new Map(products.map(p => [p.id, p]));
      
      const totalStockValue = inventory.reduce((total, batch) => {
        const product = productMap.get(batch.productId);
        return total + (product ? batch.currentStock * parseFloat(product.unitPrice) : 0);
      }, 0);
      
      const kpis = {
        totalStockValue,
        outOfStockCount: outOfStockItems.length,
        lowStockCount: lowStockItems.length,
        fastMovingProductsCount: topProducts.length,
        onlineShopsCount: shops.filter(s => s.status === "online").length,
        totalShopsCount: shops.length
      };
      
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard KPIs" });
    }
  });

  // CSV Export Routes
  app.get("/api/export/inventory", async (req, res) => {
    try {
      const batches = await storage.getAllInventoryBatches();
      const products = await storage.getAllProducts();
      const shops = await storage.getAllShops();
      
      const productMap = new Map(products.map(p => [p.id, p]));
      const shopMap = new Map(shops.map(s => [s.id, s]));
      
      const csvData = batches.map(batch => {
        const product = productMap.get(batch.productId);
        const shop = shopMap.get(batch.shopId);
        return {
          'Product Name': product?.name || '',
          'SKU': product?.sku || '',
          'Shop': shop?.name || '',
          'Batch Number': batch.batchNumber,
          'Current Stock': batch.currentStock,
          'Expiry Date': batch.expiryDate ? batch.expiryDate.toISOString().split('T')[0] : '',
          'Category': product?.category || '',
          'Unit Price': product?.unitPrice || '',
          'Last Updated': batch.updatedAt.toISOString()
        };
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory-export.csv"');
      
      // Simple CSV generation
      const headers = Object.keys(csvData[0] || {});
      let csv = headers.join(',') + '\n';
      csvData.forEach(row => {
        csv += headers.map(header => `"${row[header as keyof typeof row]}"`).join(',') + '\n';
      });
      
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: "Failed to export inventory" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket setup for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Set<any>();
  
  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected to WebSocket');
    
    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected from WebSocket');
    });
    
    // Send initial data
    ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connection established' }));
  });
  
  // Broadcast function for real-time updates
  function broadcastToClients(message: any) {
    const messageStr = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(messageStr);
      }
    });
  }

  return httpServer;
}
