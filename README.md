# REST API vs GraphQL — Performance Benchmark on Digital News Application

> A comparative study measuring **latency**, **payload size**, **HTTP request count**, and **throughput** between REST API and GraphQL architectures on nested data structures.

---

## Key Results

| Metric | REST API | GraphQL | Winner |
|---|---|---|---|
| Average latency (nested query) | 631 ms | **246 ms** | GraphQL ✓ |
| Payload size | 3.72 KB | **367 B** | GraphQL ✓ |
| HTTP requests per full fetch | 3 requests | **1 request** | GraphQL ✓ |
| Error rate (10 concurrent users) | **100%** | 0% | GraphQL ✓ |
| Throughput (10 concurrent users) | — | **120.79 req/s** | GraphQL ✓ |

GraphQL was **2.5× faster** and **10× more payload-efficient** than REST API in nested data scenarios.

---

## Overview

Modern digital news applications demand fast and responsive data retrieval, especially for nested data structures (articles → authors → categories → comments). REST API — despite its widespread adoption — suffers from **over-fetching** and **under-fetching** in these scenarios.

This project implements both architectures on the same dataset and rigorously benchmarks them across 5 test scenarios using **Postman** (baseline) and **Apache JMeter** (load testing).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| REST API | Express.js |
| GraphQL | Apollo Server |
| Dataset | Indonesian News Dataset (restructured) |
| Baseline testing | Postman |
| Load testing | Apache JMeter |
| Tunneling | ngrok |

---

## Dataset Structure

The Indonesian News Dataset was restructured into relational entities to simulate realistic nested data scenarios:

```
Article
  ├── Author
  ├── Category
  └── Comments[]
```

The restructuring was done using a custom `restructure.js` script that transforms flat raw data into normalized relational tables — this is the ETL component of the project.

---

## Test Scenarios

| Scenario | Description |
|---|---|
| 1 | Single article with nested author |
| 2 | Article with nested category |
| 3 | Full nested query: article + author + category |
| 4 | Multi-article batch with nested data |
| 5 | Load test: 1 user, 2 users, 10 concurrent users |

---

## Notable Findings

**On latency:**
- REST API accumulated 631 ms across 3 separate HTTP requests to fetch nested data
- GraphQL completed the same fetch in a single request at 246 ms

**On payload size:**
- REST API returned 3.72 KB including unnecessary fields (over-fetching)
- GraphQL returned exactly the requested fields: 367 B

**On stability under load:**
- At 10 concurrent users, REST API reached 100% error rate — complete failure
- GraphQL maintained 0% error rate with 120.79 req/s throughput and 76 ms latency

---

## Project Structure

```
├── rest-api/
│   ├── server.js          # Express.js REST API server
│   ├── routes/
│   │   ├── articles.js
│   │   ├── authors.js
│   │   └── categories.js
│   └── db/
│       └── connection.js
├── graphql/
│   ├── server.js          # Apollo Server
│   ├── schema/
│   │   └── typeDefs.js    # GraphQL schema definitions
│   └── resolvers/
│       └── index.js
├── dataset/
│   ├── raw/               # Original Indonesian News Dataset
│   └── restructured/      # Normalized relational tables
├── scripts/
│   └── restructure.js     # ETL script: raw data → relational structure
└── tests/
    ├── postman/           # Postman collection (baseline)
    └── jmeter/            # JMeter test plans (load testing)
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MySQL 8.0+
- Apache JMeter (for load testing)
- ngrok (for remote testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/ahmadmuzakkialey/rest-vs-graphql-news.git
cd rest-vs-graphql-news

# Install dependencies
npm install

# Configure database
cp .env.example .env
# Edit .env with your MySQL credentials

# Run ETL: restructure raw dataset
node scripts/restructure.js

# Start REST API server
node rest-api/server.js

# Start GraphQL server (in a new terminal)
node graphql/server.js
```

---

## Environment

| Component | Spec |
|---|---|
| Server laptop | [your server spec here] |
| Client laptop | [your client spec here] |
| Network | Two devices on separate internet connections |
| Tunneling | ngrok |

---

## Conclusion

GraphQL is the recommended architecture for digital news applications with complex nested data structures, particularly under high-load conditions. REST API remains suitable for simple, flat data retrieval with low concurrency.

---

## Author

**Ahmad Muzakki Aley**
Teknik Informatika — STMIK IKMI Cirebon, 2026

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/ahmadmuzakkialey)
[![Email](https://img.shields.io/badge/Email-ahmadmuzakkialey@gmail.com-red)](mailto:ahmadmuzakkialey@gmail.com)

---

## Certifications

- Data Engineering Master Certification — RapidMiner (Altair)
- Data Engineering Professional Certification — RapidMiner (Altair)
- Programming Essentials in Python — Cisco / OpenEDG Python Institute
- Linux Essentials — Cisco Networking Academy
- Junior Network Administrator — VSGA Digital Talent Scholarship, Kominfo

---

## Related Research

This project is based on a thesis submitted to STMIK IKMI Cirebon (2026). The research contributes to the growing body of comparative studies on REST vs GraphQL, specifically in the context of Indonesian news media applications and high-concurrency scenarios.

Keywords: `GraphQL` `REST API` `Node.js` `Apollo Server` `Express.js` `Performance Benchmarking` `Data Engineering` `ETL`
