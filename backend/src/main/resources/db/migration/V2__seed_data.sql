INSERT INTO stores (name, password, role, email, address, balance, reserved_balance, total_spent, whale_pass, pass_id)
VALUES
('Carrefour',   '1234',  'STORE', 'carrefour@mail.com',   'Paris',     1000.00, 0.00,   0.00,   false, NULL),
('Auchan',      '1234',  'STORE', 'auchan@mail.com',      'Lyon',      1500.00, 0.00, 200.00,   true,  1),
('Leclerc',     '1234',  'STORE', 'leclerc@mail.com',     'Marseille',  800.00, 50.00, 100.00,  false, NULL),
('Intermarche', '1234',  'STORE', 'intermarche@mail.com', 'Toulouse',  1200.00, 0.00, 300.00,   true,  2),
('Casino',      '1234',  'STORE', 'casino@mail.com',      'Nice',       600.00, 0.00,  50.00,   false, NULL),
('Monoprix',    '1234',  'STORE', 'monoprix@mail.com',    'Paris',     2000.00, 100.00, 500.00, true,  3),
('Franprix',    '1234',  'STORE', 'franprix@mail.com',    'Paris',      400.00, 0.00,  20.00,   false, NULL),
('Lidl',        '1234',  'STORE', 'lidl@mail.com',        'Lille',      900.00, 0.00, 150.00,   false, NULL),
('Aldi',        '1234',  'STORE', 'aldi@mail.com',        'Bordeaux',   700.00, 0.00,  80.00,   false, NULL),
('Admin',       'admin', 'ADMIN', 'admin@delivery.com',   'HQ',           0.00, 0.00,   0.00,   false, NULL);


INSERT INTO delivery_slots (id, start_time, end_time, capacity, status)
VALUES
(1, NOW() + INTERVAL '2 hours',  NOW() + INTERVAL '4 hours',  10, 'OPEN'),
(2, NOW() + INTERVAL '5 hours',  NOW() + INTERVAL '7 hours',  10, 'OPEN'),
(3, NOW() + INTERVAL '8 hours',  NOW() + INTERVAL '10 hours', 10, 'OPEN');

SELECT setval(pg_get_serial_sequence('delivery_slots', 'id'), 4, false);


INSERT INTO auctions (start_price, start_time, end_time, status, delivery_slot_id)
VALUES
(10.0, NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '30 minutes', 'OPEN',    1),
(20.0, NOW() - INTERVAL '10 minutes', NOW() + INTERVAL '50 minutes', 'OPEN',    2),
(15.0, NOW() - INTERVAL '60 minutes', NOW() - INTERVAL '5 minutes',  'CLOSED',  3),
(50.0, NOW() + INTERVAL '10 minutes', NOW() + INTERVAL '70 minutes', 'PENDING', 1),
(5.0,  NOW() + INTERVAL '20 minutes', NOW() + INTERVAL '80 minutes', 'PENDING', 2);
