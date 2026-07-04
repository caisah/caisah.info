---
title: Efferent coupling
publishDate: 'Jul 01 2026'
seo:
  title: Efferent coupling
  description: What is efferent coupling and a concrete example
---

<small>While reading Software Architecture: The Hard Parts I encountered this concept</small>[^1]

Efferent coupling (Ce) measures the number of outgoing dependencies a software module, class, or component has on other external elements. It quantifies how many external structures a module relies upon to compile, execute, or function.

In the context of the 1979 book *Structured Design: Fundamentals of a Discipline of Computer Program and Systems Design* by Edward Yourdon and Larry Constantine, this concept is rooted in their definitions of **fan-out** and **efferent flows**. Yourdon and Constantine mapped systems by identifying efferent branches—the outgoing parts of a system architecture where processed data is passed outward. Modern software engineering formalized these exact structural principles into the "Efferent Coupling" metric to evaluate architectural stability.

**Measurement**
Ce is calculated by counting every distinct external module, class, interface, or data structure referenced by the target module. This includes:

* Inheritance relationships
* Implemented interfaces
* Method parameter types
* Return types
* Instantiated local variables
* Thrown exceptions

## A concrete calculation of Efferent Coupling (Ce) using a standard Object-Oriented structure.

By convention, metric tools typically exclude standard language libraries (like `String` or `List`) and count only domain-specific or third-party dependencies.

### **The Target Module: `OrderProcessor**`

```java
// 1. Implements external interface
public class OrderProcessor implements IProcessor {

    // 2. Field dependency
    private PaymentGateway gateway;

    public OrderProcessor(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    // 3. Return type, 4. Parameter type, 5. Thrown exception
    public Receipt process(Order order) throws ProcessingException {

        // 6. Local instantiation
        DatabaseConnection db = new DatabaseConnection();

        db.save(order);
        Receipt receipt = gateway.charge(order);

        if (receipt.isFailed()) {
            throw new ProcessingException("Charge failed");
        }

        return receipt;
    }
}

```

### **Ce Calculation Breakdown**

To calculate Ce, identify every distinct external type that `OrderProcessor` relies on to compile. Duplicates are ignored; each external module is counted exactly once.

1. **`IProcessor`**: The interface being implemented.
2. **`PaymentGateway`**: Referenced as a class field and constructor parameter.
3. **`Receipt`**: Referenced as a method return type and local variable.
4. **`Order`**: Referenced as a method parameter.
5. **`ProcessingException`**: Referenced in the `throws` clause and instantiated internally.
6. **`DatabaseConnection`**: Instantiated internally as a local variable.

**Final Score:**
**Ce = 6**

### **Interpretation**

A Ce of 6 means `OrderProcessor` has 6 points of failure related to external code. If the structural signature of `IProcessor`, `PaymentGateway`, `Receipt`, `Order`, `ProcessingException`, or `DatabaseConnection` changes, `OrderProcessor` must be updated or recompiled. To unit test `process()`, a test harness must provide valid instances or mocks for at least 4 of these structures (`PaymentGateway`, `Order`, `DatabaseConnection`, `Receipt`).

[^1]: [Software Architecture: The Hard Parts](https://www.oreilly.com/library/view/software-architecture-the/9781492086888/)
by Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani
