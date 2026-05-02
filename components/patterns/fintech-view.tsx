"use client";

import type { FintechTab } from "@/lib/fintech-sections";
import { FINTECH_PATTERNS, PROJECT_FILES } from "@/lib/patterns-data";
import { FinflowServiceFeatures } from "./finflow-service-features";

type ServiceCard = {
  name: string;
  stack: string;
  dotClass: string;
};

type PatternTechCard = {
  title: string;
  description: string;
  usedIn: string;
};

type PhaseWeek = {
  title: string;
  tasks: string[];
  deliverable: string;
};

type SchedulePhase = {
  id: string;
  number: string;
  numberClass: string;
  badgeClass: string;
  name: string;
  duration: string;
  level: string;
  weeks: PhaseWeek[];
};

const CLIENT_GATEWAY: ServiceCard[] = [
  {
    name: "API Gateway",
    stack: "Spring Cloud Gateway · JWT · Rate limiting · Routing",
    dotClass: "bg-blue-500",
  },
  {
    name: "Auth Service",
    stack: "Spring Security · OAuth2 · JWT · Redis session",
    dotClass: "bg-blue-500",
  },
];

const CORE_DOMAIN: ServiceCard[] = [
  {
    name: "Account Service",
    stack: "PostgreSQL · JPA · RestClient · CQRS",
    dotClass: "bg-emerald-500",
  },
  {
    name: "Payment Service",
    stack: "Kafka producer · Saga orchestrator · Idempotency (Redis)",
    dotClass: "bg-emerald-500",
  },
  {
    name: "Transaction Service",
    stack: "Reactive (WebFlux) · WebClient · MongoDB",
    dotClass: "bg-emerald-500",
  },
  {
    name: "Ledger Service",
    stack: "Double-entry · Event sourcing · PostgreSQL",
    dotClass: "bg-emerald-500",
  },
];

const SUPPORTING: ServiceCard[] = [
  {
    name: "Fraud Detection",
    stack: "Kafka consumer · Rule engine · Redis cache",
    dotClass: "bg-violet-500",
  },
  {
    name: "Notification Service",
    stack: "Kafka consumer · Email/SMS · WebSocket",
    dotClass: "bg-violet-500",
  },
  {
    name: "Compliance Service",
    stack: "AML rules · Audit log · Event sourcing",
    dotClass: "bg-violet-500",
  },
  {
    name: "Report Service",
    stack: "Read model · Scheduled · WebClient (reactive)",
    dotClass: "bg-violet-500",
  },
];

const INFRA_ITEMS = [
  "Docker Compose (dev)",
  "Kubernetes (prod)",
  "Gradle multi-module",
  "Redis (cache + idempotency)",
  "Zipkin / Sleuth (tracing)",
  "Prometheus + Grafana",
  "Eureka / Spring Cloud Config",
  "Testcontainers",
  "Micrometer",
];

