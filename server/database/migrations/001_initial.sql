-- 001_initial.sql
-- Baseline schema. NEVER edit this file after it has shipped to a customer.
-- Any later schema change goes in a new numbered file (002_..., 003_...).

CREATE TABLE stations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    location VARCHAR(255),
    phone VARCHAR(50),
    currency VARCHAR(10) NOT NULL DEFAULT 'GHS',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id INT UNSIGNED NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','MANAGER','SUPERVISOR','ATTENDANT','ACCOUNTANT')
        NOT NULL DEFAULT 'ATTENDANT',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_station
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE SET NULL
);

CREATE TABLE attendants (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NULL,
    employee_number VARCHAR(50),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_attendant_employee_number (station_id, employee_number),
    CONSTRAINT fk_attendants_station
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE RESTRICT,
    CONSTRAINT fk_attendants_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE fuel_types (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL DEFAULT 'litre',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fuel_prices (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id INT UNSIGNED NOT NULL,
    fuel_type_id INT UNSIGNED NOT NULL,
    price_per_litre DECIMAL(12,2) NOT NULL,
    effective_from DATETIME NOT NULL,
    effective_to DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fuel_prices_station
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
    CONSTRAINT fk_fuel_prices_fuel
        FOREIGN KEY (fuel_type_id) REFERENCES fuel_types(id) ON DELETE RESTRICT
);

CREATE TABLE pumps (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id INT UNSIGNED NOT NULL,
    pump_number INT UNSIGNED NOT NULL,
    name VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_station_pump (station_id, pump_number),
    CONSTRAINT fk_pumps_station
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);

CREATE TABLE nozzles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pump_id INT UNSIGNED NOT NULL,
    fuel_type_id INT UNSIGNED NOT NULL,
    nozzle_number INT UNSIGNED NOT NULL,
    name VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_pump_nozzle (pump_id, nozzle_number),
    CONSTRAINT fk_nozzles_pump
        FOREIGN KEY (pump_id) REFERENCES pumps(id) ON DELETE CASCADE,
    CONSTRAINT fk_nozzles_fuel
        FOREIGN KEY (fuel_type_id) REFERENCES fuel_types(id) ON DELETE RESTRICT
);

CREATE TABLE tanks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id INT UNSIGNED NOT NULL,
    tank_number INT UNSIGNED NOT NULL,
    name VARCHAR(100),
    fuel_type_id INT UNSIGNED NOT NULL,
    capacity_litres DECIMAL(14,3) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_station_tank (station_id, tank_number),
    CONSTRAINT fk_tanks_station
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
    CONSTRAINT fk_tanks_fuel
        FOREIGN KEY (fuel_type_id) REFERENCES fuel_types(id) ON DELETE RESTRICT
);

CREATE TABLE shifts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id INT UNSIGNED NOT NULL,
    shift_date DATE NOT NULL,
    shift_type ENUM('MORNING','AFTERNOON','NIGHT') NOT NULL,
    manager_id INT UNSIGNED NULL,
    status ENUM('OPEN','CLOSED','LOCKED') NOT NULL DEFAULT 'OPEN',
    opened_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shifts_station
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
    CONSTRAINT fk_shifts_manager
        FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE shift_assignments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    shift_id INT UNSIGNED NOT NULL,
    nozzle_id INT UNSIGNED NOT NULL,
    attendant_id INT UNSIGNED NOT NULL,
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_shift_nozzle (shift_id, nozzle_id),
    CONSTRAINT fk_shift_assignments_shift
        FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_assignments_nozzle
        FOREIGN KEY (nozzle_id) REFERENCES nozzles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_shift_assignments_attendant
        FOREIGN KEY (attendant_id) REFERENCES attendants(id) ON DELETE RESTRICT
);

