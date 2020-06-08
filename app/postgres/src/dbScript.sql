
-- Create Table vehicles
CREATE TABLE IF NOT EXISTS vehicles(
   id INTEGER PRIMARY KEY,
   class VARCHAR(255) NOT NULL,
   make VARCHAR(255) NOT NULL,
   model VARCHAR(255) NOT NULL
);

INSERT INTO vehicles VALUES (1, 'truck', 'toyota', 'tacoma') ON CONFLICT (id) DO NOTHING;
INSERT INTO vehicles VALUES (2, 'car', 'volkswagen', 'gti') ON CONFLICT (id) DO NOTHING;