const PATTERN_TECH: PatternTechCard[] = [
  {
    title: "Saga pattern",
    description:
      "Both choreography and orchestration. Choreography first (Kafka events), then orchestrator variant to compare trade-offs.",
    usedIn: "Payment Service",
  },
  {
    title: "Idempotency (Redis registry)",
    description:
      "Every payment gets a UUID key. Redis stores state (PENDING/DONE/FAILED) with TTL. Duplicate requests return cached result instantly.",
    usedIn: "Payment Service",
  },
  {
    title: "Event sourcing",
    description:
      "State is derived from an immutable event log. Supports replay, audit trails, and temporal queries - essential for fintech compliance.",
    usedIn: "Ledger, Compliance",
  },
  {
    title: "CQRS",
    description:
      "Commands mutate state, queries read from optimized read models. Separate databases for reads and writes where needed.",
    usedIn: "Account, Report",
  },
  {
    title: "Outbox pattern",
    description:
      "Write to DB and publish Kafka event atomically by writing to an outbox table first, then a relay polls and publishes.",
    usedIn: "Payment, Account",
  },
  {
    title: "Circuit breaker + Bulkhead",
    description:
      "Resilience4j wraps all inter-service calls. Bulkheads isolate thread pools so one slow service does not starve others.",
    usedIn: "All services",
  },
  {
    title: "Strategy pattern",
    description:
      "Fraud rules as interchangeable strategies. New rules added without touching existing logic - open/closed principle in practice.",
    usedIn: "Fraud Detection",
  },
  {
    title: "Observer / Event-driven",
    description:
      "Notification service consumes Kafka topics and fans out to email, SMS, WebSocket - zero coupling to producers.",
    usedIn: "Notification",
  },
  {
    title: "Factory + Builder",
    description:
      "Domain object construction isolated behind factories. Builders for complex request/response DTOs and Kafka message payloads.",
    usedIn: "All services",
  },
  {
    title: "Decorator pattern",
    description:
      "Idempotency check wraps the payment handler transparently. Logging, metrics, and retry wrappers follow same pattern.",
    usedIn: "Payment, Gateway",
  },
  {
    title: "RestClient vs WebClient",
    description:
      "RestClient (sync, blocking) for simple service calls in imperative services. WebClient (non-blocking, reactive) in WebFlux services for full back-pressure.",
    usedIn: "Account vs Transaction",
  },
  {
    title: "Double-entry bookkeeping",
    description:
      "Every transaction posts a debit and a credit. Sum of all ledger entries must always equal zero - enforced at the domain level.",
    usedIn: "Ledger Service",
  },
];
const SCHEDULE: SchedulePhase[] = [
  {
    id: "phase-1",
    number: "1",
    numberClass: "bg-[#E6F1FB] text-[#0C447C]",
    badgeClass: "bg-[#E6F1FB] text-[#0C447C]",
    name: "Foundations - Setup & First Service",
    duration: "Weeks 1-2 - ~14 hrs",
    level: "Beginner",
    weeks: [
      {
        title: "Week 1 - Project scaffolding",
        tasks: [
          "Gradle multi-module project setup (root + submodules per service)",
          "Spring Boot 3 base dependencies - Web, Actuator, Validation, Security",
          "Docker Compose: PostgreSQL, Redis, Kafka, Zookeeper",
          "Spring Cloud Config Server - externalize all config",
          "Eureka Service Discovery - register/discover services",
        ],
        deliverable: "Running infra + config server",
      },
      {
        title: "Week 2 - Auth Service + API Gateway",
        tasks: [
          "Auth Service: Spring Security + OAuth2 Resource Server + JWT generation",
          "Redis-backed session & token blacklist",
          "API Gateway: Spring Cloud Gateway, JWT filter, rate limiting",
          "Routing rules to downstream services",
          "Unit tests with JUnit 5 + Mockito",
        ],
        deliverable: "Secured gateway routing to Auth",
      },
    ],
  },
  {
    id: "phase-2",
    number: "2",
    numberClass: "bg-[#EAF3DE] text-[#27500A]",
    badgeClass: "bg-[#EAF3DE] text-[#3B6D11]",
    name: "Core Domain - Accounts & Payments",
    duration: "Weeks 3-5 - ~21 hrs",
    level: "Intermediate",
    weeks: [
      {
        title: "Week 3 - Account Service",
        tasks: [
          "CRUD with Spring Data JPA + PostgreSQL",
          "CQRS pattern: separate command/query handlers",
          "RestClient (sync) for inter-service calls",
          "Repository + Service + Factory design patterns",
          "Integration tests with Testcontainers (PostgreSQL)",
        ],
        deliverable: "Account CRUD with CQRS",
      },
      {
        title: "Week 4 - Payment Service + Idempotency",
        tasks: [
          "Payment initiation with Kafka producer",
          "Redis idempotency registry - prevent duplicate payments",
          "Idempotency key design (UUID, TTL, state machine)",
          "Circuit Breaker with Resilience4j",
          "Decorator pattern for idempotency layer",
        ],
        deliverable: "Idempotent payment initiation",
      },
      {
        title: "Week 5 - Saga Pattern (Choreography)",
        tasks: [
          "Choreography-based Saga: Payment -> Account debit -> Ledger -> Notification",
          "Compensating transactions on failure",
          "Kafka consumer groups, offset management",
          "Outbox pattern to guarantee event delivery",
          "Saga state persisted in DB",
        ],
        deliverable: "Full distributed payment saga",
      },
    ],
  },
  {
    id: "phase-3",
    number: "3",
    numberClass: "bg-[#EEEDFE] text-[#3C3489]",
    badgeClass: "bg-[#EEEDFE] text-[#3C3489]",
    name: "Reactive & Event-Driven Services",
    duration: "Weeks 6-8 - ~21 hrs",
    level: "Advanced",
    weeks: [
      {
        title: "Week 6 - Transaction Service (Reactive)",
        tasks: [
          "Spring WebFlux: Mono, Flux, reactive pipelines",
          "WebClient for non-blocking inter-service calls",
          "Reactive MongoDB for transaction history",
          "Backpressure handling, error operators",
          "Reactive Kafka consumer with Project Reactor Kafka",
        ],
        deliverable: "Fully reactive transaction service",
      },
      {
        title: "Week 7 - Fraud Detection + Ledger",
        tasks: [
          "Fraud: Kafka consumer, rule engine (Strategy pattern)",
          "Redis for sliding window rate detection",
          "Event-driven response: publish fraud alert events",
          "Ledger: double-entry bookkeeping, event sourcing",
          "Ledger rebuild from events (replay)",
        ],
        deliverable: "Fraud detection + audit ledger",
      },
      {
        title: "Week 8 - Notification + Compliance",
        tasks: [
          "Notification: Kafka consumer fan-out, Observer pattern",
          "WebSocket for real-time push notifications",
          "Compliance: AML rule checks, audit log immutability",
          "Template method pattern for compliance checks",
          "Saga orchestrator variant (vs choreography comparison)",
        ],
        deliverable: "Notifications + compliance audit",
      },
    ],
  },
  {
    id: "phase-4",
    number: "4",
    numberClass: "bg-[#FAEEDA] text-[#633806]",
    badgeClass: "bg-[#FAEEDA] text-[#854F0B]",
    name: "Observability, Resilience & Kubernetes",
    duration: "Weeks 9-11 - ~21 hrs",
    level: "Production",
    weeks: [
      {
        title: "Week 9 - Observability",
        tasks: [
          "Distributed tracing: Micrometer + Zipkin, trace/span propagation across Kafka",
          "Structured logging with correlation IDs",
          "Prometheus metrics + Grafana dashboards per service",
          "Health checks, readiness/liveness probes",
        ],
        deliverable: "Full observability stack",
      },
      {
        title: "Week 10 - Resilience patterns",
        tasks: [
          "Circuit Breaker, Retry, Bulkhead with Resilience4j across services",
          "Timeout patterns with WebClient & RestClient",
          "Graceful degradation strategies",
          "Dead letter queues in Kafka",
          "Chaos testing: simulate service failures",
        ],
        deliverable: "Resilient, fault-tolerant system",
      },
      {
        title: "Week 11 - Kubernetes deployment",
        tasks: [
          "Dockerize all services with multi-stage Gradle builds",
          "K8s Deployments, Services, ConfigMaps, Secrets",
          "Helm charts per microservice",
          "Horizontal Pod Autoscaling based on CPU / custom Prometheus metrics",
          "Rolling updates and rollback strategy",
        ],
        deliverable: "Full K8s cluster running FinFlow",
      },
    ],
  },
  {
    id: "phase-5",
    number: "5",
    numberClass: "bg-[#FCEBEB] text-[#791F1F]",
    badgeClass: "bg-[#FCEBEB] text-[#A32D2D]",
    name: "Advanced Fintech & Capstone",
    duration: "Weeks 12-14 - ~21 hrs",
    level: "Expert",
    weeks: [
      {
        title: "Week 12 - Advanced event patterns",
        tasks: [
          "Event versioning & schema evolution with Avro / Schema Registry",
          "Exactly-once semantics in Kafka (idempotent producer + transactional consumer)",
          "CQRS with separate read/write databases (projection service)",
          "Report Service: reactive aggregation, scheduled jobs",
        ],
        deliverable: "Production-grade event design",
      },
      {
        title: "Week 13 - Security hardening",
        tasks: [
          "mTLS between internal services",
          "Secret rotation with Vault / K8s secrets",
          "PCI-DSS aligned data masking in logs",
          "API rate limiting per user tier at the gateway",
          "Penetration test concepts: SQL injection, replay attacks",
        ],
        deliverable: "Hardened fintech security posture",
      },
      {
        title: "Week 14 - Capstone & review",
        tasks: [
          "End-to-end load test: payment triggers fraud check, saga rollback, and compliance audit",
          "Architecture decision records (ADRs) written for 5 major choices",
          "Code review & refactor session",
          "Final demo: all services running in K8s, observable, resilient",
        ],
        deliverable: "Production-ready FinFlow platform",
      },
    ],
  },
];

