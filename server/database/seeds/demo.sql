-- Demo data for development only. Real customers are configured through
-- the setup wizard (coming later), not through this file.

INSERT INTO stations (name, code, location, phone, currency)
VALUES ('Demo Fuel Station', 'DEMO-001', 'Ghana', '', 'GHS');

INSERT INTO fuel_types (code, name, unit)
VALUES ('PMS', 'Super Petrol', 'litre'), ('AGO', 'Diesel', 'litre');

INSERT INTO fuel_prices (station_id, fuel_type_id, price_per_litre, effective_from)
SELECT s.id, f.id, 0.00, NOW()
FROM stations s CROSS JOIN fuel_types f
WHERE s.code = 'DEMO-001';

INSERT INTO pumps (station_id, pump_number, name)
SELECT s.id, v.n, CONCAT('Pump ', v.n)
FROM stations s
JOIN (SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) v
WHERE s.code = 'DEMO-001';

INSERT INTO nozzles (pump_id, fuel_type_id, nozzle_number, name)
SELECT p.id, f.id, v.nozzle_number, v.name
FROM (
  SELECT 1 AS pump_number, 'PMS' AS fuel, 1 AS nozzle_number, 'Pump 1 - Super' AS name
  UNION ALL SELECT 1, 'AGO', 2, 'Pump 1 - Diesel'
  UNION ALL SELECT 2, 'AGO', 1, 'Pump 2 - Diesel'
  UNION ALL SELECT 3, 'PMS', 1, 'Pump 3 - Super 1'
  UNION ALL SELECT 3, 'PMS', 2, 'Pump 3 - Super 2'
  UNION ALL SELECT 3, 'AGO', 3, 'Pump 3 - Diesel 1'
  UNION ALL SELECT 3, 'AGO', 4, 'Pump 3 - Diesel 2'
  UNION ALL SELECT 3, 'AGO', 5, 'Pump 3 - Diesel 3'
  UNION ALL SELECT 3, 'AGO', 6, 'Pump 3 - Diesel 4'
  UNION ALL SELECT 4, 'PMS', 1, 'Pump 4 - Super'
  UNION ALL SELECT 4, 'AGO', 2, 'Pump 4 - Diesel'
) v
JOIN stations s ON s.code = 'DEMO-001'
JOIN pumps p ON p.station_id = s.id AND p.pump_number = v.pump_number
JOIN fuel_types f ON f.code = v.fuel;

INSERT INTO tanks (station_id, tank_number, name, fuel_type_id, capacity_litres)
SELECT s.id, 1, 'Super Tank', f.id, 45000
FROM stations s JOIN fuel_types f ON f.code = 'PMS' WHERE s.code = 'DEMO-001';

INSERT INTO tanks (station_id, tank_number, name, fuel_type_id, capacity_litres)
SELECT s.id, 2, 'Diesel Tank 1', f.id, 45000
FROM stations s JOIN fuel_types f ON f.code = 'AGO' WHERE s.code = 'DEMO-001';

INSERT INTO tanks (station_id, tank_number, name, fuel_type_id, capacity_litres)
SELECT s.id, 3, 'Diesel Tank 2', f.id, 36000
FROM stations s JOIN fuel_types f ON f.code = 'AGO' WHERE s.code = 'DEMO-001';

INSERT INTO attendants (station_id, full_name)
SELECT s.id, v.name
FROM stations s
JOIN (
  SELECT 'Joseph' AS name UNION ALL SELECT 'Zainabu' UNION ALL SELECT 'Comfort'
  UNION ALL SELECT 'Noah' UNION ALL SELECT 'Francis' UNION ALL SELECT 'Owusu'
  UNION ALL SELECT 'Jesus Lina'
) v
WHERE s.code = 'DEMO-001';
