-- AdminPilot Sample Data
-- PostgreSQL Sample Data Loading Script
-- Run this after creating the schema to populate tables with test data

-- Insert Sample Users
INSERT INTO "users" ("username", "password", "email", "role") VALUES
('admin', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'admin@adminpilot.com', 'admin'),
('viewer1', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'viewer1@adminpilot.com', 'viewer'),
('manager', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'manager@adminpilot.com', 'admin'),
('staff', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'staff@adminpilot.com', 'viewer');

-- Insert Sample Shops
INSERT INTO "shops" ("name", "address", "status", "app_version", "last_seen") VALUES
('Downtown Pharmacy', '123 Main St, Downtown', 'online', 'v2.1.4', NOW() - INTERVAL '5 minutes'),
('Medical Center', '456 Health Ave, Medical District', 'online', 'v2.1.4', NOW() - INTERVAL '2 minutes'),
('Health Plus', '789 Oak Dr, Suburbs', 'offline', 'v2.1.3', NOW() - INTERVAL '2 hours'),
('City Care Pharmacy', '321 Central Blvd, City Center', 'online', 'v2.1.4', NOW() - INTERVAL '1 minute'),
('Community Health', '654 Park Ave, Residential', 'away', 'v2.1.2', NOW() - INTERVAL '30 minutes');

-- Insert Sample Suppliers
INSERT INTO "suppliers" ("name", "contact_info") VALUES
('PharmaCorp Ltd', 'contact@pharmacorp.com, +1-555-0101'),
('MediSupply Inc', 'orders@medisupply.com, +1-555-0102'),
('HealthSource Pro', 'info@healthsource.com, +1-555-0103'),
('VitaDistributors', 'sales@vitadist.com, +1-555-0104'),
('BioMed Solutions', 'support@biomeds.com, +1-555-0105');

-- Insert Sample Products
INSERT INTO "products" ("name", "sku", "category", "unit_price", "reorder_point", "description") VALUES
('Paracetamol 500mg', 'MED001', 'Pain Relief', 0.25, 100, 'Basic pain reliever and fever reducer'),
('Ibuprofen 400mg', 'MED002', 'Pain Relief', 0.45, 50, 'Anti-inflammatory pain reliever'),
('Vitamin C 1000mg', 'VIT001', 'Vitamins', 0.80, 25, 'Immune system support supplement'),
('Bandages Pack', 'SUP001', 'First Aid', 3.50, 20, 'Assorted adhesive bandages'),
('Antiseptic Solution', 'SUP002', 'First Aid', 2.75, 15, 'Wound cleaning antiseptic'),
('Multivitamins', 'VIT002', 'Vitamins', 12.99, 10, 'Daily multivitamin complex'),
('Cough Syrup', 'MED003', 'Cold & Flu', 8.50, 12, 'Cough suppressant syrup'),
('Thermometer Digital', 'DEV001', 'Medical Devices', 15.99, 5, 'Digital body thermometer'),
('Blood Pressure Monitor', 'DEV002', 'Medical Devices', 45.99, 3, 'Automatic blood pressure monitor'),
('Aspirin 325mg', 'MED004', 'Pain Relief', 0.15, 75, 'Low-dose aspirin for heart health');

-- Insert Sample Inventory Batches with realistic stock levels
-- Get shop and product IDs for foreign key references
WITH shop_ids AS (
  SELECT id, name FROM "shops" ORDER BY name
),
product_ids AS (
  SELECT id, sku FROM "products" ORDER BY sku
),
supplier_ids AS (
  SELECT id, name FROM "suppliers" ORDER BY name
)

INSERT INTO "inventory_batches" ("product_id", "shop_id", "batch_number", "current_stock", "expiry_date", "supplier_id", "received_date") 
SELECT 
  p.id,
  s.id,
  CASE 
    WHEN p.sku = 'MED001' THEN 'BATCH-PAR-2024-001'
    WHEN p.sku = 'MED002' THEN 'BATCH-IBU-2024-002'
    WHEN p.sku = 'VIT001' THEN 'BATCH-VTC-2024-003'
    WHEN p.sku = 'SUP001' THEN 'BATCH-BND-2024-004'
    WHEN p.sku = 'SUP002' THEN 'BATCH-ANT-2024-005'
    WHEN p.sku = 'VIT002' THEN 'BATCH-MVT-2024-006'
    WHEN p.sku = 'MED003' THEN 'BATCH-CSP-2024-007'
    WHEN p.sku = 'DEV001' THEN 'BATCH-THM-2024-008'
    WHEN p.sku = 'DEV002' THEN 'BATCH-BPM-2024-009'
    WHEN p.sku = 'MED004' THEN 'BATCH-ASP-2024-010'
  END,
  CASE 
    WHEN s.name = 'Downtown Pharmacy' AND p.sku = 'MED001' THEN 150
    WHEN s.name = 'Downtown Pharmacy' AND p.sku = 'MED002' THEN 75
    WHEN s.name = 'Downtown Pharmacy' AND p.sku = 'VIT001' THEN 40
    WHEN s.name = 'Medical Center' AND p.sku = 'MED001' THEN 200
    WHEN s.name = 'Medical Center' AND p.sku = 'VIT002' THEN 25
    WHEN s.name = 'Medical Center' AND p.sku = 'DEV001' THEN 8
    WHEN s.name = 'Health Plus' AND p.sku = 'SUP001' THEN 30
    WHEN s.name = 'Health Plus' AND p.sku = 'SUP002' THEN 20
    WHEN s.name = 'City Care Pharmacy' AND p.sku = 'MED003' THEN 15
    WHEN s.name = 'Community Health' AND p.sku = 'DEV002' THEN 2
    ELSE 0
  END,
  CASE 
    WHEN p.sku LIKE 'MED%' THEN NOW() + INTERVAL '18 months'
    WHEN p.sku LIKE 'VIT%' THEN NOW() + INTERVAL '24 months'
    WHEN p.sku LIKE 'SUP%' THEN NOW() + INTERVAL '36 months'
    WHEN p.sku LIKE 'DEV%' THEN NULL
  END,
  sup.id,
  NOW() - INTERVAL '30 days'
FROM product_ids p
CROSS JOIN shop_ids s
LEFT JOIN supplier_ids sup ON sup.name = 'PharmaCorp Ltd'
WHERE (
  (s.name = 'Downtown Pharmacy' AND p.sku IN ('MED001', 'MED002', 'VIT001')) OR
  (s.name = 'Medical Center' AND p.sku IN ('MED001', 'VIT002', 'DEV001')) OR
  (s.name = 'Health Plus' AND p.sku IN ('SUP001', 'SUP002')) OR
  (s.name = 'City Care Pharmacy' AND p.sku IN ('MED003')) OR
  (s.name = 'Community Health' AND p.sku IN ('DEV002'))
);

-- Insert Sample Stock Movements (recent activity)
WITH recent_batches AS (
  SELECT ib.id as batch_id, ib.current_stock, s.name as shop_name, p.sku
  FROM "inventory_batches" ib
  JOIN "shops" s ON ib.shop_id = s.id
  JOIN "products" p ON ib.product_id = p.id
  WHERE ib.current_stock > 0
),
admin_user AS (
  SELECT id FROM "users" WHERE username = 'admin' LIMIT 1
)

INSERT INTO "stock_movements" ("batch_id", "movement_type", "quantity", "reason", "user_id", "created_at")
SELECT 
  rb.batch_id,
  'in',
  CASE 
    WHEN rb.sku = 'MED001' THEN 200
    WHEN rb.sku = 'MED002' THEN 100
    WHEN rb.sku = 'VIT001' THEN 50
    WHEN rb.sku = 'VIT002' THEN 30
    WHEN rb.sku = 'SUP001' THEN 40
    WHEN rb.sku = 'SUP002' THEN 25
    WHEN rb.sku = 'MED003' THEN 20
    WHEN rb.sku = 'DEV001' THEN 10
    WHEN rb.sku = 'DEV002' THEN 3
    ELSE 10
  END,
  'Initial stock receipt',
  au.id,
  NOW() - INTERVAL '30 days'
FROM recent_batches rb
CROSS JOIN admin_user au;

-- Insert some sample sales
WITH shop_batches AS (
  SELECT 
    ib.id as batch_id,
    ib.shop_id,
    ib.current_stock,
    p.unit_price,
    p.name as product_name,
    s.name as shop_name
  FROM "inventory_batches" ib
  JOIN "products" p ON ib.product_id = p.id
  JOIN "shops" s ON ib.shop_id = s.id
  WHERE ib.current_stock > 5
)

INSERT INTO "sales" ("shop_id", "total_amount", "payment_mode", "customer_name", "created_at")
SELECT 
  sb.shop_id,
  ROUND((sb.unit_price * 3)::numeric, 2),
  CASE (RANDOM() * 3)::int
    WHEN 0 THEN 'cash'
    WHEN 1 THEN 'card'
    ELSE 'digital'
  END,
  CASE (RANDOM() * 5)::int
    WHEN 0 THEN 'John Doe'
    WHEN 1 THEN 'Jane Smith'
    WHEN 2 THEN 'Bob Johnson'
    WHEN 3 THEN 'Mary Wilson'
    ELSE NULL
  END,
  NOW() - INTERVAL '1 hour' * (RANDOM() * 72)
FROM shop_batches sb
WHERE sb.shop_name IN ('Downtown Pharmacy', 'Medical Center')
LIMIT 10;

-- Insert sale items for the sales
WITH recent_sales AS (
  SELECT 
    s.id as sale_id,
    s.shop_id,
    ib.id as batch_id,
    p.unit_price
  FROM "sales" s
  JOIN "inventory_batches" ib ON s.shop_id = ib.shop_id
  JOIN "products" p ON ib.product_id = p.id
  WHERE ib.current_stock > 0
  LIMIT 15
)

INSERT INTO "sale_items" ("sale_id", "batch_id", "quantity", "unit_price", "total_price")
SELECT 
  rs.sale_id,
  rs.batch_id,
  3,
  rs.unit_price,
  ROUND((rs.unit_price * 3)::numeric, 2)
FROM recent_sales rs;

-- Update some users with last login times
UPDATE "users" 
SET "last_login" = NOW() - INTERVAL '1 hour' * (RANDOM() * 24)
WHERE "username" IN ('admin', 'manager');

-- Insert some additional stock movements for realism
WITH random_batches AS (
  SELECT id FROM "inventory_batches" 
  WHERE current_stock > 10 
  ORDER BY RANDOM() 
  LIMIT 5
),
staff_user AS (
  SELECT id FROM "users" WHERE username = 'staff' LIMIT 1
)

INSERT INTO "stock_movements" ("batch_id", "movement_type", "quantity", "reason", "user_id", "created_at")
SELECT 
  rb.id,
  'out',
  5,
  'Customer purchase',
  su.id,
  NOW() - INTERVAL '1 hour' * (RANDOM() * 48)
FROM random_batches rb
CROSS JOIN staff_user su;

-- Final message
SELECT 'Sample data loaded successfully!' as status;