export function FintechView({ activeSection }: { activeSection: FintechTab }) {
  return (
    <div className="animate-fade-in flex h-[calc(100dvh-12rem)] min-h-[34rem] flex-1 flex-col overflow-hidden">
      <section className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {activeSection === "arch" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-sm">
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Event Bus
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Apache Kafka - all async communication
                  </p>
                </div>
              </div>

              <LayerPanel
                title="Client & Gateway layer"
                titleClass="text-blue-500"
                services={CLIENT_GATEWAY}
                columns={2}
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <LayerPanel
                  title="Core domain services"
                  titleClass="text-emerald-500"
                  services={CORE_DOMAIN}
                />
                <LayerPanel
                  title="Supporting services"
                  titleClass="text-violet-500"
                  services={SUPPORTING}
                />
              </div>
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-600">
                  Infrastructure & observability
                </h3>
                <div className="flex flex-wrap gap-2">
                  {INFRA_ITEMS.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

            {activeSection === "schedule" && (
            <div className="w-full min-w-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    FinFlow implementation schedule
                  </h2>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    14-week path from setup and core domain to production-grade
                    scale.
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                  5 phases - Weeks 1-14
                </span>
              </div>
              <div className="min-h-[48vh] w-full min-w-0 space-y-4">
                  {SCHEDULE.map((phase) => (
                    <section
                      key={phase.id}
                      className="min-w-0 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)]"
                    >
                      <div className="flex items-center gap-3 px-4 py-3">
                        <span
                          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${phase.numberClass}`}
                        >
                          {phase.number}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-[var(--text-primary)]">
                            {phase.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">
                            {phase.duration}
                          </span>
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${phase.badgeClass}`}
                        >
                          {phase.level}
                        </span>
                      </div>
                      <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
                        {phase.weeks.map((week, weekIndex) => {
                          const id = `${phase.id}-week-${weekIndex + 1}`;
                          return (
                            <article
                              key={id}
                              id={id}
                              className="scroll-mt-24 border-b border-[var(--border-subtle)] px-4 py-3 last:border-b-0"
                            >
                              <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                                {week.title}
                              </h4>
                              <ul className="mt-2 min-w-0 space-y-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                                {week.tasks.map((task) => (
                                  <li key={task} className="flex gap-2">
                                    <span aria-hidden>-</span>
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                              <span className="mt-2 inline-flex rounded-md bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)]">
                                ✓ {week.deliverable}
                              </span>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  ))}
              </div>
            </div>
          )}

            {activeSection === "patterns" && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {PATTERN_TECH.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {item.description}
                    </p>
                    <p className="mt-3 text-sm text-[var(--text-secondary)]">
                      Used in -{" "}
                      <span className="font-medium text-[var(--text-primary)]">
                        {item.usedIn}
                      </span>
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}

            {activeSection === "services" && (
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-sm sm:p-5">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  FinFlow — service feature catalog
                </h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Search and filter by layer. Expand a service to browse grouped
                  capabilities and tech stack.
                </p>
              </div>
              <FinflowServiceFeatures />
            </div>
          )}

            {activeSection === "most-used" && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Fintech/Banking — Most Used Patterns
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                These patterns appear in virtually every enterprise banking
                system
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {FINTECH_PATTERNS.map((fp) => (
                  <div
                    key={fp.name}
                    title={fp.reason}
                    className="flex max-w-full cursor-default items-baseline gap-1 rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-elevated)]"
                  >
                    <span>{fp.name}</span>
                    <span className="truncate text-[11px] font-normal text-[var(--text-secondary)]">
                      — {fp.reason.split(",")[0]}
                    </span>
                  </div>
                ))}
              </div>
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-sm sm:p-5">
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    Project: Multi-Tenant Digital Banking Platform
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Microservices architecture — Gateway, Account, Payment,
                    Notification, Fraud services
                  </p>
                </div>

                <ProjectBlock
                  title="Project Structure"
                  fileLabel="tree"
                  code={PROJECT_FILES.structure}
                />
                <ProjectBlock
                  title="docker-compose.yml"
                  fileLabel="yml"
                  code={PROJECT_FILES.compose}
                />
                <ProjectBlock
                  title="Dockerfile (multi-stage)"
                  fileLabel="Dockerfile"
                  code={PROJECT_FILES.dockerfile}
                />
                <ProjectBlock
                  title="application.yml (account-service)"
                  fileLabel="yml"
                  code={PROJECT_FILES.appConfig}
                />
              </section>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}

function LayerPanel({
  title,
  titleClass,
  services,
  columns = 1,
}: {
  title: string;
  titleClass: string;
  services: ServiceCard[];
  columns?: 1 | 2;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-sm">
      <h3
        className={`mb-3 text-sm font-semibold uppercase tracking-wide ${titleClass}`}
      >
        {title}
      </h3>
      <div className={`grid gap-3 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
        {services.map((item) => (
          <article
            key={item.name}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4"
          >
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${item.dotClass}`} />
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                {item.name}
              </h4>
            </div>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {item.stack}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProjectBlock({
  title,
  fileLabel,
  code,
}: {
  title: string;
  fileLabel: string;
  code: string;
}) {
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-sm last:mb-0">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
        <span className="rounded-md border border-[var(--border-subtle)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
          {fileLabel}
        </span>
      </div>
      <pre className="max-h-[min(420px,70vh)] overflow-auto whitespace-pre border-t border-[var(--border-subtle)] bg-[var(--surface-muted)] p-5 font-mono text-[11px] leading-relaxed text-[var(--text-primary)] sm:text-xs">
        {code}
      </pre>
    </div>
  );
}
