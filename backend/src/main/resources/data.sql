INSERT INTO stores (name, password, role, email, address, balance, reserved_balance, total_spent, whale_pass, pass_id)
VALUES
('Carrefour', '1234', 'STORE', 'carrefour@mail.com', 'Paris', 1000.00, 0.00, 0.00, false, NULL),

('Auchan', '1234', 'STORE', 'auchan@mail.com', 'Lyon', 1500.00, 0.00, 200.00, true, 1),

('Leclerc', '1234', 'STORE', 'leclerc@mail.com', 'Marseille', 800.00, 50.00, 100.00, false, NULL),

('Intermarche', '1234', 'STORE', 'intermarche@mail.com', 'Toulouse', 1200.00, 0.00, 300.00, true, 2),

('Casino', '1234', 'STORE', 'casino@mail.com', 'Nice', 600.00, 0.00, 50.00, false, NULL),

('Monoprix', '1234', 'STORE', 'monoprix@mail.com', 'Paris', 2000.00, 100.00, 500.00, true, 3),

('Franprix', '1234', 'STORE', 'franprix@mail.com', 'Paris', 400.00, 0.00, 20.00, false, NULL),

('Lidl', '1234', 'STORE', 'lidl@mail.com', 'Lille', 900.00, 0.00, 150.00, false, NULL),

('Aldi', '1234', 'STORE', 'aldi@mail.com', 'Bordeaux', 700.00, 0.00, 80.00, false, NULL),

('Admin', 'admin', 'ADMIN', 'admin@delivery.com', 'HQ', 0.00, 0.00, 0.00, false, NULL);


INSERT INTO delivery_slots (id, start_time, end_time, capacity, status)
VALUES
(1, TIMESTAMP '2026-04-23 14:00:00', TIMESTAMP '2026-04-23 15:00:00', 10, 'OPEN'),
(2, TIMESTAMP '2026-04-23 15:00:00', TIMESTAMP '2026-04-23 16:00:00', 10, 'OPEN'),
(3, TIMESTAMP '2026-04-23 16:00:00', TIMESTAMP '2026-04-23 17:00:00', 10, 'OPEN');


INSERT INTO auctions (start_price, start_time, end_time, status, delivery_slot_id)
VALUES
(10.0, TIMESTAMP '2026-04-23 14:50:35', TIMESTAMP '2026-04-23 14:59:35', 'PENDING', 1),
(20.0, TIMESTAMP '2026-04-23 15:00:00', TIMESTAMP '2026-04-23 15:10:00', 'OPEN', 2),
(15.0, TIMESTAMP '2026-04-23 15:15:00', TIMESTAMP '2026-04-23 15:25:00', 'CLOSED', 3),
(50.0, TIMESTAMP '2026-04-23 16:00:00', TIMESTAMP '2026-04-23 16:10:00', 'OPEN', 1),
(5.0, TIMESTAMP '2026-04-23 16:15:00', TIMESTAMP '2026-04-23 16:20:00', 'PENDING', 2);
