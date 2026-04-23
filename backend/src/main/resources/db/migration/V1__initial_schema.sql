CREATE TABLE stores (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255),
    role        VARCHAR(50),
    email       VARCHAR(255) NOT NULL UNIQUE,
    address     VARCHAR(255),
    balance     DECIMAL(19, 2),
    reserved_balance DECIMAL(19, 2),
    total_spent DECIMAL(19, 2),
    whale_pass  BOOLEAN,
    pass_id     BIGINT
);

CREATE TABLE delivery_slots (
    id         BIGSERIAL PRIMARY KEY,
    start_time TIMESTAMP,
    end_time   TIMESTAMP,
    capacity   INTEGER,
    status     VARCHAR(50)
);

CREATE TABLE auctions (
    id               BIGSERIAL PRIMARY KEY,
    start_price      REAL,
    start_time       TIMESTAMP,
    end_time         TIMESTAMP,
    status           VARCHAR(50),
    delivery_slot_id BIGINT REFERENCES delivery_slots(id)
);

CREATE INDEX idx_auctions_status ON auctions(status);

CREATE TABLE bids (
    id         BIGSERIAL PRIMARY KEY,
    amount     DOUBLE PRECISION NOT NULL,
    timestamp  TIMESTAMP NOT NULL,
    status     VARCHAR(50) NOT NULL,
    store_id   BIGINT NOT NULL REFERENCES stores(id),
    auction_id BIGINT NOT NULL REFERENCES auctions(id)
);

CREATE INDEX idx_bids_auction_amount ON bids(auction_id, amount DESC);

CREATE TABLE deliveries (
    id               BIGSERIAL PRIMARY KEY,
    address          VARCHAR(255) NOT NULL,
    status           VARCHAR(50) NOT NULL,
    delivery_company VARCHAR(255) NOT NULL,
    store_id         BIGINT NOT NULL REFERENCES stores(id),
    delivery_slot_id BIGINT REFERENCES delivery_slots(id)
);
