/*
  # Create dealership management schema

  1. New Tables
    - `vehicles`
      - `id` (uuid, primary key)
      - `brand_model` (text)
      - `vehicle_number` (text, unique)
      - `purchase_date` (date)
      - `purchase_price` (numeric)
      - `seller_name` (text)
      - `seller_contact` (text)
      - `seller_place` (text)
      - `seller_address` (text, optional)
      - `purchase_bill` (text, optional)
      - `purchase_balance` (numeric, optional)
      - `is_partnership` (boolean, default false)
      - `partner_name` (text, optional)
      - `sale_date` (date, optional)
      - `selling_price` (numeric, optional)
      - `buyer_name` (text, optional)
      - `buyer_contact` (text, optional)
      - `buyer_place` (text, optional)
      - `buyer_address` (text, optional)
      - `sale_bill` (text, optional)
      - `sale_balance` (numeric, optional)
      - `financier_name` (text, optional)
      - `financier_amount` (numeric, optional)
      - `finance_credited_date` (date, optional)
      - `status` (text, check constraint)
      - `notes` (text, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `expenses`
      - `id` (uuid, primary key)
      - `vehicle_id` (uuid, foreign key to vehicles)
      - `amount` (numeric)
      - `description` (text, optional)
      - `date` (date)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their data
    - Add indexes for better performance

  3. Functions
    - Auto-update updated_at timestamp
    - Trigger for vehicles and expenses tables
*/

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_model text NOT NULL,
  vehicle_number text UNIQUE NOT NULL,
  purchase_date date NOT NULL,
  purchase_price numeric NOT NULL CHECK (purchase_price > 0),
  seller_name text NOT NULL,
  seller_contact text NOT NULL,
  seller_place text NOT NULL,
  seller_address text,
  purchase_bill text,
  purchase_balance numeric CHECK (purchase_balance >= 0),
  is_partnership boolean DEFAULT false,
  partner_name text,
  sale_date date,
  selling_price numeric CHECK (selling_price > 0),
  buyer_name text,
  buyer_contact text,
  buyer_place text,
  buyer_address text,
  sale_bill text,
  sale_balance numeric CHECK (sale_balance >= 0),
  financier_name text,
  financier_amount numeric CHECK (financier_amount >= 0),
  finance_credited_date date,
  status text NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Sold', 'Pending', 'Workshop')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  description text,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_purchase_date ON vehicles(purchase_date);
CREATE INDEX IF NOT EXISTS idx_vehicles_sale_date ON vehicles(sale_date);
CREATE INDEX IF NOT EXISTS idx_vehicles_vehicle_number ON vehicles(vehicle_number);
CREATE INDEX IF NOT EXISTS idx_expenses_vehicle_id ON expenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for vehicles table
CREATE POLICY "Users can read all vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert vehicles"
  ON vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update vehicles"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete vehicles"
  ON vehicles
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for expenses table
CREATE POLICY "Users can read all expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert expenses"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update expenses"
  ON expenses
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete expenses"
  ON expenses
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating updated_at
CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO vehicles (
  brand_model, vehicle_number, purchase_date, purchase_price, seller_name, 
  seller_contact, seller_place, seller_address, purchase_bill, purchase_balance, 
  status, notes
) VALUES 
(
  'Yamaha FZ 2019', 'KL10 AB 1234', '2023-10-15', 75000, 'John Doe', 
  '555-0101', 'Kochi', '123 MG Road, Ernakulam', 'B-2023-101', 5000, 
  'Available', 'First owner, good condition.'
),
(
  'Royal Enfield Classic 350 2020', 'TN22 XY 5678', '2023-11-02', 150000, 'Jane Smith', 
  '555-0102', 'Chennai', NULL, NULL, NULL, 
  'Available', NULL
),
(
  'TVS Apache RTR 160 2017', 'DL08 WX 3141', '2023-10-05', 55000, 'Mike Ross',
  '555-0103', 'Delhi', NULL, NULL, NULL,
  'Sold', NULL
),
(
  'KTM Duke 250 2019', 'PB65 ZY 5151', '2023-11-01', 140000, 'Rachel Zane',
  '555-0104', 'Chandigarh', NULL, NULL, NULL,
  'Sold', NULL
),
(
  'Bajaj Pulsar NS200 2018', 'KA05 MN 9101', '2023-11-20', 85000, 'Louis Litt', 
  '555-0107', 'Bangalore', NULL, NULL, NULL,
  'Workshop', 'Minor scratches on tank. Sent for polishing.'
),
(
  'Honda CB350 H''ness 2021', 'MH12 PQ 1121', '2023-12-01', 180000, 'Jessica Pearson', 
  '555-0108', 'Mumbai', NULL, NULL, NULL,
  'Pending', 'Awaiting RC book from seller.'
);