CREATE TABLE pump_readings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    shift_id INT UNSIGNED NOT NULL,
    nozzle_id INT UNSIGNED NOT NULL,
    attendant_id INT UNSIGNED NOT NULL,
    opening_reading DECIMAL(14,3) NOT NULL,
    closing_reading DECIMAL(14,3) NOT NULL,
    litres_sold DECIMAL(14,3)
        GENERATED ALWAYS AS (closing_reading - opening_reading) STORED,
    unit_price DECIMAL(12,2) NOT NULL,
    sales_amount DECIMAL(14,2)
        GENERATED ALWAYS AS ((closing_reading - opening_reading) * unit_price) STORED,
    recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_shift_nozzle_reading (shift_id, nozzle_id),
    CONSTRAINT fk_pump_readings_shift
        FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
    CONSTRAINT fk_pump_readings_nozzle
        FOREIGN KEY (nozzle_id) REFERENCES nozzles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pump_readings_attendant
        FOREIGN KEY (attendant_id) REFERENCES attendants(id) ON DELETE RESTRICT
);

CREATE TABLE sales (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id INT UNSIGNED NOT NULL,
    shift_id INT UNSIGNED NOT NULL,
    attendant_id INT UNSIGNED NULL,
    customer_id INT UNSIGNED NULL,
    sale_type ENUM('PUMP','CREDIT','OTHER') NOT NULL DEFAULT 'PUMP',
    total_litres DECIMAL(14,3) NOT NULL DEFAULT 0,
    total_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    payment_status ENUM('UNPAID','PARTIAL','PAID','CREDIT') NOT NULL DEFAULT 'PAID',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sales_station
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE RESTRICT,
    CONSTRAINT fk_sales_shift
        FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_sales_attendant
        FOREIGN KEY (attendant_id) REFERENCES attendants(id) ON DELETE SET NULL
);

CREATE TABLE sale_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sale_id BIGINT UNSIGNED NOT NULL,
    fuel_type_id INT UNSIGNED NOT NULL,
    nozzle_id INT UNSIGNED NULL,
    litres DECIMAL(14,3) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
    CONSTRAINT fk_sale_items_sale
        FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    CONSTRAINT fk_sale_items_fuel
        FOREIGN KEY (fuel_type_id) REFERENCES fuel_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_sale_items_nozzle
        FOREIGN KEY (nozzle_id) REFERENCES nozzles(id) ON DELETE SET NULL
);

CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id INT UNSIGNED NOT NULL,
    shift_id INT UNSIGNED NOT NULL,
    sale_id BIGINT UNSIGNED NULL,
    attendant_id INT UNSIGNED NULL,
    payment_method ENUM('CASH','MOMO','CARD','COUPON','CREDIT') NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
    reference VARCHAR(150),
    received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_station
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE RESTRICT,
    CONSTRAINT fk_payments_shift
        FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_payments_sale
        FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE SET NULL,
    CONSTRAINT fk_payments_attendant
        FOREIGN KEY (attendant_id) REFERENCES attendants(id) ON DELETE SET NULL
);

CREATE TABLE expenses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id INT UNSIGNED NOT NULL,
    shift_id INT UNSIGNED NULL,
    attendant_id INT UNSIGNED NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
    paid_from ENUM('OFFICE_CASH','ATTENDANT_CASH') NOT NULL DEFAULT 'OFFICE_CASH',
    category VARCHAR(100),
    approved_by INT UNSIGNED NULL,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expenses_station
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE RESTRICT,
    CONSTRAINT fk_expenses_shift
        FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    CONSTRAINT fk_expenses_attendant
        FOREIGN KEY (attendant_id) REFERENCES attendants(id) ON DELETE SET NULL,
    CONSTRAINT fk_expenses_approver
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE customers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id INT UNSIGNED NOT NULL,
    customer_code VARCHAR(50),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    credit_limit DECIMAL(14,2) NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_customer_code (station_id, customer_code),
    CONSTRAINT fk_customers_station
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);

