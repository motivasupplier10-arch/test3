-- AdminPilot Database Schema
-- PostgreSQL Schema Creation Script
-- Based on Drizzle ORM schema definitions

-- Create database extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Management Table
CREATE TABLE IF NOT EXISTS "users" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "role" TEXT NOT NULL DEFAULT 'viewer',
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "last_login" TIMESTAMP
);

-- Shop Management Table
CREATE TABLE IF NOT EXISTS "shops" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'offline',
  "app_version" TEXT NOT NULL DEFAULT 'v1.0.0',
  "last_seen" TIMESTAMP DEFAULT NOW(),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Product Catalog Table
CREATE TABLE IF NOT EXISTS "products" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "sku" TEXT NOT NULL UNIQUE,
  "category" TEXT NOT NULL,
  "unit_price" DECIMAL(10,2) NOT NULL,
  "reorder_point" INTEGER NOT NULL DEFAULT 0,
  "description" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS "suppliers" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "contact_info" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Inventory Batches Table
CREATE TABLE IF NOT EXISTS "inventory_batches" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "product_id" VARCHAR NOT NULL,
  "shop_id" VARCHAR NOT NULL,
  "batch_number" TEXT NOT NULL,
  "current_stock" INTEGER NOT NULL DEFAULT 0,
  "expiry_date" TIMESTAMP,
  "received_date" TIMESTAMP NOT NULL DEFAULT NOW(),
  "supplier_id" VARCHAR,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Stock Movements Table (for tracking history)
CREATE TABLE IF NOT EXISTS "stock_movements" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "batch_id" VARCHAR NOT NULL,
  "movement_type" TEXT NOT NULL, -- 'in', 'out', 'adjustment', 'transfer'
  "quantity" INTEGER NOT NULL,
  "reason" TEXT,
  "reference" TEXT, -- order_id, transfer_id, etc.
  "user_id" VARCHAR,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sales Transactions Table
CREATE TABLE IF NOT EXISTS "sales" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "shop_id" VARCHAR NOT NULL,
  "total_amount" DECIMAL(10,2) NOT NULL,
  "payment_mode" TEXT NOT NULL, -- 'cash', 'card', 'digital'
  "customer_name" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sale Items Table
CREATE TABLE IF NOT EXISTS "sale_items" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "sale_id" VARCHAR NOT NULL,
  "batch_id" VARCHAR NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unit_price" DECIMAL(10,2) NOT NULL,
  "total_price" DECIMAL(10,2) NOT NULL
);

-- Add Foreign Key Constraints
ALTER TABLE "inventory_batches" 
  ADD CONSTRAINT "fk_inventory_batches_product" 
  FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;

ALTER TABLE "inventory_batches" 
  ADD CONSTRAINT "fk_inventory_batches_shop" 
  FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE;

ALTER TABLE "inventory_batches" 
  ADD CONSTRAINT "fk_inventory_batches_supplier" 
  FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL;

ALTER TABLE "stock_movements" 
  ADD CONSTRAINT "fk_stock_movements_batch" 
  FOREIGN KEY ("batch_id") REFERENCES "inventory_batches"("id") ON DELETE CASCADE;

ALTER TABLE "stock_movements" 
  ADD CONSTRAINT "fk_stock_movements_user" 
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;

ALTER TABLE "sales" 
  ADD CONSTRAINT "fk_sales_shop" 
  FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE;

ALTER TABLE "sale_items" 
  ADD CONSTRAINT "fk_sale_items_sale" 
  FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE;

ALTER TABLE "sale_items" 
  ADD CONSTRAINT "fk_sale_items_batch" 
  FOREIGN KEY ("batch_id") REFERENCES "inventory_batches"("id") ON DELETE CASCADE;

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS "idx_shops_status" ON "shops"("status");
CREATE INDEX IF NOT EXISTS "idx_products_sku" ON "products"("sku");
CREATE INDEX IF NOT EXISTS "idx_products_category" ON "products"("category");
CREATE INDEX IF NOT EXISTS "idx_inventory_batches_shop" ON "inventory_batches"("shop_id");
CREATE INDEX IF NOT EXISTS "idx_inventory_batches_product" ON "inventory_batches"("product_id");
CREATE INDEX IF NOT EXISTS "idx_stock_movements_batch" ON "stock_movements"("batch_id");
CREATE INDEX IF NOT EXISTS "idx_stock_movements_type" ON "stock_movements"("movement_type");
CREATE INDEX IF NOT EXISTS "idx_sales_shop" ON "sales"("shop_id");
CREATE INDEX IF NOT EXISTS "idx_sales_date" ON "sales"("created_at");
CREATE INDEX IF NOT EXISTS "idx_sale_items_sale" ON "sale_items"("sale_id");

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventory_batches_updated_at 
  BEFORE UPDATE ON "inventory_batches" 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();