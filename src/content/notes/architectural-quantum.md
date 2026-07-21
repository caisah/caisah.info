---
title: Architectural Quantum
publishDate: 'Jul 21 2026'
seo:
  title: Architectural Quantum
  description: What is Architectural Quantum and some concrete example
---

<small>While reading Software Architecture: The Hard Parts I encountered this concept</small>[^1]

An **architectural quantum** is an independently deployable unit of software that has high functional cohesion and includes all necessary structural elements to function independently.

Coined by Neal Ford, Rebecca Parsons, and Patrick Kua in *Building Evolutionary Architectures*, a "quantum" defines the boundary within which architectural characteristics (such as scalability, security, database storage, and deployment cycles) operate strictly together.

---

## Core Properties of a Quantum

* **Static Coupling:** The physical code, dependencies, and database schema required for the component to function.
* **Dynamic Coupling:** The runtime communication overhead required to execute a business workflow.
* **Independent Deployability:** A change inside a quantum can be tested, built, and pushed to production without deploying external components.

---

## Concrete Examples

### 1. The Monolithic Architecture (1 Large Quantum)

* **Structure:** A single, large Java `JAR` or C# `.NET` web application that handles authentication, billing, inventory, and reporting, all reading from and writing to a single shared PostgreSQL database.
* **Why it's one quantum:** You cannot deploy the *billing* feature without building and deploying the entire application binary along with any structural changes to the shared relational database. The entire monolith shares a single boundary for scalability, security, and deployment risk.

### 2. A Microservice (1 Small Quantum)

* **Structure:** A payment service written in Go, exposing a REST API, maintaining its own dedicated MongoDB instance, and communicating via a messaging queue.
* **Why it's one quantum:** It contains everything needed to operate: the application code, the runtime dependencies, and the data layer. You can update the payment logic, run database migrations on its private MongoDB, and deploy it without re-deploying any other system service.

### 3. Service-Based Architecture with Shared Database (1 Medium Quantum)

* **Structure:** Four separate application services (User Management, Catalog, Orders, Shipping) running on separate compute instances, but all directly connecting to and sharing a single MySQL database schema.
* **Why it's one quantum (despite separate services):** Because the database schema is shared, a breaking database change introduced by the *Orders* service can break the *Catalog* service. Because these services are statically bound at the data layer, they must be tested and released together as a single unit.

### 4. Event-Driven Distributed Microservices (Multiple Quanta)

* **Structure:** An e-commerce platform where the *Inventory Service* and *Order Service* each have their own databases and interact asynchronously through an Apache Kafka topic.
* **Why it's multiple quanta:** Each service is its own architectural quantum. The *Order Service* can scale up during peak sales, use a document database, and deploy multiple times a day without impacting or requiring deployment of the *Inventory Service*, as long as the message format contract remains intact.

---

## Why Quantum Size Matters

| Quantum Size | Architectural Impact |
| --- | --- |
| **Large Quantum** (Monoliths) | High coupling, slow build/test/deploy cycles, uniform scaling (must scale the whole app to scale one feature), lower operational complexity. |
| **Small Quantum** (Microservices) | Low coupling, fast isolated deployments, granular scaling per component, high operational overhead (distributed logging, networking, eventual consistency). |


[^1]: [Software Architecture: The Hard Parts](https://www.oreilly.com/library/view/software-architecture-the/9781492086888/)
by Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani
