import type { PatternRecord } from "./types";

/**
 * SOLID principles expressed with the same fields as GoF catalogue entries:
 * intent, problem, analogy, solution, illustrative Spring code, implementation steps.
 */
export const SOLID_PATTERN_RECORDS: PatternRecord[] = [
  {
    name: "Single Responsibility Principle",
    badge: "SOLID",
    badgeClass: "c-solid",
    tagline: "A class should have only one reason to change",
    catalogLabel: "Design principle",
    codeSectionLabel: "Spring Boot illustration",
    intent:
      "Assign each module a single, well-defined responsibility so that changes in requirements affect only one place.",
    problem:
      "An `AccountService` that posts ledger entries, renders PDF statements, sends email alerts, and calls SOAP integrations becomes impossible to test or evolve — every change risks unrelated regressions.",
    analogy:
      "At a bank, the loan officer approves credit; the teller handles cash; compliance files SARs. One person doing all three would mix audit trails and expertise — the organisation splits roles for clarity and accountability.",
    solution:
      "Identify cohesive behaviours and extract them into dedicated types (`LedgerPostingService`, `StatementRenderer`, `CustomerNotifier`). Each Spring bean owns one axis of change aligned with business vocabulary.",
    code: `<span class="cm">// Anti-pattern: multiple reasons to change in one service</span>
<span class="cm">// @Service class AccountWorkflowService { postLedger(); emailStatement(); exportSwift(); }</span>

<span class="cm">// Single responsibility: narrow services, constructor-injected dependencies</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">LedgerPostingService</span> {
    <span class="kw">private final</span> <span class="ty">LedgerRepository</span> ledgerRepository;

    <span class="kw">public</span> <span class="ty">LedgerPostingService</span>(<span class="ty">LedgerRepository</span> ledgerRepository) {
        <span class="kw">this</span>.ledgerRepository = ledgerRepository;
    }

    <span class="kw">public void</span> post(<span class="ty">LedgerEntry</span> entry) {
        ledgerRepository.save(entry);
    }
}

<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">StatementNotificationService</span> {
    <span class="kw">private final</span> <span class="ty">MailSender</span> mailSender;

    <span class="kw">public void</span> sendMonthlyStatement(<span class="ty">String</span> customerId, <span class="ty">byte</span>[] pdf) {
        mailSender.send(customerId, <span class="str">"statement.pdf"</span>, pdf);
    }
}`,
    impl: [
      "Draw boundaries around verbs from your domain language — what changes together belongs together.",
      "Keep controllers thin: delegate to services that map 1:1 to use cases or technical responsibilities.",
      "When a class name contains “And” or “Manager”, candidate extract classes until each name reads as one job.",
      "Measure with tests: services with one reason to change typically need fewer mocks per unit test.",
    ],
  },
  {
    name: "Open / Closed Principle",
    badge: "SOLID",
    badgeClass: "c-solid",
    tagline: "Open for extension, closed for modification",
    catalogLabel: "Design principle",
    codeSectionLabel: "Spring Boot illustration",
    intent:
      "Software entities should be open for extension without modifying their source — new behaviour plugs in via polymorphism or configuration.",
    problem:
      "Every new payment rail or fee rule forces edits inside `BillingService` with cascading if/else chains. Releases become risky because stable paths are touched alongside experimental ones.",
    analogy:
      "Card networks add new interchange categories without rewriting the clearing engine — they publish extension points (fee schedules, MCC rules). Existing clearing logic stays frozen while new rules plug in.",
    solution:
      "Define stable abstractions (`FeeCalculationStrategy`, `RailAdapter`) and register implementations as Spring beans. Extend by adding classes and wiring, not by editing core orchestration code.",
    code: `<span class="kw">public interface</span> <span class="ty">FeeCalculationStrategy</span> {
    <span class="ty">Money</span> calculate(<span class="ty">TransferContext</span> ctx);
}

<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">DomesticAchFeeStrategy</span> <span class="kw">implements</span> <span class="ty">FeeCalculationStrategy</span> {
    <span class="kw">public</span> <span class="ty">Money</span> calculate(<span class="ty">TransferContext</span> ctx) {
        <span class="kw">return</span> <span class="ty">Money</span>.of(<span class="str">"USD"</span>, <span class="str">"2.50"</span>);
    }
}

<span class="cm">// NEW rail: add class + bean name — BillingService unchanged</span>
<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">SwiftMt103FeeStrategy</span> <span class="kw">implements</span> <span class="ty">FeeCalculationStrategy</span> {
    <span class="kw">public</span> <span class="ty">Money</span> calculate(<span class="ty">TransferContext</span> ctx) {
        <span class="kw">return</span> <span class="ty">Money</span>.of(ctx.getCurrency(), <span class="str">"35.00"</span>);
    }
}

<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">BillingService</span> {
    <span class="kw">private final</span> Map&lt;<span class="ty">String</span>, <span class="ty">FeeCalculationStrategy</span>&gt; strategies;

    <span class="kw">public</span> <span class="ty">Money</span> quote(<span class="ty">TransferContext</span> ctx) {
        <span class="kw">return</span> strategies.get(ctx.getRail()).calculate(ctx);
    }
}`,
    impl: [
      "Prefer strategy maps, template methods, or chain-of-responsibility beans over growing switch statements.",
      "Use `@ConditionalOnProperty` or profiles to activate extensions without branching in business code.",
      "Treat core orchestrators as immutable APIs — code review should flag direct edits when extension points exist.",
      "Pair with feature flags so new strategies can bake in production behind toggles.",
    ],
  },
  {
    name: "Liskov Substitution Principle",
    badge: "SOLID",
    badgeClass: "c-solid",
    tagline: "Subtypes must honour the contract of their base types",
    catalogLabel: "Design principle",
    codeSectionLabel: "Spring Boot illustration",
    intent:
      "Objects of a superclass should be replaceable with instances of subclasses without breaking correctness of the program.",
    problem:
      "A `PremiumPaymentGateway` subclass throws on amounts under $10 “because premium has a floor”, breaking callers that relied on the interface’s promise to process any positive amount — polymorphism becomes a trap.",
    analogy:
      "Any ATM branded by your bank must accept the same card and PIN rules. A “premium” ATM cannot refuse withdrawals that standard ATMs allow — customers and networks assume substitutability.",
    solution:
      "Document preconditions and postconditions on interfaces; subclasses strengthen invariants only in ways clients already tolerate. Add contract tests that run against every implementation Spring registers.",
    code: `<span class="kw">public interface</span> <span class="ty">PaymentGateway</span> {
    <span class="cm">/** @throws PaymentRejectedException when rail declines */</span>
    <span class="ty">PaymentResult</span> capture(<span class="ty">Money</span> amount, <span class="ty">String</span> reference);
}

<span class="cm">// INVALID Liskov: narrows accepted domain vs interface expectations</span>
<span class="cm">// class PremiumStripeGateway implements PaymentGateway {</span>
<span class="cm">//   if (amount.isLessThan(Money.of(\"USD\", \"10\"))) throw new IllegalArgumentException(); }</span>

<span class="cm">// VALID: honour contract; encode business rules via Policy objects instead</span>
<span class="an">@Component</span>(<span class="str">"premiumStripe"</span>)
<span class="kw">public class</span> <span class="ty">PremiumStripeGateway</span> <span class="kw">implements</span> <span class="ty">PaymentGateway</span> {
    <span class="kw">private final</span> <span class="ty">MinimumChargePolicy</span> policy;

    <span class="kw">public</span> <span class="ty">PaymentResult</span> capture(<span class="ty">Money</span> amount, <span class="ty">String</span> reference) {
        <span class="kw">if</span> (!policy.allows(amount)) {
            <span class="kw">return</span> <span class="ty">PaymentResult</span>.declined(<span class="str">"AMOUNT_BELOW_POLICY"</span>);
        }
        <span class="cm">// delegate to Stripe — same observable contract</span>
        <span class="kw">return</span> stripeClient.capture(amount, reference);
    }
}`,
    impl: [
      "Avoid throwing more specific runtime exceptions than the interface documents — clients must not need `instanceof`.",
      "Favour composition: wrap a base behaviour and add policy rather than violate invariants in a subclass.",
      "Run parametrized tests against all `PaymentGateway` beans using the same fixture table.",
      "When in doubt, define smaller interfaces so substitutability is easier to guarantee.",
    ],
  },
  {
    name: "Interface Segregation Principle",
    badge: "SOLID",
    badgeClass: "c-solid",
    tagline: "Clients should not depend on methods they do not use",
    catalogLabel: "Design principle",
    codeSectionLabel: "Spring Boot illustration",
    intent:
      "Split fat interfaces into role-specific contracts so implementing classes and clients depend only on relevant methods.",
    problem:
      "`OmnichannelBankingPort` exposes trade finance, FX, ACH, and mobile push on one interface. A microservice that only books domestic wires is forced to stub irrelevant methods or take unwanted transitive dependencies.",
    analogy:
      "Corporate treasury signs one master agreement but executes trades through separate desks (FX vs repo). Clerks are assigned to the desk they master — nobody is handed the entire agreement to execute every clause daily.",
    solution:
      "Slice ports by caller need (`WireTransferPort`, `FxQuotePort`). Spring beans implement only the slices they truly support; adapters compose multiple interfaces when needed.",
    code: `<span class="kw">public interface</span> <span class="ty">WireTransferPort</span> {
    <span class="ty">TransferId</span> submit(<span class="ty">WireInstruction</span> instruction);
}

<span class="kw">public interface</span> <span class="ty">FxQuotePort</span> {
    <span class="ty">FxQuote</span> quote(<span class="ty">CurrencyPair</span> pair);
}

<span class="cm">// Domestic service depends ONLY on wires — no FX stubs</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">DomesticWireService</span> {
    <span class="kw">private final</span> <span class="ty">WireTransferPort</span> wires;

    <span class="kw">public</span> <span class="ty">TransferId</span> book(<span class="ty">WireInstruction</span> instruction) {
        <span class="kw">return</span> wires.submit(instruction);
    }
}

<span class="cm">// Treasury gateway implements both slices; clients stay lean</span>
<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">TreasuryGateway</span> <span class="kw">implements</span> <span class="ty">WireTransferPort</span>, <span class="ty">FxQuotePort</span> {
    <span class="cm">// ...</span>
}`,
    impl: [
      "Review interfaces when >3 methods or unrelated verb groups appear — candidate split.",
      "In Spring Data, prefer several small projection interfaces or repositories over one mega-repository facade.",
      "Keep DTO surfaces small for API consumers — internal facades can aggregate, public contracts should not.",
      "Let IDE “find implementations” guide you: if only one method is used everywhere, peel it into its own type.",
    ],
  },
  {
    name: "Dependency Inversion Principle",
    badge: "SOLID",
    badgeClass: "c-solid",
    tagline: "Depend on abstractions, not concrete implementations",
    catalogLabel: "Design principle",
    codeSectionLabel: "Spring Boot illustration",
    intent:
      "High-level modules should not depend on low-level details; both should depend on abstractions that you own.",
    problem:
      "`LoanOriginationService` imports vendor-specific SDK classes directly. Switching scoring providers or mocking in CI requires rewriting business logic — policy is fused to infrastructure.",
    analogy:
      "Loan committees decide policy from credit scores produced by any bureau — they depend on “a score provider contract”, not on how Equifax computes the number internally.",
    solution:
      "Declare ports in your domain package (`CreditScoringPort`). Infrastructure adapters implement them and are wired by Spring’s IoC container — exactly how Factories and Strategies stay testable.",
    code: `<span class="kw">package</span> com.bank.loan.domain;

<span class="kw">public interface</span> <span class="ty">CreditScoringPort</span> {
    <span class="ty">ScoreResult</span> evaluate(<span class="ty">ApplicantProfile</span> profile);
}

<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">LoanOriginationService</span> {
    <span class="kw">private final</span> <span class="ty">CreditScoringPort</span> scoring; <span class="cm">// abstraction only</span>

    <span class="kw">public</span> <span class="ty">LoanOriginationService</span>(<span class="ty">CreditScoringPort</span> scoring) {
        <span class="kw">this</span>.scoring = scoring;
    }

    <span class="kw">public</span> <span class="ty">Decision</span> decide(<span class="ty">ApplicantProfile</span> profile) {
        <span class="kw">return</span> <span class="ty">Decision</span>.from(scoring.evaluate(profile));
    }
}

<span class="cm">// Infrastructure adapter — swap beans per environment</span>
<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">EquifaxCreditAdapter</span> <span class="kw">implements</span> <span class="ty">CreditScoringPort</span> {
    <span class="cm">// wraps vendor SDK</span>
}`,
    impl: [
      "Define ports in domain modules; keep adapters in infrastructure modules (hexagonal architecture).",
      "Constructor-inject interfaces — Spring resolves concrete beans without touching consumers.",
      "Replace vendors using `@Primary`, `@Qualifier`, or profile-specific `@Configuration` classes.",
      "Use `@MockBean` on the abstraction in slice tests — domain code never imports vendor types.",
    ],
  },
];
