USE fuel_station_db;

-- =========================================================
-- STATION
-- =========================================================

INSERT INTO stations (
    name,
    code,
    location,
    phone,
    currency
)
VALUES (
    'GOIL Fuel Station',
    'GOIL-001',
    'Ghana',
    '',
    'GHS'
);

-- =========================================================
-- FUEL TYPES
-- =========================================================

INSERT INTO fuel_types (
    code,
    name,
    unit
)
VALUES
    ('PMS', 'Super Petrol', 'litre'),
    ('AGO', 'Diesel', 'litre');

-- =========================================================
-- FUEL PRICES
-- =========================================================

INSERT INTO fuel_prices (
    station_id,
    fuel_type_id,
    price_per_litre,
    effective_from
)
SELECT
    s.id,
    f.id,
    CASE
        WHEN f.code = 'PMS' THEN 0.00
        WHEN f.code = 'AGO' THEN 0.00
    END,
    NOW()
FROM stations s
CROSS JOIN fuel_types f
WHERE s.code = 'GOIL-001';

-- =========================================================
-- PUMPS
-- =========================================================

INSERT INTO pumps (
    station_id,
    pump_number,
    name
)
SELECT
    id,
    1,
    'Pump 1'
FROM stations
WHERE code = 'GOIL-001';

INSERT INTO pumps (
    station_id,
    pump_number,
    name
)
SELECT
    id,
    2,
    'Pump 2'
FROM stations
WHERE code = 'GOIL-001';

INSERT INTO pumps (
    station_id,
    pump_number,
    name
)
SELECT
    id,
    3,
    'Pump 3'
FROM stations
WHERE code = 'GOIL-001';

INSERT INTO pumps (
    station_id,
    pump_number,
    name
)
SELECT
    id,
    4,
    'Pump 4'
FROM stations
WHERE code = 'GOIL-001';

-- =========================================================
-- NOZZLES
-- =========================================================

-- Pump 1
INSERT INTO nozzles (
    pump_id,
    fuel_type_id,
    nozzle_number,
    name
)
SELECT
    p.id,
    f.id,
    1,
    'Pump 1 - Super'
FROM pumps p
JOIN fuel_types f ON f.code = 'PMS'
JOIN stations s ON s.id = p.station_id
WHERE p.pump_number = 1
  AND s.code = 'GOIL-001';

INSERT INTO nozzles (
    pump_id,
    fuel_type_id,
    nozzle_number,
    name
)
SELECT
    p.id,
    f.id,
    2,
    'Pump 1 - Diesel'
FROM pumps p
JOIN fuel_types f ON f.code = 'AGO'
JOIN stations s ON s.id = p.station_id
WHERE p.pump_number = 1
  AND s.code = 'GOIL-001';

-- Pump 2
INSERT INTO nozzles (
    pump_id,
    fuel_type_id,
    nozzle_number,
    name
)
SELECT
    p.id,
    f.id,
    1,
    'Pump 2 - Diesel'
FROM pumps p
JOIN fuel_types f ON f.code = 'AGO'
JOIN stations s ON s.id = p.station_id
WHERE p.pump_number = 2
  AND s.code = 'GOIL-001';

-- Pump 3
INSERT INTO nozzles (
    pump_id,
    fuel_type_id,
    nozzle_number,
    name
)
SELECT
    p.id,
    f.id,
    1,
    'Pump 3 - Super 1'
FROM pumps p
JOIN fuel_types f ON f.code = 'PMS'
JOIN stations s ON s.id = p.station_id
WHERE p.pump_number = 3
  AND s.code = 'GOIL-001';

INSERT INTO nozzles (
    pump_id,
    fuel_type_id,
    nozzle_number,
    name
)
SELECT
    p.id,
    f.id,
    2,
    'Pump 3 - Super 2'
FROM pumps p
JOIN fuel_types f ON f.code = 'PMS'
JOIN stations s ON s.id = p.station_id
WHERE p.pump_number = 3
  AND s.code = 'GOIL-001';

INSERT INTO nozzles (
    pump_id,
    fuel_type_id,
    nozzle_number,
    name
)
SELECT
    p.id,
    f.id,
    3,
    'Pump 3 - Diesel 1'
FROM pumps p
JOIN fuel_types f ON f.code = 'AGO'
JOIN stations s ON s.id = p.station_id
WHERE p.pump_number = 3
  AND s.code = 'GOIL-001';

INSERT INTO nozzles (
    pump_id,
    fuel_type_id,
    nozzle_number,
    name
)
SELECT
    p.id,
    f.id,
    4,
    'Pump 3 - Diesel 2'
FROM pumps p
JOIN fuel_types f ON f.code = 'AGO'
JOIN stations s ON s.id = p.station_id
WHERE p.pump_number = 3
  AND s.code = 'GOIL-001';

INSERT INTO nozzles (
    pump_id,
    fuel_type_id,
    nozzle_number,
    name
)
SELECT
    p.id,
    f.id,
    5,
    'Pump 3 - Diesel 3'
FROM pumps p
JOIN fuel_types f ON f.code = 'AGO'
JOIN stations s ON s.id = p.station_id
WHERE p.pump_number = 3
  AND s.code = 'GOIL-001';

INSERT INTO nozzles (
    pump_id,
    fuel_type_id,
    nozzle_number,
    name
)
SELECT
    p.id,
    f.id,
    6,
    'Pump 3 - Diesel 4'
FROM pumps p
JOIN fuel_types f ON f.code = 'AGO'
JOIN stations s ON s.id = p.station_id
WHERE p.pump_number = 3
  AND s.code = 'GOIL-001';

-- Pump 4
INSERT INTO nozzles (
    pump_id,
    fuel_type_id,
    nozzle_number,
    name
)
SELECT
    p.id,
    f.id,
    1,
    'Pump 4 - Super'
FROM pumps p
JOIN fuel_types f ON f.code = 'PMS'
JOIN stations s ON s.id = p.station_id
WHERE p.pump_number = 4
  AND s.code = 'GOIL-001';

INSERT INTO nozzles (
    pump_id,
    fuel_type_id,
    nozzle_number,
    name
)
SELECT
    p.id,
    f.id,
    2,
    'Pump 4 - Diesel'
FROM pumps p
JOIN fuel_types f ON f.code = 'AGO'
JOIN stations s ON s.id = p.station_id
WHERE p.pump_number = 4
  AND s.code = 'GOIL-001';

-- =========================================================
-- TANKS
-- =========================================================

INSERT INTO tanks (
    station_id,
    tank_number,
    name,
    fuel_type_id,
    capacity_litres
)
SELECT
    s.id,
    1,
    'PMS Tank 1',
    f.id,
    30000
FROM stations s
JOIN fuel_types f ON f.code = 'PMS'
WHERE s.code = 'GOIL-001';

INSERT INTO tanks (
    station_id,
    tank_number,
    name,
    fuel_type_id,
    capacity_litres
)
SELECT
    s.id,
    2,
    'Diesel Tank 1',
    f.id,
    30000
FROM stations s
JOIN fuel_types f ON f.code = 'AGO'
WHERE s.code = 'GOIL-001';