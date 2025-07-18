# Copilot Instructions for AI Coding Agents

## Project Overview
This project is a TypeScript codebase focused on domain-driven design (DDD) and test-driven development (TDD) for a booking/cancellation system. The core logic is organized by domain concepts, with clear separation between domain rules, entities, and value objects.

## Architecture & Structure
- **Domain Logic**: Located in `src/domain/`, split into:
  - `cancelation/`: Refund rules and their factory, each rule in its own file, all implementing a shared interface.
  - `entities/`: Core business objects (`booking`, `property`, `user`) with corresponding test files.
  - `value_objects/`: Immutable value objects (e.g., `date_range`) with tests.
- **Patterns**:
  - Use of interfaces for domain rules (see `refund_rule.interface.ts`).
  - Factory pattern for selecting refund rules (`refund_rule_factory.ts`).
  - Each entity/value object has a paired `.test.ts` file for TDD.

## Developer Workflows
- **Build**: Standard TypeScript build using `tsconfig.json`.
- **Test**: Run all tests with `npm test` (uses Jest, see `jest.config.js`).
- **Debug**: Debugging is typically done via Jest or by running TypeScript files directly.

## Conventions & Practices
- **File Naming**: Tests are named `<module>.test.ts` and colocated with their implementation.
- **Domain-Driven**: Business logic is not mixed with infrastructure or application concerns.
- **Immutability**: Value objects are designed to be immutable.
- **Explicit Factories**: Use factories for domain rule selection, not conditionals scattered in business logic.

## Integration & Dependencies
- **No external service integration** is present in the domain layer.
- **Jest** is used for all testing.
- **TypeScript** is the only language used.

## Key Files & Examples
- `src/domain/cancelation/refund_rule_factory.ts`: Shows the factory pattern for rule selection.
- `src/domain/entities/booking.ts` and `booking.test.ts`: Example of entity and its tests.
- `src/domain/value_objects/date_range.ts`: Example of a value object.

## How to Extend
- Add new refund rules by implementing the interface and registering in the factory.
- Add new entities/value objects with paired tests.

---
For questions or unclear conventions, review the code in `src/domain/` and follow existing patterns. When in doubt, prefer explicitness and separation of concerns.
