@@ .. @@
 -- Enable the uuid-ossp extension for generating UUIDs
 CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
 
+-- Create function to update updated_at timestamp
+CREATE OR REPLACE FUNCTION update_updated_at_column()
+RETURNS TRIGGER AS $$
+BEGIN
+    NEW.updated_at = now();
+    RETURN NEW;
+END;
+$$ language 'plpgsql';
+
 -- Create vehicles table
 CREATE TABLE IF NOT EXISTS vehicles (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
@@ -74,50 +82,4 @@ CREATE POLICY "Users can update expenses"
 CREATE POLICY "Users can delete expenses"
     ON expenses FOR DELETE
     TO authenticated
-    USING (true);
-
--- Insert sample data
-INSERT INTO vehicles (
-    brand_model, vehicle_number, purchase_date, purchase_price, seller_name, 
-    seller_contact, seller_place, seller_address, purchase_bill, purchase_balance, 
-    status, notes
-) VALUES 
-    ('Yamaha FZ 2019', 'KL10 AB 1234', '2023-10-15', 75000, 'John Doe', '555-0101', 'Kochi', '123 MG Road, Ernakulam', 'B-2023-101', 5000, 'Available', 'First owner, good condition.'),
-    ('Royal Enfield Classic 350 2020', 'TN22 XY 5678', '2023-11-02', 150000, 'Jane Smith', '555-0102', 'Chennai', NULL, NULL, NULL, 'Available', NULL),
-    ('TVS Apache RTR 160 2017', 'DL08 WX 3141', '2023-10-05', 55000, 'Mike Ross', '555-0103', 'Delhi', NULL, NULL, NULL, 'Sold', NULL),
-    ('KTM Duke 250 2019', 'PB65 ZY 5151', '2023-11-01', 140000, 'Rachel Zane', '555-0104', 'Chandigarh', NULL, NULL, NULL, 'Sold', NULL),
-    ('Bajaj Pulsar NS200 2018', 'KA05 MN 9101', '2023-11-20', 85000, 'Louis Litt', '555-0107', 'Bangalore', NULL, NULL, NULL, 'Workshop', 'Minor scratches on tank. Sent for polishing.'),
-    ('Honda CB350 H''ness 2021', 'MH12 PQ 1121', '2023-12-01', 180000, 'Jessica Pearson', '555-0108', 'Mumbai', NULL, NULL, NULL, 'Pending', 'Awaiting RC book from seller.');
-
--- Update sold vehicles with sale information
-UPDATE vehicles SET 
-    sale_date = '2023-10-25',
-    selling_price = 62000,
-    buyer_name = 'Harvey Specter',
-    buyer_contact = '555-0105',
-    buyer_place = 'Gurgaon',
-    buyer_address = 'Suite 401, Business Tower',
-    sale_bill = 'S-2023-105',
-    sale_balance = 0
-WHERE vehicle_number = 'DL08 WX 3141';
-
-UPDATE vehicles SET 
-    sale_date = '2023-11-18',
-    selling_price = 155000,
-    buyer_name = 'Donna Paulsen',
-    buyer_contact = '555-0106',
-    buyer_place = 'Mohali',
-    sale_bill = 'S-2023-106',
-    sale_balance = 10000,
-    financier_name = 'Bajaj Finserv',
-    financier_amount = 120000,
-    finance_credited_date = '2023-11-25'
-WHERE vehicle_number = 'PB65 ZY 5151';
-
--- Insert sample expenses
-INSERT INTO expenses (vehicle_id, amount, description, date)
-SELECT v.id, e.amount, e.description, e.date::date
-FROM (VALUES 
-    ('KL10 AB 1234', 1500, 'New Tyre', '2023-11-10'),
-    ('KA05 MN 9101', 2500, 'Engine service', '2023-11-22'),
-    ('PB65 ZY 5151', 800, 'Petrol', '2023-11-15'),
-    ('KL10 AB 1234', 500, 'Polishing', '2023-11-12'),
-    ('DL08 WX 3141', 300, 'Mirror replacement', '2023-10-20')
-) AS e(vehicle_number, amount, description, date)
-JOIN vehicles v ON v.vehicle_number = e.vehicle_number;