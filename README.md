# Sistema de Reservas - Desenvolvimento Orientado a Testes (TDD)

Este projeto implementa um sistema de reservas de propriedades utilizando **Clean Architecture**, **Domain-Driven Design (DDD)** e **Test-Driven Development (TDD)** em TypeScript.

## 🎯 Objetivo do Projeto

Implementação de um sistema completo de reservas com foco em:
- Desenvolvimento orientado a testes (TDD)
- Arquitetura limpa com separação clara de responsabilidades
- Padrões de domain-driven design
- Testes unitários e de integração (E2E)

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture** com 4 camadas:

```
src/
├── domain/              # Lógica de negócio pura
│   ├── entities/        # Entidades de domínio
│   ├── value_objects/   # Objetos de valor imutáveis
│   ├── repositories/    # Interfaces dos repositórios
│   └── cancelation/     # Regras de cancelamento e reembolso
├── application/         # Casos de uso e serviços
│   ├── services/        # Serviços de aplicação
│   ├── dtos/           # Objetos de transferência de dados
│   └── factories/       # Fábricas da camada de aplicação
└── infrastructure/      # Detalhes técnicos
    ├── persistence/     # Entidades TypeORM e mappers
    ├── repositories/    # Implementações dos repositórios
    └── web/            # Controllers REST
```

## 🚀 Tecnologias Utilizadas

- **TypeScript** - Linguagem principal
- **Jest** - Framework de testes
- **TypeORM** - ORM para persistência
- **SQLite** - Banco de dados para testes
- **Express** - Framework web
- **UUID** - Geração de identificadores únicos

## 📋 Pré-requisitos

- Node.js (versão 18+)
- npm ou yarn

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/gianverdum/fc-tdd.git
cd fc-tdd
```

2. Instale as dependências:
```bash
npm install
```

## 🧪 Execução dos Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes com coverage
```bash
npm run test:coverage
```

### Executar apenas testes unitários
```bash
npm run test:unit
```

### Executar apenas testes E2E
```bash
npm run test:e2e
```

## 📝 Estrutura de Testes

O projeto implementa duas estratégias de teste:

### Testes Unitários
- Cada arquivo possui um `.test.ts` correspondente
- Utilizam repositórios fake para isolamento
- Focam na lógica de negócio sem dependências externas
- Exemplo: `src/domain/entities/booking.test.ts`

### Testes E2E (End-to-End)
- Arquivos terminados em `_e2e.test.ts`
- Utilizam TypeORM com SQLite em memória
- Testam fluxos completos da aplicação
- Exemplo: `src/infrastructure/web/booking_controller_e2e.test.ts`

## 🎯 Desafio Técnico Implementado

Este projeto foi desenvolvido para atender aos seguintes requisitos:

### ✅ 1. Testes Unitários nos Mappers
- `property_mapper.test.ts` - Testes de conversão entre entidades de domínio e persistência
- `booking_mapper.test.ts` - Validação de mappers com cenários de erro

### ✅ 2. Testes E2E de Criação de Usuário
- `user_controller_e2e.test.ts` - Endpoint POST /users
- Validação de campos obrigatórios e códigos HTTP

### ✅ 3. Testes E2E de Criação de Propriedade  
- `property_controller_e2e.test.ts` - Endpoint POST /properties
- Validação de regras de negócio (preço > 0, capacidade > 0)

### ✅ 4. Testes de Políticas de Reembolso
- `refund_rule_factory.test.ts` - Lógica de seleção de regras baseada em dias
- Cenários: reembolso total, parcial e sem reembolso

### ✅ 5. Testes de Cancelamento de Reserva
- `booking_service.test.ts` - Validação de cancelamento de reservas inexistentes

## 🔧 Padrões Implementados

### Repository Pattern
```typescript
// Interface no domínio
interface BookingRepository {
    save(booking: Booking): Promise<void>;
    findById(id: string): Promise<Booking | null>;
}

// Implementação fake para testes unitários
class FakeBookingRepository implements BookingRepository { ... }

// Implementação TypeORM para E2E
class TypeORMBookingRepository implements BookingRepository { ... }
```

### Factory Pattern
```typescript
// Seleção de regras de reembolso baseada em lógica de negócio
RefundRuleFactory.getRefundRule(daysUntilCheckIn: number): RefundRule
```

### Mapper Pattern
```typescript
// Conversão entre camadas
BookingMapper.toDomain(entity: BookingEntity): Booking
BookingMapper.toPersistence(booking: Booking): BookingEntity
```

## 📊 Cobertura de Testes

O projeto mantém alta cobertura de testes em todas as camadas:
- **Domínio**: 100% - Entidades, objetos de valor e regras de negócio
- **Aplicação**: 100% - Serviços e casos de uso
- **Infraestrutura**: 100% - Repositórios, mappers e controllers

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 🎓 Aprendizados

Este projeto demonstra:
- Como implementar TDD de forma efetiva
- Separação clara entre testes unitários e de integração
- Uso de fakes vs. implementações reais
- Clean Architecture aplicada em TypeScript
- Domain-Driven Design na prática