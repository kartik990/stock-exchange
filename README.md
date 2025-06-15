# 📈 Stock Exchange App

A stock exchange web application designed to simulate or manage live trading data with high performance and low latency real-time capabilities.

![Landing Page](assets/banner.png)

---

## 🛠️ Tech Stack

| Layer          | Technology                       |
| -------------- | -------------------------------- |
| Backend        | Node.js, Express, web-sockets    |
| Database       | TimescaleDB (PostgreSQL)         |
| Queue          | Redis                            |
| Frontend       | Next.js, ShadCN, Tailwind        |
| PubSub         | Redis                            |
| Deployment     | Docker, AWS (EC2), nginx         |

---


## 🚀 Features

- Real-time stock ticker updates.
- Order matching engine (buy/sell).
- K-Lines Chart of real time prices. 
- Historical data tracking using TimescaleDB.
- Real time order updates from Engine.
- Responsive and interactive UI built with Next.js
  

![Landing Page](assets/exchange.png)

---


## 🧩 Architecture Overview

![Landing Page](assets/artitecture.png)


This architecture outlines a real-time **Stock Exchange Engine System** centered around an order matching engine. It handles user and market maker (MM) interactions, order execution, and state updates using modern distributed components.

---

## 📦 Components Overview

### 🧠 Engine (Core Matching Engine)
- **Role**: Central component of the system.
- **Responsibilities**:
  - Maintains **stateful in-memory order books**.
  - Processes:
    - Orders (buy/sell)
    - Deposits
    - Withdrawals
  - Publishes real-time updates to:
    - `PubSub` for real-time delivery.
    - `Redis Queue` (`db_processor`) for DB persistence.
- **Consumes**:
  - Incoming requests from `API Server` via `Redis Queue (messages)`.

---

### 🌐 API Server
- **Receives**:
  - Client requests from the **Browser**.
  - Trading inputs from **Market Maker (MM)** bots.
- **Sends**:
  - Messages to the **Redis Queue (`messages`)** for Engine processing.
- **Listens**:
  - To `PubSub` for real-time updates (order status, trades, etc).

---

### 🤖 Market Maker (MM)
- **Interacts with API** to:
  - Provide liquidity.
  - Place automated orders.

---

### 🧾 Redis Queue
- **Queue: `messages`**:
  - Buffers incoming requests from API (clients + MM).
  - Consumed by the Engine.

- **Queue: `db_processor`**:
  - Engine queues processed state updates for DB persistence.
  - Consumed by the DB Processor.

---

### 🔁 PubSub
- **Distributes real-time updates** from Engine to:
  - `API Server` (for REST clients)
  - `WebSocket Server` (for real-time streaming clients)

---

### 🕸️ WebSocket Server (Ws)
- **Connected to Browser** clients.
- **Receives** real-time order updates via `PubSub`.

---

### 🕓 TimeScaleDB
- **Time-series database** to persist:
  - Market data (trades, order books).
  - Engine state over time.

---

### ⚙️ DB Processor
- **Consumes**:
  - Messages from `Redis Queue (db_processor)`
- **Persists**:
  - Data to `TimeScaleDB`

---

## 🔁 Flow Summary

1. **Client / MM → API**: Sends orders, cancels, deposits, withdrawals.
2. **API → Redis Queue (`messages`)**: Buffers messages.
3. **Engine**:
   - Consumes `messages` queue.
   - Processes and maintains state.
   - Publishes:
     - To `PubSub` for real-time updates.
     - To `Redis Queue (db_processor)` for DB.
4. **PubSub**:
   - Broadcasts to `API Server` and `WebSocket`.
5. **WebSocket Server**: Updates browser clients.
6. **DB Processor**:
   - Persists engine updates to `TimeScaleDB`.

