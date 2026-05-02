/** FinFlow microservices — feature groups per service (FinFlow project catalog). */

export type FinflowServiceCategory = "Gateway" | "Core domain" | "Supporting";

export type FinflowFeatureGroup = {
  title: string;
  features: string[];
};

export type FinflowService = {
  name: string;
  color: string;
  badge: { bg: string; text: string };
  category: FinflowServiceCategory;
  groups: FinflowFeatureGroup[];
};

export const FINFLOW_SERVICE_CATEGORIES: Array<
  "All" | FinflowServiceCategory
> = ["All", "Gateway", "Core domain", "Supporting"];

export const FINFLOW_SERVICES: FinflowService[] = [
  {
    name: "API Gateway",
    color: "#378ADD",
    badge: { bg: "#E6F1FB", text: "#185FA5" },
    category: "Gateway",
    groups: [
      {
        title: "Routing & proxy",
        features: [
          "Dynamic route configuration to all downstream services",
          "Path-based routing with predicate rules",
          "Load balancing across service instances via Eureka",
          "Request/response transformation filters",
        ],
      },
      {
        title: "Security",
        features: [
          "JWT validation filter on every incoming request",
          "Role-based access control at the gateway level",
          "IP allowlisting and blocklisting",
          "HTTPS termination and header sanitisation",
        ],
      },
      {
        title: "Traffic management",
        features: [
          "Rate limiting per user tier (Redis token bucket)",
          "Request timeout enforcement per route",
          "Circuit breaker integration with Resilience4j",
          "Retry logic for transient downstream failures",
        ],
      },
      {
        title: "Observability",
        features: [
          "Distributed trace injection (Micrometer + Zipkin)",
          "Access logs with correlation ID per request",
          "Prometheus metrics for request rate, latency, errors",
        ],
      },
      {
        title: "Tech stack",
        features: [
          "Spring Cloud Gateway",
          "Redis (rate limiting)",
          "Eureka (discovery)",
          "Micrometer / Zipkin",
        ],
      },
    ],
  },
  {
    name: "Auth Service",
    color: "#378ADD",
    badge: { bg: "#E6F1FB", text: "#185FA5" },
    category: "Gateway",
    groups: [
      {
        title: "Authentication",
        features: [
          "User registration with email/password",
          "Login with credential validation and JWT issuance",
          "Refresh token rotation with sliding expiry",
          "Multi-factor authentication (TOTP) support",
        ],
      },
      {
        title: "Token management",
        features: [
          "JWT access token generation (RS256 signed)",
          "Refresh token storage in Redis with TTL",
          "Token revocation / blacklist via Redis",
          "Token introspection endpoint for internal services",
        ],
      },
      {
        title: "Session & security",
        features: [
          "Redis-backed session registry",
          "Concurrent session limiting per user",
          "Brute force protection with exponential backoff",
          "Password hashing with BCrypt",
        ],
      },
      {
        title: "OAuth2 / SSO",
        features: [
          "OAuth2 Authorization Server (Spring Authorization Server)",
          "Client credentials flow for service-to-service auth",
          "Scope-based permission model",
        ],
      },
      {
        title: "Tech stack",
        features: [
          "Spring Security",
          "Spring Authorization Server",
          "Redis",
          "PostgreSQL (users)",
          "JWT (RS256)",
        ],
      },
    ],
  },
  {
    name: "Account Service",
    color: "#1D9E75",
    badge: { bg: "#E1F5EE", text: "#0F6E56" },
    category: "Core domain",
    groups: [
      {
        title: "Account management",
        features: [
          "Create, update, close bank accounts",
          "Support multiple account types: savings, current, wallet",
          "Account status lifecycle: PENDING → ACTIVE → SUSPENDED → CLOSED",
          "KYC status tracking per account",
        ],
      },
      {
        title: "Balance operations",
        features: [
          "Real-time balance query",
          "Debit and credit operations with optimistic locking",
          "Balance reservation (hold) for pending payments",
          "Available balance vs ledger balance distinction",
        ],
      },
      {
        title: "CQRS implementation",
        features: [
          "Command side: CreateAccount, UpdateAccount, Debit, Credit, CloseAccount",
          "Query side: separate read model updated via domain events",
          "Independent read DB (PostgreSQL read replica)",
          "Command handlers validate invariants before executing",
        ],
      },
      {
        title: "Inter-service",
        features: [
          "RestClient (sync) calls to Auth Service for ownership verification",
          "Publishes AccountCreated, BalanceChanged, AccountClosed events to Kafka",
          "Listens for SagaRollback events to reverse debit",
        ],
      },
      {
        title: "Tech stack",
        features: [
          "Spring Data JPA",
          "PostgreSQL",
          "RestClient",
          "Kafka producer",
          "Testcontainers",
        ],
      },
    ],
  },
  {
    name: "Payment Service",
    color: "#1D9E75",
    badge: { bg: "#E1F5EE", text: "#0F6E56" },
    category: "Core domain",
    groups: [
      {
        title: "Payment initiation",
        features: [
          "Accept payment requests (amount, source, destination, currency)",
          "Validate payment preconditions: sufficient balance, account active",
          "Idempotency enforcement via Redis registry (UUID key, TTL, state)",
          "Payment state machine: INITIATED → PROCESSING → COMPLETED / FAILED / ROLLED_BACK",
        ],
      },
      {
        title: "Saga orchestration",
        features: [
          "Choreography-based Saga: publish PaymentInitiated → await domain events",
          "Orchestrator-based variant: direct step execution with compensation tracking",
          "Compensating transactions triggered on any saga step failure",
          "Saga state persisted in DB for recovery on restart",
        ],
      },
      {
        title: "Idempotency layer",
        features: [
          "Redis idempotency key stores: request hash, status, response",
          "Duplicate requests return cached response immediately",
          "TTL expiry aligned with payment processing SLA",
          "Decorator pattern wraps all payment handlers",
        ],
      },
      {
        title: "Outbox pattern",
        features: [
          "Writes to payment table and outbox table in single DB transaction",
          "Outbox relay polls unpublished events and publishes to Kafka",
          "Guarantees at-least-once event delivery without dual-write risk",
        ],
      },
      {
        title: "Tech stack",
        features: [
          "Kafka producer",
          "Redis",
          "Resilience4j",
          "PostgreSQL",
          "Outbox relay",
        ],
      },
    ],
  },
  {
    name: "Transaction Service",
    color: "#1D9E75",
    badge: { bg: "#E1F5EE", text: "#0F6E56" },
    category: "Core domain",
    groups: [
      {
        title: "Transaction recording",
        features: [
          "Record all financial events as immutable transaction documents",
          "Support transaction types: PAYMENT, REVERSAL, FEE, INTEREST, ADJUSTMENT",
          "Timestamp, amount, currency, reference ID on every record",
          "Correlation ID linking saga steps to a single transaction",
        ],
      },
      {
        title: "Reactive pipeline",
        features: [
          "WebFlux: non-blocking request handling with Mono / Flux",
          "Reactive Kafka consumer (Project Reactor Kafka)",
          "Backpressure handling on high-volume streams",
          "Error operators: onErrorResume, retry with exponential backoff",
        ],
      },
      {
        title: "Query & history",
        features: [
          "Transaction history by account (paginated, filterable by date, type)",
          "WebClient calls to Account Service for account metadata enrichment",
          "Streaming response for large history exports (Flux<Transaction>)",
          "Full-text search on reference / description fields (MongoDB text index)",
        ],
      },
      {
        title: "Tech stack",
        features: [
          "Spring WebFlux",
          "WebClient",
          "Project Reactor Kafka",
          "MongoDB",
          "Reactive MongoDB",
        ],
      },
    ],
  },
  {
    name: "Ledger Service",
    color: "#1D9E75",
    badge: { bg: "#E1F5EE", text: "#0F6E56" },
    category: "Core domain",
    groups: [
      {
        title: "Double-entry bookkeeping",
        features: [
          "Every transaction posts a matching debit + credit entry",
          "Sum of all ledger entries always equals zero (enforced at domain level)",
          "Chart of accounts: assets, liabilities, equity, income, expense",
          "Multi-currency entries with FX rate snapshot",
        ],
      },
      {
        title: "Event sourcing",
        features: [
          "Ledger state derived from append-only event log",
          "Events: LedgerEntryPosted, EntryReversed, PeriodClosed",
          "Full ledger state rebuildable by replaying event log",
          "Snapshot mechanism to speed up state rehydration",
        ],
      },
      {
        title: "Period management",
        features: [
          "Open/close accounting periods",
          "Prevent posting to closed periods",
          "Period reconciliation report generation",
          "Running balance per account per period",
        ],
      },
      {
        title: "Audit",
        features: [
          "Immutable audit trail: every entry has creator, timestamp, saga ref",
          "Tamper-evident hash chain on ledger entries",
          "Export ledger entries for external reconciliation",
        ],
      },
      {
        title: "Tech stack",
        features: [
          "Event sourcing (custom)",
          "PostgreSQL",
          "Kafka consumer",
          "Snapshot store",
        ],
      },
    ],
  },
  {
    name: "Fraud Detection",
    color: "#7F77DD",
    badge: { bg: "#EEEDFE", text: "#3C3489" },
    category: "Supporting",
    groups: [
      {
        title: "Rule engine",
        features: [
          "Pluggable rule strategy per fraud type (Strategy pattern)",
          "Rules: velocity check, geo-anomaly, amount threshold, unusual hours",
          "Rule chaining: all rules evaluated, risk score aggregated",
          "New rules added without touching existing code (Open/Closed)",
        ],
      },
      {
        title: "Real-time detection",
        features: [
          "Consumes PaymentInitiated events from Kafka in real time",
          "Redis sliding window for velocity tracking (transactions per minute/hour)",
          "Device fingerprint and IP reputation check",
          "Response time target: < 200ms per evaluation",
        ],
      },
      {
        title: "Decision & response",
        features: [
          "Decision: APPROVE, REVIEW, BLOCK",
          "Publishes FraudDecisionMade event back to Kafka",
          "Payment Service saga waits for fraud decision before proceeding",
          "Blocked payments trigger automatic alert and case creation",
        ],
      },
      {
        title: "Case management",
        features: [
          "Fraud cases stored with evidence snapshot",
          "Manual review queue for REVIEW decisions",
          "Case resolution feeds back into rule tuning",
        ],
      },
      {
        title: "Tech stack",
        features: [
          "Kafka consumer",
          "Redis (sliding window)",
          "Strategy pattern",
          "PostgreSQL (cases)",
        ],
      },
    ],
  },
  {
    name: "Notification Service",
    color: "#7F77DD",
    badge: { bg: "#EEEDFE", text: "#3C3489" },
    category: "Supporting",
    groups: [
      {
        title: "Event consumption",
        features: [
          "Subscribes to multiple Kafka topics: PaymentCompleted, FraudAlert, AccountCreated, SagaFailed",
          "Consumer group isolation: each notification type has own consumer group",
          "Dead letter queue for failed notification deliveries",
          "Idempotent processing: skip already-sent notifications",
        ],
      },
      {
        title: "Delivery channels",
        features: [
          "Email: templated HTML via SMTP / SendGrid integration",
          "SMS: pluggable provider (Twilio adapter)",
          "WebSocket: real-time push to connected clients",
          "In-app notifications stored in DB for history",
        ],
      },
      {
        title: "Channel routing (Observer pattern)",
        features: [
          "Event type maps to notification template + channel set",
          "User preferences: opt-in/out per channel per event type",
          "Priority routing: fraud alerts always send all channels",
          "Retry logic per channel with exponential backoff",
        ],
      },
      {
        title: "Template engine",
        features: [
          "Thymeleaf templates per notification type",
          "Localisation support (i18n per user locale)",
          "Dynamic variable injection from event payload",
        ],
      },
      {
        title: "Tech stack",
        features: [
          "Kafka consumer",
          "WebSocket (Spring)",
          "Thymeleaf",
          "Redis (dedup)",
          "SMTP / Twilio",
        ],
      },
    ],
  },
  {
    name: "Compliance Service",
    color: "#7F77DD",
    badge: { bg: "#EEEDFE", text: "#3C3489" },
    category: "Supporting",
    groups: [
      {
        title: "AML screening",
        features: [
          "Anti-money-laundering rule checks on every transaction",
          "Sanctions list screening (OFAC, EU, UN)",
          "Structuring detection: multiple small transactions summing to threshold",
          "Suspicious activity report (SAR) generation",
        ],
      },
      {
        title: "Audit log",
        features: [
          "Immutable append-only audit log for all system actions",
          "Every compliance check recorded with input, rule set, outcome",
          "Tamper-evident log: hash chain linking entries",
          "PCI-DSS aligned: sensitive fields masked in logs",
        ],
      },
      {
        title: "Regulatory reporting",
        features: [
          "Scheduled export of transaction data for regulatory submission",
          "CTR (Currency Transaction Report) auto-generation above threshold",
          "Retention policy enforcement: data held for 7 years minimum",
          "GDPR data erasure with compliance audit trail",
        ],
      },
      {
        title: "Event sourcing",
        features: [
          "All compliance decisions stored as events",
          "Full audit replay: reconstruct compliance state at any point in time",
          "Template method pattern for adding new regulatory check types",
        ],
      },
      {
        title: "Tech stack",
        features: [
          "Kafka consumer",
          "PostgreSQL (event store)",
          "Scheduled tasks",
          "Event sourcing",
        ],
      },
    ],
  },
  {
    name: "Report Service",
    color: "#7F77DD",
    badge: { bg: "#EEEDFE", text: "#3C3489" },
    category: "Supporting",
    groups: [
      {
        title: "Read model (CQRS projection)",
        features: [
          "Listens to domain events and projects into report-optimised read model",
          "Separate read DB (PostgreSQL) tuned for aggregation queries",
          "Projection rebuild from Kafka topic offset replay",
          "Eventually consistent: read model lags source by milliseconds",
        ],
      },
      {
        title: "Report types",
        features: [
          "Account statement: transactions per period, opening/closing balance",
          "Payment volume report: grouped by day, currency, status",
          "Fraud summary: detection rate, block rate, case outcomes",
          "Ledger reconciliation: compare ledger totals with account balances",
        ],
      },
      {
        title: "Reactive data pipeline",
        features: [
          "WebClient (reactive) to fetch enrichment data from other services",
          "Flux-based streaming for large report payloads",
          "Scheduled report generation with Spring @Scheduled",
          "On-demand report generation via REST endpoint",
        ],
      },
      {
        title: "Export",
        features: [
          "Export to JSON, CSV, PDF",
          "Async export with status polling (report job queue)",
          "Signed download URLs for generated report files",
        ],
      },
      {
        title: "Tech stack",
        features: [
          "Spring WebFlux",
          "WebClient",
          "PostgreSQL (read model)",
          "Kafka consumer",
          "Scheduled tasks",
        ],
      },
    ],
  },
];
