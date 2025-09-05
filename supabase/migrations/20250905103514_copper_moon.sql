/*
  # Clean database - Remove all sample data

  1. Clean Up
    - Remove all existing sample data from vehicles table
    - Remove all existing sample data from expenses table
    - Keep table structure intact for production use

  2. Reset
    - Start with clean tables ready for real data
*/

-- Remove all sample data from expenses table first (due to foreign key constraint)
DELETE FROM expenses WHERE true;

-- Remove all sample data from vehicles table
DELETE FROM vehicles WHERE true;

-- Reset sequences if needed (PostgreSQL will handle UUID generation automatically)
-- Tables are now clean and ready for production data