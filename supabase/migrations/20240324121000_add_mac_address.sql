-- Migration: Add mac_address to impressoras
ALTER TABLE impressoras ADD COLUMN mac_address TEXT;