-- Update sold vehicles with sale information
UPDATE vehicles SET 
  sale_date = '2023-10-25',
  selling_price = 62000,
  buyer_name = 'Harvey Specter',
  buyer_contact = '555-0105',
  buyer_place = 'Gurgaon',
  buyer_address = 'Suite 401, Business Tower',
  sale_bill = 'S-2023-105',
  sale_balance = 0
WHERE vehicle_number = 'DL08 WX 3141';

UPDATE vehicles SET 
  sale_date = '2023-11-18',
  selling_price = 155000,
  buyer_name = 'Donna Paulsen',
  buyer_contact = '555-0106',
  buyer_place = 'Mohali',
  sale_bill = 'S-2023-106',
  sale_balance = 10000,
  financier_name = 'Bajaj Finserv',
  financier_amount = 120000,
  finance_credited_date = '2023-11-25'
WHERE vehicle_number = 'PB65 ZY 5151';

-- Insert sample expenses
INSERT INTO expenses (vehicle_id, amount, description, date) 
SELECT 
  v.id,
  CASE 
    WHEN v.vehicle_number = 'KL10 AB 1234' AND expense_type = 1 THEN 1500
    WHEN v.vehicle_number = 'KL10 AB 1234' AND expense_type = 2 THEN 500
    WHEN v.vehicle_number = 'KA05 MN 9101' THEN 2500
    WHEN v.vehicle_number = 'PB65 ZY 5151' THEN 800
    WHEN v.vehicle_number = 'DL08 WX 3141' THEN 300
  END as amount,
  CASE 
    WHEN v.vehicle_number = 'KL10 AB 1234' AND expense_type = 1 THEN 'New Tyre'
    WHEN v.vehicle_number = 'KL10 AB 1234' AND expense_type = 2 THEN 'Polishing'
    WHEN v.vehicle_number = 'KA05 MN 9101' THEN 'Engine service'
    WHEN v.vehicle_number = 'PB65 ZY 5151' THEN 'Petrol'
    WHEN v.vehicle_number = 'DL08 WX 3141' THEN 'Mirror replacement'
  END as description,
  CASE 
    WHEN v.vehicle_number = 'KL10 AB 1234' AND expense_type = 1 THEN '2023-11-10'::date
    WHEN v.vehicle_number = 'KL10 AB 1234' AND expense_type = 2 THEN '2023-11-12'::date
    WHEN v.vehicle_number = 'KA05 MN 9101' THEN '2023-11-22'::date
    WHEN v.vehicle_number = 'PB65 ZY 5151' THEN '2023-11-15'::date
    WHEN v.vehicle_number = 'DL08 WX 3141' THEN '2023-10-20'::date
  END as date
FROM vehicles v
CROSS JOIN (SELECT 1 as expense_type UNION SELECT 2) e
WHERE 
  (v.vehicle_number = 'KL10 AB 1234') OR
  (v.vehicle_number = 'KA05 MN 9101' AND e.expense_type = 1) OR
  (v.vehicle_number = 'PB65 ZY 5151' AND e.expense_type = 1) OR
  (v.vehicle_number = 'DL08 WX 3141' AND e.expense_type = 1);