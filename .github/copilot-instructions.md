# Copilot Instructions for AI Coding Agents

## Project Overview
This is a Clean Architecture TypeScript codebase implementing DDD and TDD for a booking/cancellation system. The architecture enforces strict separation between domain logic, application services, and infrastructure concerns.

## Architecture & Layered Structure
**Clean Architecture with 4 layers:**
- **Domain** (`src/domain/`): Pure business logic - entities, value objects, repository interfaces, domain rules
- **Application** (`src/application/`): Use cases, DTOs, services that orchestrate domain objects  
- **Infrastructure** (`src/infrastructure/`): External concerns - TypeORM entities, repositories, web controllers
- **Dependency flow**: Infrastructure → Application → Domain (dependencies point inward)

### Key Patterns
- **Repository Pattern**: Domain defines interfaces (`BookingRepository`), infrastructure provides implementations (`TypeORMBookingRepository`, `FakeBookingRepository`)
- **Mapper Pattern**: Infrastructure mappers (`BookingMapper`) convert between domain objects and persistence entities
- **Factory Pattern**: Both domain rules (`RefundRuleFactory`) and application factories (`DateRangeFactory`)
- **Builder Pattern**: Test data builders in `src/test/data-builders/` use fluent API (e.g., `BookingBuilder.aBooking().withId(id).build()`)
- **Dependency Injection**: Services receive dependencies via constructor injection

## Testing Strategy & Commands
- **Unit Tests**: Each file has a paired `.test.ts` file testing in isolation with fakes and Jest mocks
- **E2E Tests**: Controllers have `_e2e.test.ts` files using TestContainers with real PostgreSQL
- **Test Commands**: 
  - `npm test` - Run all tests
  - `npm run test:unit` - Skip E2E tests  
  - `npm run test:e2e` - Only E2E tests
  - `npm run test:coverage` - Generate coverage reports
- **Test Naming**: `describe('<ClassName> unit tests')` for units, `describe('<ClassName> E2E tests')` for integration

## Development Workflows
- **Domain-First**: Start with domain entities/value objects, then application services, finally infrastructure
- **TDD**: Write failing tests first, implement minimum code to pass, refactor
- **Fake Repositories**: Use `Fake*Repository` classes for fast unit testing, TypeORM repositories for E2E
- **Service Mocking**: Unit tests mock service dependencies using `jest.mock()` and `jest.Mocked<T>`
- **Database Migrations**: Use `npm run migration:generate` for schema changes, `npm run migration:run` to apply

## Key Conventions
- **Immutable Domain**: Value objects and entities don't expose setters, use constructor parameters
- **Status Management**: Entities manage their own state transitions (e.g., `booking.cancel()`)
- **Error Handling**: Domain methods throw descriptive errors, application services catch and handle
- **ID Generation**: Application layer generates UUIDs using `uuid` package
- **Private Fields**: Domain entities use `private readonly` for immutable properties, `private` for mutable state

## Infrastructure Specifics
- **TypeORM**: Uses decorators on entity classes in `infrastructure/persistence/entities/`
- **Express Controllers**: Handle HTTP concerns, delegate business logic to application services
- **Mappers**: Convert domain ↔ persistence entities, handle nested object relationships using static methods
- **E2E Setup**: Each controller test uses TestContainers PostgreSQL with `createTestPostgresDataSource()`
- **Test Data**: Use data builders with Faker.js for realistic test data generation

## Critical Files
- `src/domain/entities/booking.ts`: Core entity showing status management and business rules
- `src/application/services/booking_service.ts`: Orchestrates domain objects, handles cross-cutting concerns
- `src/infrastructure/repositories/typeorm_booking_repository.ts`: Repository implementation with relations
- `src/infrastructure/web/booking_controller_e2e.test.ts`: Full-stack testing pattern
- `src/test/data-builders/`: Fluent builders for test data creation