CREATE TABLE credit_sales (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED NOT NULL,
    shift_id INT UNSIGNED NOT NULL,
    attendant_id INT UNSIGNED NULL,
    fuel_type_id INT UNSIGNED NOT NULL,
    litres DECIMAL(14,3) NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
    approved_by INT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_credit_sales_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_credit_sales_shift
        FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_credit_sales_attendant
        FOREIGN KEY (attendant_id) REFERENCES attendants(id) ON DELETE SET NULL,
    CONSTRAINT fk_credit_sales_fuel
        FOREIGN KEY (fuel_type_id) REFERENCES fuel_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_credit_sales_approver
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE customer_payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED NOT NULL,
    credit_sale_id BIGINT UNSIGNED NULL,
    amount DECIMAL(14,2) NOT NULL,
    payment_method ENUM('CASH','MOMO','CARD','BANK_TRANSFER') NOT NULL DEFAULT 'CASH',
    reference VARCHAR(150),
    received_by INT UNSIGNED NULL,
    received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_payments_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_customer_payments_credit_sale
        FOREIGN KEY (credit_sale_id) REFERENCES credit_sales(id) ON DELETE SET NULL,
    CONSTRAINT fk_customer_payments_receiver
        FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE fuel_receipts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id INT UNSIGNED NOT NULL,
    supplier_name VARCHAR(150) NOT NULL,
    receipt_number VARCHAR(100) NOT NULL,
    received_at DATETIME NOT NULL,
    total_cost DECIMAL(14,2) NOT NULL DEFAULT 0,
    created_by INT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_receipt_number (station_id, receipt_number),
    CONSTRAINT fk_fuel_receipts_station
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE RESTRICT,
    CONSTRAINT fk_fuel_receipts_creator
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE fuel_receipt_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    receipt_id BIGINT UNSIGNED NOT NULL,
    tank_id INT UNSIGNED NOT NULL,
    fuel_type_id INT UNSIGNED NOT NULL,
    litres DECIMAL(14,3) NOT NULL,
    cost_per_litre DECIMAL(12,2) NOT NULL,
    total_cost DECIMAL(14,2) NOT NULL,
    CONSTRAINT fk_receipt_items_receipt
        FOREIGN KEY (receipt_id) REFERENCES fuel_receipts(id) ON DELETE CASCADE,
    CONSTRAINT fk_receipt_items_tank
        FOREIGN KEY (tank_id) REFERENCES tanks(id) ON DELETE RESTRICT,
    CONSTRAINT fk_receipt_items_fuel
        FOREIGN KEY (fuel_type_id) REFERENCES fuel_types(id) ON DELETE RESTRICT
);

CREATE TABLE tank_readings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tank_id INT UNSIGNED NOT NULL,
    shift_id INT UNSIGNED NULL,
    reading_date DATE NOT NULL,
    opening_litres DECIMAL(14,3) NOT NULL DEFAULT 0,
    closing_litres DECIMAL(14,3) NOT NULL DEFAULT 0,
    dip_litres DECIMAL(14,3) NOT NULL DEFAULT 0,
    recorded_by INT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tank_readings_tank
        FOREIGN KEY (tank_id) REFERENCES tanks(id) ON DELETE RESTRICT,
    CONSTRAINT fk_tank_readings_shift
        FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    CONSTRAINT fk_tank_readings_user
        FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE shift_closings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    shift_id INT UNSIGNED NOT NULL UNIQUE,
    expected_sales DECIMAL(14,2) NOT NULL DEFAULT 0,
    actual_cash DECIMAL(14,2) NOT NULL DEFAULT 0,
    total_momo DECIMAL(14,2) NOT NULL DEFAULT 0,
    total_card DECIMAL(14,2) NOT NULL DEFAULT 0,
    total_coupon DECIMAL(14,2) NOT NULL DEFAULT 0,
    total_credit DECIMAL(14,2) NOT NULL DEFAULT 0,
    total_expenses DECIMAL(14,2) NOT NULL DEFAULT 0,
    variance DECIMAL(14,2) NOT NULL DEFAULT 0,
    closed_by INT UNSIGNED NULL,
    closed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    CONSTRAINT fk_shift_closings_shift
        FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
    CONSTRAINT fk_shift_closings_user
        FOREIGN KEY (closed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NULL,
    station_id INT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(100),
    description TEXT,
    ip_address VARCHAR(45),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_logs_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_audit_logs_station
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE SET NULL
);

CREATE INDEX idx_shifts_station_date ON shifts(station_id, shift_date);
CREATE INDEX idx_pump_readings_shift ON pump_readings(shift_id);
CREATE INDEX idx_sales_shift ON sales(shift_id);
CREATE INDEX idx_sales_created ON sales(created_at);
CREATE INDEX idx_payments_shift ON payments(shift_id);
CREATE INDEX idx_expenses_shift ON expenses(shift_id);
CREATE INDEX idx_customer_payments_customer ON customer_payments(customer_id);
CREATE INDEX idx_tank_readings_tank_date ON tank_readings(tank_id, reading_date);
