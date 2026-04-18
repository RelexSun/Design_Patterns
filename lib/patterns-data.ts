import { SOLID_PATTERN_RECORDS } from "./solid-patterns-data";

export const PATTERNS = {
  creational: [
    {
      name: 'Singleton',
      badge: 'Creational', badgeClass: 'c-create',
      tagline: 'Exactly one instance, globally shared',
      intent: 'Ensure a class has only one instance and provide a global access point to it.',
      problem: 'Multiple parts of the system need shared access to a single resource — e.g. a database connection pool, a configuration registry, or a rate-limiter counter. If every caller creates a new instance you get resource duplication and inconsistent state.',
      analogy: 'A country has exactly one Central Bank. Every financial institution connects to the same bank — no one spins up their own. There is one governor, one policy.',
      solution: 'Make the constructor private. Provide a static method that returns the sole instance, creating it on first call and caching it thereafter.',
      code: `<span class="cm">// Spring manages Singletons by default (@Component, @Service, @Bean)</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">FraudScoreCache</span> {

    <span class="kw">private final</span> Map&lt;String, Double&gt; cache = <span class="kw">new</span> ConcurrentHashMap&lt;&gt;();

    <span class="cm">// Spring creates ONE instance - injected everywhere</span>
    <span class="kw">public</span> <span class="ty">Double</span> getScore(<span class="ty">String</span> accountId) {
        <span class="kw">return</span> cache.get(accountId);
    }

    <span class="kw">public void</span> putScore(<span class="ty">String</span> accountId, <span class="ty">Double</span> score) {
        cache.put(accountId, score);
    }
}

<span class="cm">// Manual Singleton (thread-safe double-checked locking)</span>
<span class="kw">public class</span> <span class="ty">ConfigRegistry</span> {
    <span class="kw">private static volatile</span> <span class="ty">ConfigRegistry</span> instance;
    <span class="kw">private</span> <span class="ty">ConfigRegistry</span>() {}

    <span class="kw">public static</span> <span class="ty">ConfigRegistry</span> getInstance() {
        <span class="kw">if</span> (instance == <span class="kw">null</span>) {
            <span class="kw">synchronized</span> (<span class="ty">ConfigRegistry</span>.class) {
                <span class="kw">if</span> (instance == <span class="kw">null</span>)
                    instance = <span class="kw">new</span> <span class="ty">ConfigRegistry</span>();
            }
        }
        <span class="kw">return</span> instance;
    }
}`,
      impl: ['Annotate your class with @Service or @Component — Spring IoC container manages the lifecycle and guarantees one instance per application context.', 'If you need a non-Spring singleton, use enum-based singleton or double-checked locking with volatile keyword.', 'Avoid mutable shared state inside singletons — use thread-safe collections like ConcurrentHashMap.', 'For testing, use @MockBean to replace the singleton in integration tests without breaking the rest of the context.']
    },
    {
      name: 'Factory Method',
      badge: 'Creational', badgeClass: 'c-create',
      tagline: 'Let subclasses decide which class to instantiate',
      intent: 'Define an interface for creating an object, but let subclasses decide which class to instantiate. The factory method defers instantiation to subclasses.',
      problem: 'You need to create a payment processor — but whether it\'s Visa, Stripe, or PayPal depends on runtime data. Hardcoding new Stripe() everywhere makes it impossible to add new processors without touching every call site.',
      analogy: 'A financial institution has a "loan approval" process. Depending on whether you apply for a mortgage, auto loan, or personal loan, the approval workflow is different — but the interface is the same: submit → review → approve/reject.',
      solution: 'Define a creator interface with a factory method. Concrete creators override the method to return specific product types. Callers use the abstract interface, unaware of the concrete class.',
      code: `<span class="cm">// Product interface</span>
<span class="kw">public interface</span> <span class="ty">PaymentProcessor</span> {
    <span class="ty">PaymentResult</span> process(<span class="ty">Payment</span> payment);
}

<span class="cm">// Concrete products</span>
<span class="an">@Component("stripe")</span>
<span class="kw">public class</span> <span class="ty">StripeProcessor</span> <span class="kw">implements</span> <span class="ty">PaymentProcessor</span> {
    <span class="kw">public</span> <span class="ty">PaymentResult</span> process(<span class="ty">Payment</span> payment) {
        <span class="cm">// Call Stripe API</span>
        <span class="kw">return new</span> <span class="ty">PaymentResult</span>("stripe_txn_001", <span class="str">"SUCCESS"</span>);
    }
}

<span class="an">@Component("paypal")</span>
<span class="kw">public class</span> <span class="ty">PayPalProcessor</span> <span class="kw">implements</span> <span class="ty">PaymentProcessor</span> {
    <span class="kw">public</span> <span class="ty">PaymentResult</span> process(<span class="ty">Payment</span> payment) {
        <span class="kw">return new</span> <span class="ty">PaymentResult</span>("pp_txn_001", <span class="str">"SUCCESS"</span>);
    }
}

<span class="cm">// Factory — Spring injects all implementations by name</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">PaymentProcessorFactory</span> {

    <span class="kw">private final</span> Map&lt;String, <span class="ty">PaymentProcessor</span>&gt; processors;

    <span class="kw">public</span> <span class="ty">PaymentProcessorFactory</span>(Map&lt;String, <span class="ty">PaymentProcessor</span>&gt; processors) {
        <span class="kw">this</span>.processors = processors;
    }

    <span class="kw">public</span> <span class="ty">PaymentProcessor</span> getProcessor(<span class="ty">String</span> gateway) {
        <span class="kw">return</span> Optional.ofNullable(processors.get(gateway))
            .orElseThrow(() -> <span class="kw">new</span> <span class="ty">IllegalArgumentException</span>(<span class="str">"Unknown gateway: "</span> + gateway));
    }
}

<span class="cm">// Usage in service</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">PaymentService</span> {
    <span class="kw">private final</span> <span class="ty">PaymentProcessorFactory</span> factory;

    <span class="kw">public</span> <span class="ty">PaymentResult</span> pay(<span class="ty">PaymentRequest</span> req) {
        <span class="ty">PaymentProcessor</span> processor = factory.getProcessor(req.getGateway());
        <span class="kw">return</span> processor.process(req.toPayment());
    }
}`,
      impl: ['Create the product interface (PaymentProcessor) that all concrete products implement.', 'Annotate each concrete implementation with @Component and give it a qualifier name matching the key used in factory lookup.', 'Inject Map<String, Interface> in your factory class — Spring auto-populates it with all beans by their bean name.', 'Throw a meaningful exception in the factory when no matching implementation is found.']
    },
    {
      name: 'Abstract Factory',
      badge: 'Creational', badgeClass: 'c-create',
      tagline: 'Factories of related factories',
      intent: 'Provide an interface for creating families of related or dependent objects without specifying their concrete classes.',
      problem: 'A multi-region banking system needs different implementations of fraud detection, currency formatting, and compliance checks depending on the region (EU, US, APAC). These objects must be compatible with each other — you cannot mix EU fraud rules with US compliance.',
      analogy: 'A banking regulatory framework for each country provides a complete family of rules: KYC rules, AML rules, reporting rules. You pick one framework (EU, US, APAC) and get a consistent, compatible set of all three rule types.',
      solution: 'Define an abstract factory interface declaring creation methods for each product type. Implement one concrete factory per "family" (region). Client code only talks to the abstract factory.',
      code: `<span class="cm">// Abstract factory interface</span>
<span class="kw">public interface</span> <span class="ty">RegionalBankingFactory</span> {
    <span class="ty">FraudDetector</span>  createFraudDetector();
    <span class="ty">ComplianceChecker</span> createComplianceChecker();
    <span class="ty">CurrencyFormatter</span> createCurrencyFormatter();
}

<span class="cm">// Concrete factory — EU</span>
<span class="an">@Component("EU")</span>
<span class="kw">public class</span> <span class="ty">EUBankingFactory</span> <span class="kw">implements</span> <span class="ty">RegionalBankingFactory</span> {
    <span class="kw">public</span> <span class="ty">FraudDetector</span> createFraudDetector()
        { <span class="kw">return new</span> <span class="ty">EUFraudDetector</span>(); }
    <span class="kw">public</span> <span class="ty">ComplianceChecker</span> createComplianceChecker()
        { <span class="kw">return new</span> <span class="ty">GDPRComplianceChecker</span>(); }
    <span class="kw">public</span> <span class="ty">CurrencyFormatter</span> createCurrencyFormatter()
        { <span class="kw">return new</span> <span class="ty">EuroCurrencyFormatter</span>(); }
}

<span class="cm">// Concrete factory — US</span>
<span class="an">@Component("US")</span>
<span class="kw">public class</span> <span class="ty">USBankingFactory</span> <span class="kw">implements</span> <span class="ty">RegionalBankingFactory</span> {
    <span class="kw">public</span> <span class="ty">FraudDetector</span> createFraudDetector()
        { <span class="kw">return new</span> <span class="ty">USFraudDetector</span>(); }
    <span class="kw">public</span> <span class="ty">ComplianceChecker</span> createComplianceChecker()
        { <span class="kw">return new</span> <span class="ty">DoddFrankComplianceChecker</span>(); }
    <span class="kw">public</span> <span class="ty">CurrencyFormatter</span> createCurrencyFormatter()
        { <span class="kw">return new</span> <span class="ty">USDCurrencyFormatter</span>(); }
}

<span class="cm">// Service uses abstract factory only</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">TransactionService</span> {
    <span class="kw">private final</span> Map&lt;String, <span class="ty">RegionalBankingFactory</span>&gt; factories;

    <span class="kw">public</span> <span class="ty">TransactionResult</span> process(<span class="ty">Transaction</span> tx) {
        <span class="ty">RegionalBankingFactory</span> factory = factories.get(tx.getRegion());
        <span class="ty">FraudDetector</span> fraud = factory.createFraudDetector();
        <span class="ty">ComplianceChecker</span> compliance = factory.createComplianceChecker();
        <span class="cm">// All from same family — guaranteed compatible</span>
        fraud.analyse(tx);
        compliance.check(tx);
        <span class="kw">return</span> <span class="ty">TransactionResult</span>.success();
    }
}`,
      impl: ['Define an interface for each product type (FraudDetector, ComplianceChecker, CurrencyFormatter).', 'Create the abstract factory interface with one creation method per product.', 'Implement one concrete factory per product family. Annotate with @Component and a qualifier.', 'Inject Map<String, RegionalBankingFactory> to let Spring wire all factories automatically.']
    },
    {
      name: 'Builder',
      badge: 'Creational', badgeClass: 'c-create',
      tagline: 'Step-by-step object construction',
      intent: 'Separate the construction of a complex object from its representation so the same construction process can create different representations.',
      problem: 'A loan application object has 20+ fields — mandatory, optional, with validation. Constructors with 20 parameters are unreadable. Multiple overloaded constructors lead to the "telescoping constructor" anti-pattern.',
      analogy: 'When a corporate client arranges a complex structured finance deal, a relationship manager collects requirements step-by-step: loan amount, tenor, collateral, covenants, interest type. Only when all required information is collected does the bank issue a term sheet.',
      solution: 'Create a separate Builder class with fluent setter methods for each field. A final build() method validates and creates the immutable object.',
      code: `<span class="cm">// Immutable domain object with Builder</span>
<span class="kw">public class</span> <span class="ty">LoanApplication</span> {
    <span class="kw">private final</span> <span class="ty">String</span>  applicantId;
    <span class="kw">private final</span> <span class="ty">BigDecimal</span> amount;
    <span class="kw">private final</span> <span class="ty">String</span>  currency;
    <span class="kw">private final</span> <span class="ty">Integer</span> tenorMonths;
    <span class="kw">private final</span> <span class="ty">LoanType</span> type;
    <span class="kw">private final</span> <span class="ty">String</span>  collateral;     <span class="cm">// optional</span>
    <span class="kw">private final</span> <span class="ty">Double</span>  interestRate;   <span class="cm">// optional</span>

    <span class="kw">private</span> <span class="ty">LoanApplication</span>(<span class="ty">Builder</span> b) {
        <span class="kw">this</span>.applicantId = b.applicantId;
        <span class="kw">this</span>.amount      = b.amount;
        <span class="kw">this</span>.currency    = b.currency;
        <span class="kw">this</span>.tenorMonths = b.tenorMonths;
        <span class="kw">this</span>.type        = b.type;
        <span class="kw">this</span>.collateral  = b.collateral;
        <span class="kw">this</span>.interestRate = b.interestRate;
    }

    <span class="kw">public static class</span> <span class="ty">Builder</span> {
        <span class="kw">private</span> <span class="ty">String</span>  applicantId;
        <span class="kw">private</span> <span class="ty">BigDecimal</span> amount;
        <span class="kw">private</span> <span class="ty">String</span>  currency = <span class="str">"USD"</span>;
        <span class="kw">private</span> <span class="ty">Integer</span> tenorMonths;
        <span class="kw">private</span> <span class="ty">LoanType</span> type;
        <span class="kw">private</span> <span class="ty">String</span>  collateral;
        <span class="kw">private</span> <span class="ty">Double</span>  interestRate;

        <span class="kw">public</span> <span class="ty">Builder</span> applicantId(<span class="ty">String</span> id)   { <span class="kw">this</span>.applicantId = id; <span class="kw">return this</span>; }
        <span class="kw">public</span> <span class="ty">Builder</span> amount(<span class="ty">BigDecimal</span> amt)    { <span class="kw">this</span>.amount = amt;      <span class="kw">return this</span>; }
        <span class="kw">public</span> <span class="ty">Builder</span> currency(<span class="ty">String</span> cur)      { <span class="kw">this</span>.currency = cur;    <span class="kw">return this</span>; }
        <span class="kw">public</span> <span class="ty">Builder</span> tenorMonths(<span class="ty">Integer</span> t)   { <span class="kw">this</span>.tenorMonths = t;   <span class="kw">return this</span>; }
        <span class="kw">public</span> <span class="ty">Builder</span> type(<span class="ty">LoanType</span> t)         { <span class="kw">this</span>.type = t;          <span class="kw">return this</span>; }
        <span class="kw">public</span> <span class="ty">Builder</span> collateral(<span class="ty">String</span> c)      { <span class="kw">this</span>.collateral = c;    <span class="kw">return this</span>; }
        <span class="kw">public</span> <span class="ty">Builder</span> interestRate(<span class="ty">Double</span> r)   { <span class="kw">this</span>.interestRate = r;  <span class="kw">return this</span>; }

        <span class="kw">public</span> <span class="ty">LoanApplication</span> build() {
            <span class="kw">if</span> (applicantId == <span class="kw">null</span> || amount == <span class="kw">null</span> || tenorMonths == <span class="kw">null</span>)
                <span class="kw">throw new</span> <span class="ty">IllegalStateException</span>(<span class="str">"Required fields missing"</span>);
            <span class="kw">return new</span> <span class="ty">LoanApplication</span>(<span class="kw">this</span>);
        }
    }
}

<span class="cm">// Usage — fluent, readable, safe</span>
<span class="ty">LoanApplication</span> loan = <span class="kw">new</span> <span class="ty">LoanApplication</span>.Builder()
    .applicantId(<span class="str">"CUST-0042"</span>)
    .amount(<span class="ty">BigDecimal</span>.valueOf(<span class="str">500_000</span>))
    .currency(<span class="str">"SGD"</span>)
    .tenorMonths(<span class="str">60</span>)
    .type(<span class="ty">LoanType</span>.MORTGAGE)
    .interestRate(<span class="str">3.5</span>)
    .build();

<span class="cm">// Or use Lombok @Builder to eliminate boilerplate</span>
<span class="an">@Builder</span>
<span class="an">@Value</span>
<span class="kw">public class</span> <span class="ty">TransferRequest</span> {
    <span class="ty">String</span> fromAccount;
    <span class="ty">String</span> toAccount;
    <span class="ty">BigDecimal</span> amount;
    <span class="ty">String</span> reference;
}`,
      impl: ['Use Lombok @Builder annotation to auto-generate the builder — eliminates 90% of boilerplate.', 'Pair with @Value (Lombok) to make the built object fully immutable.', 'Validate required fields in the build() method before constructing the object.', 'For Spring request DTOs, use @Builder on record classes — excellent for clean REST APIs.']
    },
    {
      name: 'Prototype',
      badge: 'Creational', badgeClass: 'c-create',
      tagline: 'Clone existing objects efficiently',
      intent: 'Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.',
      problem: 'Creating a new transaction template is expensive — it involves fetching default settings, compliance rules, fee schedules from the database. When a user wants to create 100 similar transactions, constructing each from scratch is wasteful.',
      analogy: 'A bank has standard loan agreement templates. When a new loan is issued, the bank copies the standard template and fills in the specific client details — it doesn\'t draft a new agreement from scratch each time.',
      solution: 'Implement Cloneable or a custom copy() method on domain objects. The prototype registry stores pre-configured instances ready to be cloned.',
      code: `<span class="cm">// Prototype interface</span>
<span class="kw">public interface</span> <span class="ty">TransactionTemplate</span> {
    <span class="ty">TransactionTemplate</span> clone();
    <span class="kw">void</span> setAmount(<span class="ty">BigDecimal</span> amount);
    <span class="kw">void</span> setReference(<span class="ty">String</span> ref);
}

<span class="cm">// Concrete prototype</span>
<span class="kw">public class</span> <span class="ty">WireTransferTemplate</span> <span class="kw">implements</span> <span class="ty">TransactionTemplate</span> {
    <span class="kw">private</span> <span class="ty">String</span> fromAccount;
    <span class="kw">private</span> <span class="ty">String</span> toAccount;
    <span class="kw">private</span> <span class="ty">String</span> currency;
    <span class="kw">private</span> <span class="ty">BigDecimal</span> amount;
    <span class="kw">private</span> <span class="ty">String</span> reference;
    <span class="cm">// getters/setters omitted</span>

    <span class="an">@Override</span>
    <span class="kw">public</span> <span class="ty">TransactionTemplate</span> clone() {
        <span class="ty">WireTransferTemplate</span> copy = <span class="kw">new</span> <span class="ty">WireTransferTemplate</span>();
        copy.fromAccount = <span class="kw">this</span>.fromAccount;
        copy.toAccount   = <span class="kw">this</span>.toAccount;
        copy.currency    = <span class="kw">this</span>.currency;
        <span class="cm">// amount and reference are per-transaction, not copied</span>
        <span class="kw">return</span> copy;
    }
}

<span class="cm">// Prototype registry — Spring bean</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">TransactionTemplateRegistry</span> {

    <span class="kw">private final</span> Map&lt;String, <span class="ty">TransactionTemplate</span>&gt; templates = <span class="kw">new</span> HashMap&lt;&gt;();

    <span class="an">@PostConstruct</span>
    <span class="kw">public void</span> init() {
        <span class="ty">WireTransferTemplate</span> wire = <span class="kw">new</span> <span class="ty">WireTransferTemplate</span>();
        wire.setFromAccount(<span class="str">"NOSTRO-USD-001"</span>);
        wire.setCurrency(<span class="str">"USD"</span>);
        templates.put(<span class="str">"WIRE_USD"</span>, wire);
    }

    <span class="kw">public</span> <span class="ty">TransactionTemplate</span> getTemplate(<span class="ty">String</span> key) {
        <span class="kw">return</span> templates.get(key).clone(); <span class="cm">// always a fresh clone</span>
    }
}

<span class="cm">// Usage — no expensive DB call per transaction</span>
<span class="ty">TransactionTemplate</span> tx = registry.getTemplate(<span class="str">"WIRE_USD"</span>);
tx.setAmount(<span class="ty">BigDecimal</span>.valueOf(<span class="str">10_000</span>));
tx.setReference(<span class="str">"INV-2024-0091"</span>);`,
      impl: ['Implement a deep clone that copies all mutable sub-objects, not just top-level fields.', 'Use a @PostConstruct method to warm up the template registry with pre-built prototypes.', 'Use @Scope("prototype") in Spring to have Spring create a new instance every injection — this is Spring\'s take on the Prototype pattern.', 'For complex graphs, consider serializing to JSON and deserializing as an alternative to manual cloning.']
    }
  ],
  structural: [
    {
      name: 'Adapter',
      badge: 'Structural', badgeClass: 'c-struct',
      tagline: 'Make incompatible interfaces work together',
      intent: 'Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn\'t otherwise because of incompatible interfaces.',
      problem: 'Your system uses an internal transaction model, but you need to integrate with a SWIFT messaging gateway that speaks ISO 20022 XML format. The two interfaces are completely different.',
      analogy: 'A traveler from the US visits the UK. Their appliance has a US plug (Type A), but UK sockets are Type G. A travel adapter converts one interface to the other — neither device changes.',
      solution: 'Create an Adapter class that implements the target interface (your internal model) and wraps the adaptee (external gateway). The adapter translates calls from your format to the external format.',
      code: `<span class="cm">// Target interface — what your system speaks</span>
<span class="kw">public interface</span> <span class="ty">PaymentGateway</span> {
    <span class="ty">PaymentConfirmation</span> sendPayment(<span class="ty">InternalPayment</span> payment);
}

<span class="cm">// Adaptee — external SWIFT service (incompatible interface)</span>
<span class="kw">public class</span> <span class="ty">SwiftGatewayClient</span> {
    <span class="kw">public</span> <span class="ty">SwiftResponse</span> transmitMT103(<span class="ty">String</span> xml) {
        <span class="cm">// Sends ISO 20022 XML over SWIFT network</span>
        <span class="kw">return</span> swiftApi.transmit(xml);
    }
}

<span class="cm">// Adapter — wraps SWIFT client, speaks InternalPayment</span>
<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">SwiftPaymentAdapter</span> <span class="kw">implements</span> <span class="ty">PaymentGateway</span> {

    <span class="kw">private final</span> <span class="ty">SwiftGatewayClient</span> swiftClient;
    <span class="kw">private final</span> <span class="ty">Iso20022Mapper</span>    mapper;

    <span class="an">@Override</span>
    <span class="kw">public</span> <span class="ty">PaymentConfirmation</span> sendPayment(<span class="ty">InternalPayment</span> payment) {
        <span class="ty">String</span> xml = mapper.toMT103Xml(payment);
        <span class="ty">SwiftResponse</span> resp = swiftClient.transmitMT103(xml);
        <span class="kw">return</span> mapper.toConfirmation(resp);
    }
}

<span class="cm">// Seamless integration — service doesn't know about SWIFT</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">TransferService</span> {
    <span class="kw">private final</span> <span class="ty">PaymentGateway</span> gateway; <span class="cm">// injected = SwiftPaymentAdapter</span>

    <span class="kw">public void</span> transfer(<span class="ty">TransferRequest</span> req) {
        <span class="ty">InternalPayment</span> payment = <span class="kw">new</span> <span class="ty">InternalPayment</span>(req);
        gateway.sendPayment(payment); <span class="cm">// works regardless of backend</span>
    }
}`,
      impl: ['Define the target interface representing the abstraction your application needs.', 'Inject the external client (adaptee) into the adapter — don\'t let it escape the adapter class.', 'The adapter\'s job is translation only — keep business logic in your service, not in the adapter.', 'Write unit tests against the target interface using mocks — the adapter becomes swappable.']
    },
    {
      name: 'Decorator',
      badge: 'Structural', badgeClass: 'c-struct',
      tagline: 'Add behaviour without modifying the class',
      intent: 'Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.',
      problem: 'A payment service needs logging, metrics, retry logic, and audit trail — but only some combinations are needed in different contexts. Putting all of this in one class violates single responsibility.',
      analogy: 'A bank debit card is the base product. You can add travel insurance, purchase protection, and cashback rewards on top — each feature wraps the card, adding behaviour without replacing it.',
      solution: 'Create a decorator class that implements the same interface as the component, holds a reference to it, and adds behaviour before or after delegating to the wrapped object.',
      code: `<span class="cm">// Component interface</span>
<span class="kw">public interface</span> <span class="ty">AccountService</span> {
    <span class="ty">Account</span> getAccount(<span class="ty">String</span> id);
    <span class="kw">void</span>    debit(<span class="ty">String</span> id, <span class="ty">BigDecimal</span> amount);
}

<span class="cm">// Base implementation</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">AccountServiceImpl</span> <span class="kw">implements</span> <span class="ty">AccountService</span> { ... }

<span class="cm">// Logging decorator</span>
<span class="kw">public class</span> <span class="ty">LoggingAccountService</span> <span class="kw">implements</span> <span class="ty">AccountService</span> {
    <span class="kw">private final</span> <span class="ty">AccountService</span> delegate;
    <span class="kw">private final</span> <span class="ty">Logger</span> log = LoggerFactory.getLogger(getClass());

    <span class="kw">public</span> <span class="ty">Account</span> getAccount(<span class="ty">String</span> id) {
        log.info(<span class="str">"Fetching account {}"</span>, id);
        <span class="ty">Account</span> a = delegate.getAccount(id);
        log.info(<span class="str">"Account {} fetched, balance={}"</span>, id, a.getBalance());
        <span class="kw">return</span> a;
    }

    <span class="kw">public void</span> debit(<span class="ty">String</span> id, <span class="ty">BigDecimal</span> amount) {
        log.info(<span class="str">"Debiting {} from {}"</span>, amount, id);
        delegate.debit(id, amount);
    }
}

<span class="cm">// Audit decorator</span>
<span class="kw">public class</span> <span class="ty">AuditAccountService</span> <span class="kw">implements</span> <span class="ty">AccountService</span> {
    <span class="kw">private final</span> <span class="ty">AccountService</span> delegate;
    <span class="kw">private final</span> <span class="ty">AuditTrailRepository</span> audit;

    <span class="kw">public void</span> debit(<span class="ty">String</span> id, <span class="ty">BigDecimal</span> amount) {
        delegate.debit(id, amount);
        audit.record(<span class="kw">new</span> <span class="ty">AuditEntry</span>(id, <span class="str">"DEBIT"</span>, amount, <span class="ty">Instant</span>.now()));
    }

    <span class="kw">public</span> <span class="ty">Account</span> getAccount(<span class="ty">String</span> id) { <span class="kw">return</span> delegate.getAccount(id); }
}

<span class="cm">// Wired in @Configuration — stack decorators</span>
<span class="an">@Bean</span>
<span class="kw">public</span> <span class="ty">AccountService</span> accountService(<span class="ty">AccountServiceImpl</span> base,
                                       <span class="ty">AuditTrailRepository</span> audit) {
    <span class="kw">return new</span> <span class="ty">LoggingAccountService</span>(
               <span class="kw">new</span> <span class="ty">AuditAccountService</span>(base, audit));
}

<span class="cm">// In practice Spring AOP does this more elegantly:</span>
<span class="an">@Aspect @Component</span>
<span class="kw">public class</span> <span class="ty">AuditAspect</span> {
    <span class="an">@After</span>(<span class="str">"execution(* AccountService.debit(..))"</span>)
    <span class="kw">public void</span> audit(<span class="ty">JoinPoint</span> jp) { ... }
}`,
      impl: ['Spring AOP (@Aspect) is the framework-level implementation of Decorator — use it for cross-cutting concerns like logging, metrics, security.', 'For explicit wrapping, define the base implementation and decorators in a @Configuration class.', 'Keep each decorator focused on one concern — don\'t combine logging and auditing in one decorator.', 'Order decorators carefully — auditing should run after the operation succeeds.']
    },
    {
      name: 'Proxy',
      badge: 'Structural', badgeClass: 'c-struct',
      tagline: 'Control access to an object',
      intent: 'Provide a surrogate or placeholder for another object to control access to it.',
      problem: 'Fetching account balances involves expensive database queries. Every API call hits the DB. You need to add caching without modifying the AccountRepository class.',
      analogy: 'An ATM is a proxy for your bank account. You don\'t walk into the vault to get cash. The ATM authenticates you, controls access, logs the transaction, and gives you a limited cached view of your balance.',
      solution: 'Create a proxy class that implements the same interface as the real subject. The proxy controls access — adding caching, access control, lazy loading, or logging — before delegating to the real object.',
      code: `<span class="cm">// Subject interface</span>
<span class="kw">public interface</span> <span class="ty">AccountRepository</span> {
    <span class="ty">Optional</span>&lt;<span class="ty">Account</span>&gt; findById(<span class="ty">String</span> id);
    <span class="kw">void</span> save(<span class="ty">Account</span> account);
}

<span class="cm">// Real subject</span>
<span class="an">@Repository</span>
<span class="kw">public class</span> <span class="ty">JpaAccountRepository</span> <span class="kw">implements</span> <span class="ty">AccountRepository</span> {
    <span class="kw">public</span> <span class="ty">Optional</span>&lt;<span class="ty">Account</span>&gt; findById(<span class="ty">String</span> id) { <span class="cm">/* DB call */</span> }
    <span class="kw">public void</span> save(<span class="ty">Account</span> a) { <span class="cm">/* DB write */</span> }
}

<span class="cm">// Caching proxy</span>
<span class="kw">public class</span> <span class="ty">CachingAccountRepository</span> <span class="kw">implements</span> <span class="ty">AccountRepository</span> {
    <span class="kw">private final</span> <span class="ty">AccountRepository</span>             real;
    <span class="kw">private final</span> Map&lt;String, <span class="ty">Account</span>&gt;          cache = <span class="kw">new</span> ConcurrentHashMap&lt;&gt;();

    <span class="kw">public</span> <span class="ty">Optional</span>&lt;<span class="ty">Account</span>&gt; findById(<span class="ty">String</span> id) {
        <span class="kw">if</span> (cache.containsKey(id)) <span class="kw">return</span> <span class="ty">Optional</span>.of(cache.get(id));
        <span class="ty">Optional</span>&lt;<span class="ty">Account</span>&gt; result = real.findById(id);
        result.ifPresent(a -> cache.put(id, a));
        <span class="kw">return</span> result;
    }

    <span class="kw">public void</span> save(<span class="ty">Account</span> a) {
        real.save(a);
        cache.put(a.getId(), a); <span class="cm">// keep cache consistent</span>
    }
}

<span class="cm">// Spring @Cacheable does this declaratively</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">AccountService</span> {
    <span class="kw">private final</span> <span class="ty">AccountRepository</span> repo;

    <span class="an">@Cacheable</span>(value = <span class="str">"accounts"</span>, key = <span class="str">"#id"</span>)
    <span class="kw">public</span> <span class="ty">Account</span> getAccount(<span class="ty">String</span> id) {
        <span class="kw">return</span> repo.findById(id).orElseThrow();
    }

    <span class="an">@CacheEvict</span>(value = <span class="str">"accounts"</span>, key = <span class="str">"#account.id"</span>)
    <span class="kw">public void</span> updateAccount(<span class="ty">Account</span> account) {
        repo.save(account);
    }
}`,
      impl: ['Use Spring\'s @Cacheable, @CacheEvict, @CachePut for the caching proxy pattern without writing any proxy class.', 'Configure a CacheManager bean — Redis for distributed caching, Caffeine for in-process.', 'Spring\'s @Transactional is also a proxy — the container wraps every @Transactional method in a proxy that opens/commits/rolls back transactions.', 'For security proxy, use Spring Security\'s method-level @PreAuthorize — another proxy intercepting calls.']
    },
    {
      name: 'Facade',
      badge: 'Structural', badgeClass: 'c-struct',
      tagline: 'Simplify a complex subsystem',
      intent: 'Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.',
      problem: 'Onboarding a new bank customer requires calling KYC service, credit scoring service, account creation service, notification service, and compliance registry — in the right order. Every onboarding flow would need to know all of these services.',
      analogy: 'When you call your bank\'s single customer service number, the agent coordinates everything internally — they call the right departments, handle sequencing. You don\'t need to call KYC, compliance, and IT separately.',
      solution: 'Create a Facade class that orchestrates the subsystem calls in the right order and exposes a single simple method to the caller.',
      code: `<span class="cm">// Complex subsystem services</span>
<span class="an">@Service</span> <span class="kw">public class</span> <span class="ty">KycService</span>        { <span class="kw">public</span> <span class="ty">KycResult</span> verify(<span class="ty">Customer</span> c) {...} }
<span class="an">@Service</span> <span class="kw">public class</span> <span class="ty">CreditScoringService</span> { <span class="kw">public</span> <span class="ty">CreditScore</span> score(<span class="ty">Customer</span> c) {...} }
<span class="an">@Service</span> <span class="kw">public class</span> <span class="ty">AccountCreationService</span>{ <span class="kw">public</span> <span class="ty">Account</span>  create(<span class="ty">Customer</span> c) {...} }
<span class="an">@Service</span> <span class="kw">public class</span> <span class="ty">NotificationService</span>   { <span class="kw">public void</span> sendWelcome(<span class="ty">String</span> email) {...} }
<span class="an">@Service</span> <span class="kw">public class</span> <span class="ty">ComplianceRegistry</span>   { <span class="kw">public void</span> register(<span class="ty">Customer</span> c) {...} }

<span class="cm">// Facade — single entry point for customer onboarding</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">CustomerOnboardingFacade</span> {
    <span class="kw">private final</span> <span class="ty">KycService</span>           kyc;
    <span class="kw">private final</span> <span class="ty">CreditScoringService</span>  credit;
    <span class="kw">private final</span> <span class="ty">AccountCreationService</span> accounts;
    <span class="kw">private final</span> <span class="ty">NotificationService</span>    notify;
    <span class="kw">private final</span> <span class="ty">ComplianceRegistry</span>    compliance;

    <span class="kw">public</span> <span class="ty">OnboardingResult</span> onboard(<span class="ty">OnboardingRequest</span> req) {
        <span class="ty">Customer</span> customer = req.toCustomer();

        <span class="cm">// 1. KYC verification</span>
        <span class="ty">KycResult</span> kycResult = kyc.verify(customer);
        <span class="kw">if</span> (!kycResult.isPassed())
            <span class="kw">return</span> <span class="ty">OnboardingResult</span>.rejected(<span class="str">"KYC failed"</span>);

        <span class="cm">// 2. Credit scoring</span>
        <span class="ty">CreditScore</span> score = credit.score(customer);

        <span class="cm">// 3. Create account</span>
        <span class="ty">Account</span> account = accounts.create(customer);

        <span class="cm">// 4. Register with compliance</span>
        compliance.register(customer);

        <span class="cm">// 5. Send welcome email</span>
        notify.sendWelcome(customer.getEmail());

        <span class="kw">return</span> <span class="ty">OnboardingResult</span>.success(account, score);
    }
}

<span class="cm">// Controller uses only the Facade</span>
<span class="an">@RestController</span>
<span class="kw">public class</span> <span class="ty">OnboardingController</span> {
    <span class="kw">private final</span> <span class="ty">CustomerOnboardingFacade</span> facade;

    <span class="an">@PostMapping</span>(<span class="str">"/onboard"</span>)
    <span class="kw">public</span> <span class="ty">ResponseEntity</span>&lt;<span class="ty">OnboardingResult</span>&gt; onboard(
            <span class="an">@RequestBody</span> <span class="ty">OnboardingRequest</span> req) {
        <span class="kw">return</span> ResponseEntity.ok(facade.onboard(req));
    }
}`,
      impl: ['The Facade should be the only class the controller imports — subsystem services should not be directly injected into controllers.', 'Keep the Facade as an orchestrator only — move business logic into the individual subsystem services.', 'Add @Transactional on the Facade method if the subsystem calls should be atomic.', 'The Facade is an excellent boundary for integration testing — test the whole onboarding flow through one entry point.']
    },
    {
      name: 'Bridge',
      badge: 'Structural', badgeClass: 'c-struct',
      tagline: 'Decouple abstraction from implementation',
      intent: 'Decouple an abstraction from its implementation so the two can vary independently.',
      problem: 'A payment notification system must support SMS, Email, and Push — and each notification type (payment received, payment failed, low balance) has different content. Without Bridge, you end up with classes like SMSPaymentReceived, EmailPaymentReceived, PushPaymentReceived, SMSPaymentFailed... combinatorial explosion.',
      analogy: 'A remote control (abstraction) works independently of the TV brand (implementation). You can have Sony remotes, Samsung remotes, universal remotes — each can operate any TV brand. The remote and TV vary independently.',
      solution: 'Separate the notification type (abstraction hierarchy) from the delivery channel (implementation hierarchy). The abstraction holds a reference to the implementation interface.',
      code: `<span class="cm">// Implementation interface (delivery channel)</span>
<span class="kw">public interface</span> <span class="ty">NotificationChannel</span> {
    <span class="kw">void</span> send(<span class="ty">String</span> recipient, <span class="ty">String</span> subject, <span class="ty">String</span> body);
}

<span class="cm">// Concrete implementations</span>
<span class="an">@Component("sms")</span>
<span class="kw">public class</span> <span class="ty">SmsChannel</span> <span class="kw">implements</span> <span class="ty">NotificationChannel</span> {
    <span class="kw">public void</span> send(<span class="ty">String</span> to, <span class="ty">String</span> subject, <span class="ty">String</span> body)
        { smsGateway.dispatch(to, body); }
}

<span class="an">@Component("email")</span>
<span class="kw">public class</span> <span class="ty">EmailChannel</span> <span class="kw">implements</span> <span class="ty">NotificationChannel</span> {
    <span class="kw">public void</span> send(<span class="ty">String</span> to, <span class="ty">String</span> subject, <span class="ty">String</span> body)
        { emailClient.send(to, subject, body); }
}

<span class="cm">// Abstraction — notification type holds a channel reference</span>
<span class="kw">public abstract class</span> <span class="ty">BankingNotification</span> {
    <span class="kw">protected final</span> <span class="ty">NotificationChannel</span> channel;
    <span class="kw">protected</span> <span class="ty">BankingNotification</span>(<span class="ty">NotificationChannel</span> channel) {
        <span class="kw">this</span>.channel = channel;
    }
    <span class="kw">public abstract void</span> notify(<span class="ty">Customer</span> customer, <span class="ty">Map</span>&lt;String, Object&gt; data);
}

<span class="cm">// Refined abstraction</span>
<span class="kw">public class</span> <span class="ty">PaymentReceivedNotification</span> <span class="kw">extends</span> <span class="ty">BankingNotification</span> {
    <span class="kw">public void</span> notify(<span class="ty">Customer</span> c, <span class="ty">Map</span>&lt;String, Object&gt; data) {
        channel.send(c.getContact(),
            <span class="str">"Payment Received"</span>,
            <span class="str">"You received $"</span> + data.get(<span class="str">"amount"</span>));
    }
}

<span class="kw">public class</span> <span class="ty">LowBalanceNotification</span> <span class="kw">extends</span> <span class="ty">BankingNotification</span> {
    <span class="kw">public void</span> notify(<span class="ty">Customer</span> c, <span class="ty">Map</span>&lt;String, Object&gt; data) {
        channel.send(c.getContact(),
            <span class="str">"Low Balance Alert"</span>,
            <span class="str">"Balance $"</span> + data.get(<span class="str">"balance"</span>) + <span class="str">" below threshold"</span>);
    }
}

<span class="cm">// Usage — mix any abstraction with any implementation</span>
<span class="ty">NotificationChannel</span> sms = context.getBean(<span class="str">"sms"</span>, <span class="ty">NotificationChannel</span>.class);
<span class="ty">BankingNotification</span> alert = <span class="kw">new</span> <span class="ty">LowBalanceNotification</span>(sms);
alert.notify(customer, Map.of(<span class="str">"balance"</span>, <span class="str">45.00</span>));`,
      impl: ['Define the implementation interface first — this is the "implementation" side of the bridge.', 'Inject the channel into the abstraction via constructor — this IS the bridge connection.', 'Concrete notification types (abstraction) only call channel.send() — they don\'t know if it\'s SMS or email.', 'Use a factory or configuration to assemble notification + channel pairs at startup time.']
    },
    {
      name: 'Composite',
      badge: 'Structural', badgeClass: 'c-struct',
      tagline: 'Treat individual and group objects uniformly',
      intent: 'Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.',
      problem: 'A bank calculates fees across individual accounts and account portfolios (which contain sub-portfolios and individual accounts). The fee calculation logic needs to traverse the entire tree recursively.',
      analogy: 'A bank has branches, which have departments, which have employees. Calculating total salary cost should work the same way regardless of whether you\'re asking for a single employee\'s salary, a department\'s total, or the entire bank\'s cost.',
      solution: 'Define a Component interface implemented by both leaf objects (individual accounts) and composite objects (portfolios). The composite stores a list of children and delegates operations to them.',
      code: `<span class="cm">// Component interface</span>
<span class="kw">public interface</span> <span class="ty">FinancialComponent</span> {
    <span class="ty">BigDecimal</span> calculateFee();
    <span class="ty">BigDecimal</span> getTotalBalance();
    <span class="ty">String</span>     getName();
}

<span class="cm">// Leaf — individual account</span>
<span class="kw">public class</span> <span class="ty">BankAccount</span> <span class="kw">implements</span> <span class="ty">FinancialComponent</span> {
    <span class="kw">private final</span> <span class="ty">String</span>     name;
    <span class="kw">private final</span> <span class="ty">BigDecimal</span> balance;
    <span class="kw">private static final</span> <span class="ty">BigDecimal</span> FEE_RATE = BigDecimal.valueOf(0.001);

    <span class="kw">public</span> <span class="ty">BigDecimal</span> calculateFee()    { <span class="kw">return</span> balance.multiply(FEE_RATE); }
    <span class="kw">public</span> <span class="ty">BigDecimal</span> getTotalBalance()  { <span class="kw">return</span> balance; }
    <span class="kw">public</span> <span class="ty">String</span>     getName()          { <span class="kw">return</span> name; }
}

<span class="cm">// Composite — portfolio containing accounts or sub-portfolios</span>
<span class="kw">public class</span> <span class="ty">AccountPortfolio</span> <span class="kw">implements</span> <span class="ty">FinancialComponent</span> {
    <span class="kw">private final</span> <span class="ty">String</span>     name;
    <span class="kw">private final</span> List&lt;<span class="ty">FinancialComponent</span>&gt; children = <span class="kw">new</span> ArrayList&lt;&gt;();

    <span class="kw">public void</span> add(<span class="ty">FinancialComponent</span> c) { children.add(c); }
    <span class="kw">public void</span> remove(<span class="ty">FinancialComponent</span> c) { children.remove(c); }

    <span class="kw">public</span> <span class="ty">BigDecimal</span> calculateFee() {
        <span class="kw">return</span> children.stream()
            .map(<span class="ty">FinancialComponent</span>::calculateFee)
            .reduce(<span class="ty">BigDecimal</span>.ZERO, <span class="ty">BigDecimal</span>::add);
    }

    <span class="kw">public</span> <span class="ty">BigDecimal</span> getTotalBalance() {
        <span class="kw">return</span> children.stream()
            .map(<span class="ty">FinancialComponent</span>::getTotalBalance)
            .reduce(<span class="ty">BigDecimal</span>.ZERO, <span class="ty">BigDecimal</span>::add);
    }

    <span class="kw">public</span> <span class="ty">String</span> getName() { <span class="kw">return</span> name; }
}

<span class="cm">// Build tree and calculate fees uniformly</span>
<span class="ty">AccountPortfolio</span> corporate = <span class="kw">new</span> <span class="ty">AccountPortfolio</span>(<span class="str">"Acme Corp"</span>);
<span class="ty">AccountPortfolio</span> trading   = <span class="kw">new</span> <span class="ty">AccountPortfolio</span>(<span class="str">"Trading Desk"</span>);
trading.add(<span class="kw">new</span> <span class="ty">BankAccount</span>(<span class="str">"USD Spot"</span>, BigDecimal.valueOf(1_000_000)));
trading.add(<span class="kw">new</span> <span class="ty">BankAccount</span>(<span class="str">"EUR Spot"</span>, BigDecimal.valueOf(500_000)));
corporate.add(trading);
corporate.add(<span class="kw">new</span> <span class="ty">BankAccount</span>(<span class="str">"Savings"</span>, BigDecimal.valueOf(2_000_000)));

<span class="ty">BigDecimal</span> totalFee = corporate.calculateFee(); <span class="cm">// traverses entire tree</span>`,
      impl: ['Define the Component interface with only methods meaningful to both leaf and composite.', 'Leaf classes implement the logic directly; Composite classes delegate to their children.', 'Use stream().map().reduce() for aggregation in composite methods — clean and functional.', 'This pattern maps naturally to JPA entity hierarchies using @Inheritance(strategy = InheritanceType.JOINED).']
    },
    {
      name: 'Flyweight',
      badge: 'Structural', badgeClass: 'c-struct',
      tagline: 'Share state across many fine-grained objects',
      intent: 'Use sharing to support large numbers of fine-grained objects efficiently.',
      problem: 'A trading platform tracks millions of market data ticks per second. Each tick object has a currency pair, exchange, and decimal value. Creating millions of objects with repeated currency pair strings wastes heap memory.',
      analogy: 'A bank prints millions of banknotes. The serial number is unique per note (extrinsic state). But the design, artwork, and denomination are shared (intrinsic state) — the printing plate is reused.',
      solution: 'Separate intrinsic (shared, immutable) state from extrinsic (unique, context-dependent) state. Cache intrinsic objects in a factory. Extrinsic state is passed in at call time.',
      code: `<span class="cm">// Flyweight — intrinsic (shared) state</span>
<span class="kw">public class</span> <span class="ty">CurrencyPair</span> {
    <span class="kw">private final</span> <span class="ty">String</span> base;
    <span class="kw">private final</span> <span class="ty">String</span> quote;
    <span class="kw">private final</span> <span class="ty">String</span> symbol;

    <span class="kw">public</span> <span class="ty">CurrencyPair</span>(<span class="ty">String</span> base, <span class="ty">String</span> quote) {
        <span class="kw">this</span>.base   = base;
        <span class="kw">this</span>.quote  = quote;
        <span class="kw">this</span>.symbol = base + <span class="str">"/"</span> + quote;
    }
    <span class="cm">// getters, equals, hashCode</span>
}

<span class="cm">// Flyweight factory — caches and returns shared instances</span>
<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">CurrencyPairRegistry</span> {

    <span class="kw">private final</span> Map&lt;String, <span class="ty">CurrencyPair</span>&gt; pool = <span class="kw">new</span> ConcurrentHashMap&lt;&gt;();

    <span class="kw">public</span> <span class="ty">CurrencyPair</span> get(<span class="ty">String</span> base, <span class="ty">String</span> quote) {
        <span class="ty">String</span> key = base + quote;
        <span class="kw">return</span> pool.computeIfAbsent(key, k -> <span class="kw">new</span> <span class="ty">CurrencyPair</span>(base, quote));
    }
}

<span class="cm">// Tick — extrinsic (unique) state + shared flyweight reference</span>
<span class="kw">public class</span> <span class="ty">MarketTick</span> {
    <span class="kw">private final</span> <span class="ty">CurrencyPair</span> pair;       <span class="cm">// shared</span>
    <span class="kw">private final</span> <span class="ty">BigDecimal</span>   bid;        <span class="cm">// unique</span>
    <span class="kw">private final</span> <span class="ty">BigDecimal</span>   ask;        <span class="cm">// unique</span>
    <span class="kw">private final</span> <span class="ty">Instant</span>      timestamp;  <span class="cm">// unique</span>

    <span class="kw">public</span> <span class="ty">MarketTick</span>(<span class="ty">CurrencyPair</span> pair, <span class="ty">BigDecimal</span> bid,
                      <span class="ty">BigDecimal</span> ask, <span class="ty">Instant</span> ts) {
        <span class="kw">this</span>.pair = pair; <span class="kw">this</span>.bid = bid;
        <span class="kw">this</span>.ask = ask; <span class="kw">this</span>.timestamp = ts;
    }
}

<span class="cm">// Processing 1M ticks — only ~100 CurrencyPair objects created</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">MarketDataProcessor</span> {
    <span class="kw">private final</span> <span class="ty">CurrencyPairRegistry</span> registry;

    <span class="kw">public</span> <span class="ty">MarketTick</span> createTick(<span class="ty">String</span> base, <span class="ty">String</span> quote,
                                  <span class="ty">BigDecimal</span> bid, <span class="ty">BigDecimal</span> ask) {
        <span class="ty">CurrencyPair</span> pair = registry.get(base, quote); <span class="cm">// shared instance</span>
        <span class="kw">return new</span> <span class="ty">MarketTick</span>(pair, bid, ask, <span class="ty">Instant</span>.now());
    }
}`,
      impl: ['Identify intrinsic (shared, immutable) state — this goes in the flyweight class.', 'Intrinsic state must be immutable — multiple threads share these objects.', 'Use computeIfAbsent() for thread-safe lazy initialization of the flyweight pool.', 'Measure memory savings with a profiler — apply Flyweight when you have millions of objects with significant shared state.']
    }
  ],
  behavioral: [
    {
      name: 'Strategy',
      badge: 'Behavioral', badgeClass: 'c-behave',
      tagline: 'Swap algorithms at runtime',
      intent: 'Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.',
      problem: 'A payment gateway supports multiple fee calculation strategies — flat fee, percentage-based, tiered pricing. Hardcoding if-else chains for each makes the code impossible to extend and test.',
      analogy: 'A financial advisor has multiple investment strategies: conservative (bonds), balanced (mixed), aggressive (equities). You select a strategy based on your risk profile. The client process is the same — only the algorithm changes.',
      solution: 'Define a Strategy interface. Create one concrete strategy class per algorithm. The context class holds a reference to the active strategy and delegates to it.',
      code: `<span class="cm">// Strategy interface</span>
<span class="kw">public interface</span> <span class="ty">FeeCalculationStrategy</span> {
    <span class="ty">BigDecimal</span> calculate(<span class="ty">BigDecimal</span> amount, <span class="ty">String</span> currency);
}

<span class="cm">// Concrete strategies</span>
<span class="an">@Component("flat")</span>
<span class="kw">public class</span> <span class="ty">FlatFeeStrategy</span> <span class="kw">implements</span> <span class="ty">FeeCalculationStrategy</span> {
    <span class="kw">public</span> <span class="ty">BigDecimal</span> calculate(<span class="ty">BigDecimal</span> amount, <span class="ty">String</span> currency) {
        <span class="kw">return</span> BigDecimal.valueOf(<span class="str">2.50</span>); <span class="cm">// $2.50 flat</span>
    }
}

<span class="an">@Component("percentage")</span>
<span class="kw">public class</span> <span class="ty">PercentageFeeStrategy</span> <span class="kw">implements</span> <span class="ty">FeeCalculationStrategy</span> {
    <span class="kw">public</span> <span class="ty">BigDecimal</span> calculate(<span class="ty">BigDecimal</span> amount, <span class="ty">String</span> currency) {
        <span class="kw">return</span> amount.multiply(BigDecimal.valueOf(<span class="str">0.015</span>)); <span class="cm">// 1.5%</span>
    }
}

<span class="an">@Component("tiered")</span>
<span class="kw">public class</span> <span class="ty">TieredFeeStrategy</span> <span class="kw">implements</span> <span class="ty">FeeCalculationStrategy</span> {
    <span class="kw">public</span> <span class="ty">BigDecimal</span> calculate(<span class="ty">BigDecimal</span> amount, <span class="ty">String</span> currency) {
        <span class="kw">if</span> (amount.compareTo(BigDecimal.valueOf(<span class="str">1000</span>)) < <span class="str">0</span>)
            <span class="kw">return</span> BigDecimal.valueOf(<span class="str">1.0</span>);
        <span class="kw">else if</span> (amount.compareTo(BigDecimal.valueOf(<span class="str">10_000</span>)) < <span class="str">0</span>)
            <span class="kw">return</span> amount.multiply(BigDecimal.valueOf(<span class="str">0.01</span>));
        <span class="kw">else</span>
            <span class="kw">return</span> amount.multiply(BigDecimal.valueOf(<span class="str">0.005</span>));
    }
}

<span class="cm">// Context — holds strategy reference</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">PaymentFeeService</span> {
    <span class="kw">private final</span> Map&lt;String, <span class="ty">FeeCalculationStrategy</span>&gt; strategies;

    <span class="kw">public</span> <span class="ty">BigDecimal</span> calculateFee(<span class="ty">String</span> strategyKey,
                                    <span class="ty">BigDecimal</span> amount,
                                    <span class="ty">String</span> currency) {
        <span class="kw">return</span> strategies.getOrDefault(strategyKey,
                    strategies.get(<span class="str">"flat"</span>))
               .calculate(amount, currency);
    }
}`,
      impl: ['Annotate each strategy with @Component and a qualifier name used as the map key.', 'Inject Map<String, Interface> — Spring auto-wires all implementations by bean name.', 'Select the strategy at runtime based on request data (merchant config, account type, region).', 'Each strategy should be stateless — safe to share as a singleton bean.']
    },
    {
      name: 'Observer',
      badge: 'Behavioral', badgeClass: 'c-behave',
      tagline: 'Notify many when one changes',
      intent: 'Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.',
      problem: 'When a payment is processed, multiple systems need to react: update the ledger, send a notification, trigger fraud monitoring, generate a receipt. Coupling the payment service to all of these makes it a monolith.',
      analogy: 'A stock exchange is the subject. Every broker subscribed to a stock (AAPL, MSFT) is notified when the price changes. Brokers subscribe and unsubscribe independently. The exchange doesn\'t know or care who\'s listening.',
      solution: 'Use Spring\'s ApplicationEventPublisher to publish domain events. Other services listen with @EventListener — completely decoupled.',
      code: `<span class="cm">// Domain event</span>
<span class="kw">public class</span> <span class="ty">PaymentProcessedEvent</span> <span class="kw">extends</span> ApplicationEvent {
    <span class="kw">private final</span> <span class="ty">Payment</span> payment;

    <span class="kw">public</span> <span class="ty">PaymentProcessedEvent</span>(<span class="ty">Object</span> source, <span class="ty">Payment</span> payment) {
        <span class="kw">super</span>(source);
        <span class="kw">this</span>.payment = payment;
    }
    <span class="kw">public</span> <span class="ty">Payment</span> getPayment() { <span class="kw">return</span> payment; }
}

<span class="cm">// Publisher (Subject) — knows nothing about observers</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">PaymentService</span> {
    <span class="kw">private final</span> <span class="ty">ApplicationEventPublisher</span> publisher;
    <span class="kw">private final</span> <span class="ty">PaymentRepository</span>         repo;

    <span class="kw">public</span> <span class="ty">Payment</span> processPayment(<span class="ty">PaymentRequest</span> req) {
        <span class="ty">Payment</span> payment = repo.save(<span class="kw">new</span> <span class="ty">Payment</span>(req));
        publisher.publishEvent(<span class="kw">new</span> <span class="ty">PaymentProcessedEvent</span>(<span class="kw">this</span>, payment));
        <span class="kw">return</span> payment;
    }
}

<span class="cm">// Observers — each in its own class, completely independent</span>
<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">LedgerUpdateListener</span> {
    <span class="an">@EventListener</span>
    <span class="kw">public void</span> onPayment(<span class="ty">PaymentProcessedEvent</span> event) {
        ledger.record(event.getPayment()); <span class="cm">// update double-entry ledger</span>
    }
}

<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">FraudMonitorListener</span> {
    <span class="an">@EventListener</span>
    <span class="kw">@Async</span> <span class="cm">// non-blocking fraud check</span>
    <span class="kw">public void</span> onPayment(<span class="ty">PaymentProcessedEvent</span> event) {
        fraudEngine.analyse(event.getPayment());
    }
}

<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">NotificationListener</span> {
    <span class="an">@EventListener</span>
    <span class="an">@TransactionalEventListener</span>(phase = AFTER_COMMIT) <span class="cm">// only after tx commits</span>
    <span class="kw">public void</span> onPayment(<span class="ty">PaymentProcessedEvent</span> event) {
        notificationService.sendReceipt(event.getPayment());
    }
}`,
      impl: ['Extend ApplicationEvent or use any POJO — Spring 4.2+ supports @EventListener on plain classes.', 'Use @TransactionalEventListener(phase = AFTER_COMMIT) for listeners that should only fire after the transaction commits (e.g. sending emails).', 'Use @Async on listeners for non-blocking processing — enable with @EnableAsync on the config class.', 'For distributed systems, replace with Spring Kafka or Spring AMQP — same Observer pattern, but with a message broker.']
    },
    {
      name: 'Command',
      badge: 'Behavioral', badgeClass: 'c-behave',
      tagline: 'Encapsulate requests as objects',
      intent: 'Encapsulate a request as an object, thereby allowing parameterization of clients, queueing, logging, and undoable operations.',
      problem: 'A banking operation (transfer, debit, credit) needs to be queued, logged, retried, and possibly rolled back. Passing raw method calls around makes this impossible.',
      analogy: 'A cheque is a command. It encapsulates the instruction ("pay $500 to John Smith"), the authoriser (account holder), and the recipient. The bank processes it when presented — not when written. You can post-date it, cancel it, or keep a record.',
      solution: 'Encapsulate each operation as a Command object with execute() and optionally undo(). A CommandBus or Invoker queues and executes commands.',
      code: `<span class="cm">// Command interface</span>
<span class="kw">public interface</span> <span class="ty">BankingCommand</span>&lt;T&gt; {
    T execute();
    <span class="kw">void</span> undo();
}

<span class="cm">// Concrete command</span>
<span class="kw">public class</span> <span class="ty">TransferCommand</span> <span class="kw">implements</span> <span class="ty">BankingCommand</span>&lt;<span class="ty">TransferResult</span>&gt; {
    <span class="kw">private final</span> <span class="ty">AccountRepository</span> accounts;
    <span class="kw">private final</span> <span class="ty">String</span>     fromId, toId;
    <span class="kw">private final</span> <span class="ty">BigDecimal</span> amount;
    <span class="kw">private</span>       <span class="ty">TransferResult</span> result;

    <span class="an">@Override</span>
    <span class="kw">public</span> <span class="ty">TransferResult</span> execute() {
        <span class="ty">Account</span> from = accounts.findById(fromId).orElseThrow();
        <span class="ty">Account</span> to   = accounts.findById(toId).orElseThrow();
        from.debit(amount);
        to.credit(amount);
        accounts.save(from); accounts.save(to);
        result = <span class="kw">new</span> <span class="ty">TransferResult</span>(fromId, toId, amount, <span class="str">"SUCCESS"</span>);
        <span class="kw">return</span> result;
    }

    <span class="an">@Override</span>
    <span class="kw">public void</span> undo() {
        <span class="cm">// Reverse the transfer</span>
        <span class="ty">Account</span> from = accounts.findById(fromId).orElseThrow();
        <span class="ty">Account</span> to   = accounts.findById(toId).orElseThrow();
        from.credit(amount); to.debit(amount);
        accounts.save(from); accounts.save(to);
    }
}

<span class="cm">// Command bus — invoker with audit log</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">CommandBus</span> {
    <span class="kw">private final</span> Deque&lt;<span class="ty">BankingCommand</span>&lt;?&gt;&gt; history = <span class="kw">new</span> ArrayDeque&lt;&gt;();
    <span class="kw">private final</span> <span class="ty">CommandAuditRepository</span>   auditRepo;

    <span class="kw">public</span> &lt;T&gt; T dispatch(<span class="ty">BankingCommand</span>&lt;T&gt; command) {
        T result = command.execute();
        history.push(command);
        auditRepo.save(<span class="kw">new</span> <span class="ty">CommandAuditEntry</span>(command, result));
        <span class="kw">return</span> result;
    }

    <span class="kw">public void</span> undoLast() {
        <span class="kw">if</span> (!history.isEmpty()) history.pop().undo();
    }
}

<span class="cm">// Controller dispatches commands</span>
<span class="an">@PostMapping</span>(<span class="str">"/transfer"</span>)
<span class="kw">public</span> <span class="ty">TransferResult</span> transfer(<span class="an">@RequestBody</span> <span class="ty">TransferRequest</span> req) {
    <span class="kw">return</span> bus.dispatch(<span class="kw">new</span> <span class="ty">TransferCommand</span>(accounts, req.getFrom(),
                                             req.getTo(), req.getAmount()));
}`,
      impl: ['Create one Command class per operation — keeps individual operations testable in isolation.', 'The CommandBus is the central dispatcher — add cross-cutting concerns here: logging, metrics, retry, auth.', 'Store executed commands for undo history, event sourcing, or audit trails.', 'For async execution, submit commands to a thread pool or message queue instead of executing inline.']
    },
    {
      name: 'Chain of Responsibility',
      badge: 'Behavioral', badgeClass: 'c-behave',
      tagline: 'Pass request through a chain of handlers',
      intent: 'Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along until one handles it.',
      problem: 'A payment must pass through multiple validation checks: fraud check, balance check, compliance check, limit check. If any check fails, processing stops. Adding new checks or reordering them should not require modifying existing ones.',
      analogy: 'A bank loan approval process: your application goes first to the loan officer, then to the branch manager if the amount exceeds their limit, then to regional head, then to the credit committee. Each level handles what it can and passes up the rest.',
      solution: 'Each handler knows only its own logic and a reference to the next handler. The chain is assembled externally and the request is passed until it\'s handled or the chain ends.',
      code: `<span class="cm">// Handler interface</span>
<span class="kw">public abstract class</span> <span class="ty">PaymentValidator</span> {
    <span class="kw">protected</span> <span class="ty">PaymentValidator</span> next;

    <span class="kw">public</span> <span class="ty">PaymentValidator</span> setNext(<span class="ty">PaymentValidator</span> next) {
        <span class="kw">this</span>.next = next;
        <span class="kw">return</span> next; <span class="cm">// for fluent chaining</span>
    }

    <span class="kw">public abstract</span> <span class="ty">ValidationResult</span> validate(<span class="ty">Payment</span> payment);

    <span class="kw">protected</span> <span class="ty">ValidationResult</span> passToNext(<span class="ty">Payment</span> payment) {
        <span class="kw">return</span> (next != <span class="kw">null</span>) ? next.validate(payment)
                               : <span class="ty">ValidationResult</span>.approved();
    }
}

<span class="cm">// Concrete handlers</span>
<span class="an">@Component</span> <span class="an">@Order(1)</span>
<span class="kw">public class</span> <span class="ty">FraudCheckValidator</span> <span class="kw">extends</span> <span class="ty">PaymentValidator</span> {
    <span class="kw">private final</span> <span class="ty">FraudService</span> fraudService;
    <span class="kw">public</span> <span class="ty">ValidationResult</span> validate(<span class="ty">Payment</span> p) {
        <span class="kw">if</span> (fraudService.isFlagged(p)) <span class="kw">return</span> <span class="ty">ValidationResult</span>.rejected(<span class="str">"Fraud detected"</span>);
        <span class="kw">return</span> passToNext(p);
    }
}

<span class="an">@Component</span> <span class="an">@Order(2)</span>
<span class="kw">public class</span> <span class="ty">BalanceCheckValidator</span> <span class="kw">extends</span> <span class="ty">PaymentValidator</span> {
    <span class="kw">public</span> <span class="ty">ValidationResult</span> validate(<span class="ty">Payment</span> p) {
        <span class="ty">Account</span> acc = accountRepo.findById(p.getFromAccount()).orElseThrow();
        <span class="kw">if</span> (acc.getBalance().compareTo(p.getAmount()) < <span class="str">0</span>)
            <span class="kw">return</span> <span class="ty">ValidationResult</span>.rejected(<span class="str">"Insufficient funds"</span>);
        <span class="kw">return</span> passToNext(p);
    }
}

<span class="an">@Component</span> <span class="an">@Order(3)</span>
<span class="kw">public class</span> <span class="ty">ComplianceLimitValidator</span> <span class="kw">extends</span> <span class="ty">PaymentValidator</span> {
    <span class="kw">public</span> <span class="ty">ValidationResult</span> validate(<span class="ty">Payment</span> p) {
        <span class="kw">if</span> (p.getAmount().compareTo(BigDecimal.valueOf(<span class="str">10_000</span>)) > <span class="str">0</span>)
            <span class="kw">return</span> <span class="ty">ValidationResult</span>.flagged(<span class="str">"CTR required"</span>);
        <span class="kw">return</span> passToNext(p);
    }
}

<span class="cm">// Chain assembly in @Configuration</span>
<span class="an">@Bean</span>
<span class="kw">public</span> <span class="ty">PaymentValidator</span> validationChain(<span class="ty">List</span>&lt;<span class="ty">PaymentValidator</span>&gt; validators) {
    <span class="cm">// Sorted by @Order — wire each to the next</span>
    <span class="ty">PaymentValidator</span> head = validators.get(<span class="str">0</span>);
    <span class="ty">PaymentValidator</span> curr = head;
    <span class="kw">for</span> (<span class="kw">int</span> i = <span class="str">1</span>; i < validators.size(); i++)
        curr = curr.setNext(validators.get(i));
    <span class="kw">return</span> head;
}`,
      impl: ['Use @Order to define handler priority — lower values run first.', 'Inject List<PaymentValidator> into the chain assembler — Spring collects all implementations automatically.', 'Spring\'s Servlet filter chain (OncePerRequestFilter) is a framework-level Chain of Responsibility.', 'Resilience4j\'s pipeline (retry → circuit breaker → bulkhead) also follows this pattern.']
    },
    {
      name: 'Template Method',
      badge: 'Behavioral', badgeClass: 'c-behave',
      tagline: 'Define skeleton, let subclasses fill gaps',
      intent: 'Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm\'s structure.',
      problem: 'All loan processing types (mortgage, auto, personal) follow the same steps: validate → score → calculate terms → approve/reject → notify. But each type has different rules for scoring and terms calculation.',
      analogy: 'A standard bank audit report always has the same sections: executive summary, scope, findings, recommendations. The structure (template) is fixed by the auditing standard. The content of each section varies by audit.',
      solution: 'Create an abstract base class with the algorithm skeleton in a final template method. Declare abstract "hook" methods for the varying steps. Subclasses override only the hooks.',
      code: `<span class="cm">// Abstract class with template method</span>
<span class="kw">public abstract class</span> <span class="ty">LoanProcessor</span> {

    <span class="cm">// Template method — fixed algorithm skeleton (final)</span>
    <span class="kw">public final</span> <span class="ty">LoanDecision</span> process(<span class="ty">LoanApplication</span> application) {
        <span class="kw">if</span> (!validate(application))
            <span class="kw">return</span> <span class="ty">LoanDecision</span>.rejected(<span class="str">"Validation failed"</span>);

        <span class="ty">CreditScore</span> score = scoreApplicant(application);
        <span class="ty">LoanTerms</span> terms = calculateTerms(application, score);
        <span class="ty">LoanDecision</span> decision = makeDecision(application, score, terms);

        notify(application, decision);
        <span class="kw">return</span> decision;
    }

    <span class="cm">// Abstract hooks — subclasses must implement</span>
    <span class="kw">protected abstract boolean</span> validate(<span class="ty">LoanApplication</span> app);
    <span class="kw">protected abstract</span> <span class="ty">CreditScore</span> scoreApplicant(<span class="ty">LoanApplication</span> app);
    <span class="kw">protected abstract</span> <span class="ty">LoanTerms</span> calculateTerms(<span class="ty">LoanApplication</span> app, <span class="ty">CreditScore</span> score);

    <span class="cm">// Concrete step — same for all loan types</span>
    <span class="kw">protected</span> <span class="ty">LoanDecision</span> makeDecision(<span class="ty">LoanApplication</span> app,
                                          <span class="ty">CreditScore</span> score, <span class="ty">LoanTerms</span> terms) {
        <span class="kw">return</span> score.getValue() >= <span class="str">650</span>
            ? <span class="ty">LoanDecision</span>.approved(terms)
            : <span class="ty">LoanDecision</span>.rejected(<span class="str">"Credit score too low"</span>);
    }

    <span class="kw">protected void</span> notify(<span class="ty">LoanApplication</span> app, <span class="ty">LoanDecision</span> decision) {
        notificationService.send(app.getApplicantEmail(), decision);
    }
}

<span class="cm">// Concrete template — Mortgage</span>
<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">MortgageLoanProcessor</span> <span class="kw">extends</span> <span class="ty">LoanProcessor</span> {
    <span class="kw">protected boolean</span> validate(<span class="ty">LoanApplication</span> app) {
        <span class="kw">return</span> app.hasCollateral() && app.getLtv() <= <span class="str">0.85</span>;
    }
    <span class="kw">protected</span> <span class="ty">CreditScore</span> scoreApplicant(<span class="ty">LoanApplication</span> app) {
        <span class="kw">return</span> creditBureau.getMortgageScore(app.getApplicantId());
    }
    <span class="kw">protected</span> <span class="ty">LoanTerms</span> calculateTerms(<span class="ty">LoanApplication</span> app, <span class="ty">CreditScore</span> score) {
        <span class="kw">return</span> <span class="ty">LoanTerms</span>.mortgage(app.getAmount(), score.getRate(), <span class="str">30</span>);
    }
}

<span class="cm">// Concrete template — Personal loan</span>
<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">PersonalLoanProcessor</span> <span class="kw">extends</span> <span class="ty">LoanProcessor</span> {
    <span class="kw">protected boolean</span> validate(<span class="ty">LoanApplication</span> app) {
        <span class="kw">return</span> app.getAmount().compareTo(BigDecimal.valueOf(<span class="str">50_000</span>)) <= <span class="str">0</span>;
    }
    <span class="kw">protected</span> <span class="ty">CreditScore</span> scoreApplicant(<span class="ty">LoanApplication</span> app) {
        <span class="kw">return</span> creditBureau.getPersonalScore(app.getApplicantId());
    }
    <span class="kw">protected</span> <span class="ty">LoanTerms</span> calculateTerms(<span class="ty">LoanApplication</span> app, <span class="ty">CreditScore</span> score) {
        <span class="kw">return</span> <span class="ty">LoanTerms</span>.personal(app.getAmount(), <span class="str">12.5</span>, <span class="str">5</span>);
    }
}`,
      impl: ['Declare the template method final — subclasses must not override the algorithm skeleton.', 'Distinguish abstract methods (must override) from hook methods (optional override with default).', 'Spring Data\'s JpaRepository is a Template Method implementation — save(), findById() are defined in the abstract template, your repository just declares the entity type.', 'Spring\'s RestTemplate and JdbcTemplate are also classic examples of this pattern.']
    },
    {
      name: 'State',
      badge: 'Behavioral', badgeClass: 'c-behave',
      tagline: 'Alter behaviour based on internal state',
      intent: 'Allow an object to alter its behaviour when its internal state changes. The object will appear to change its class.',
      problem: 'A payment transaction goes through states: PENDING → PROCESSING → COMPLETED / FAILED / REFUNDED. Allowed actions depend on the current state. Using if-else chains makes the code a maintenance nightmare.',
      analogy: 'A bank card has states: Active, Frozen, Blocked. In Active state you can swipe the card. In Frozen you can\'t. In Blocked you can\'t even unfreeze it without calling the bank. Same card, completely different behaviour.',
      solution: 'Create a State interface and one class per state. The context (Transaction) delegates behaviour to its current state object. Transitions are driven by calling methods on the current state.',
      code: `<span class="cm">// State interface</span>
<span class="kw">public interface</span> <span class="ty">TransactionState</span> {
    <span class="kw">void</span> process(<span class="ty">Transaction</span> ctx);
    <span class="kw">void</span> complete(<span class="ty">Transaction</span> ctx);
    <span class="kw">void</span> fail(<span class="ty">Transaction</span> ctx, <span class="ty">String</span> reason);
    <span class="kw">void</span> refund(<span class="ty">Transaction</span> ctx);
}

<span class="cm">// Concrete states</span>
<span class="kw">public class</span> <span class="ty">PendingState</span> <span class="kw">implements</span> <span class="ty">TransactionState</span> {
    <span class="kw">public void</span> process(<span class="ty">Transaction</span> ctx) {
        ctx.setState(<span class="kw">new</span> <span class="ty">ProcessingState</span>());
        ctx.getPaymentGateway().submit(ctx);
    }
    <span class="kw">public void</span> complete(<span class="ty">Transaction</span> ctx) { <span class="kw">throw new</span> <span class="ty">IllegalStateException</span>(<span class="str">"Not yet processing"</span>); }
    <span class="kw">public void</span> fail    (<span class="ty">Transaction</span> ctx, <span class="ty">String</span> r) { ctx.setState(<span class="kw">new</span> <span class="ty">FailedState</span>(r)); }
    <span class="kw">public void</span> refund  (<span class="ty">Transaction</span> ctx) { <span class="kw">throw new</span> <span class="ty">IllegalStateException</span>(<span class="str">"Cannot refund"</span>); }
}

<span class="kw">public class</span> <span class="ty">ProcessingState</span> <span class="kw">implements</span> <span class="ty">TransactionState</span> {
    <span class="kw">public void</span> process(<span class="ty">Transaction</span> ctx) { <span class="kw">throw new</span> <span class="ty">IllegalStateException</span>(<span class="str">"Already processing"</span>); }
    <span class="kw">public void</span> complete(<span class="ty">Transaction</span> ctx) { ctx.setState(<span class="kw">new</span> <span class="ty">CompletedState</span>()); }
    <span class="kw">public void</span> fail    (<span class="ty">Transaction</span> ctx, <span class="ty">String</span> r) { ctx.setState(<span class="kw">new</span> <span class="ty">FailedState</span>(r)); }
    <span class="kw">public void</span> refund  (<span class="ty">Transaction</span> ctx) { <span class="kw">throw new</span> <span class="ty">IllegalStateException</span>(<span class="str">"Not complete"</span>); }
}

<span class="kw">public class</span> <span class="ty">CompletedState</span> <span class="kw">implements</span> <span class="ty">TransactionState</span> {
    <span class="kw">public void</span> process(<span class="ty">Transaction</span> ctx) { <span class="kw">throw new</span> <span class="ty">IllegalStateException</span>(); }
    <span class="kw">public void</span> complete(<span class="ty">Transaction</span> ctx) { <span class="kw">throw new</span> <span class="ty">IllegalStateException</span>(); }
    <span class="kw">public void</span> fail    (<span class="ty">Transaction</span> ctx, <span class="ty">String</span> r) { <span class="kw">throw new</span> <span class="ty">IllegalStateException</span>(); }
    <span class="kw">public void</span> refund  (<span class="ty">Transaction</span> ctx) { ctx.setState(<span class="kw">new</span> <span class="ty">RefundedState</span>()); }
}

<span class="cm">// Context</span>
<span class="kw">public class</span> <span class="ty">Transaction</span> {
    <span class="kw">private</span> <span class="ty">TransactionState</span> state = <span class="kw">new</span> <span class="ty">PendingState</span>();
    <span class="kw">public void</span> setState(<span class="ty">TransactionState</span> s) { <span class="kw">this</span>.state = s; }
    <span class="kw">public void</span> process()       { state.process(<span class="kw">this</span>); }
    <span class="kw">public void</span> complete()      { state.complete(<span class="kw">this</span>); }
    <span class="kw">public void</span> fail(<span class="ty">String</span> r) { state.fail(<span class="kw">this</span>, r); }
    <span class="kw">public void</span> refund()        { state.refund(<span class="kw">this</span>); }
}`,
      impl: ['Use Spring State Machine (spring-statemachine) for complex state flows — it handles transitions, guards, and actions declaratively.', 'Persist the state as a string field in the entity — map each string to a State object on load.', 'Invalid state transitions throw IllegalStateException — fail fast on programming errors.', 'Each state class is a pure POJO — easy to unit test in isolation.']
    },
    {
      name: 'Iterator',
      badge: 'Behavioral', badgeClass: 'c-behave',
      tagline: 'Traverse a collection without exposing it',
      intent: 'Provide a way to sequentially access elements of a collection without exposing its underlying representation.',
      problem: 'A report generator must iterate over millions of transaction records. Loading all into memory causes OutOfMemoryError. The consumer of the data shouldn\'t need to know the underlying storage (database, file, Kafka topic).',
      analogy: 'An ATM prints a monthly statement. It doesn\'t load your entire history into memory — it fetches and prints page by page. You just press "next" and the iterator fetches the next batch from the bank\'s records.',
      solution: 'Use Spring Data\'s Streamable, Slice, or Java\'s Iterator. For large datasets, paginate with Pageable or use JPA\'s ScrollPosition.',
      code: `<span class="cm">// Custom iterator for large transaction exports</span>
<span class="kw">public class</span> <span class="ty">TransactionPageIterator</span> <span class="kw">implements</span> <span class="ty">Iterator</span>&lt;<span class="ty">List</span>&lt;<span class="ty">Transaction</span>&gt;&gt; {

    <span class="kw">private final</span> <span class="ty">TransactionRepository</span> repo;
    <span class="kw">private final</span> <span class="ty">String</span>              accountId;
    <span class="kw">private</span>       <span class="ty">Pageable</span>            page = PageRequest.of(<span class="str">0</span>, <span class="str">500</span>);
    <span class="kw">private</span>       <span class="kw">boolean</span>             hasNext = <span class="kw">true</span>;

    <span class="an">@Override</span>
    <span class="kw">public boolean</span> hasNext() { <span class="kw">return</span> hasNext; }

    <span class="an">@Override</span>
    <span class="kw">public</span> <span class="ty">List</span>&lt;<span class="ty">Transaction</span>&gt; next() {
        <span class="ty">Page</span>&lt;<span class="ty">Transaction</span>&gt; result = repo.findByAccountId(accountId, page);
        hasNext = result.hasNext();
        <span class="kw">if</span> (hasNext) page = page.next();
        <span class="kw">return</span> result.getContent();
    }
}

<span class="cm">// Spring Data — built-in iterator via Stream</span>
<span class="kw">public interface</span> <span class="ty">TransactionRepository</span> <span class="kw">extends</span> JpaRepository&lt;<span class="ty">Transaction</span>, <span class="ty">String</span>&gt; {
    <span class="ty">Page</span>&lt;<span class="ty">Transaction</span>&gt; findByAccountId(<span class="ty">String</span> id, <span class="ty">Pageable</span> pageable);

    <span class="an">@QueryHints</span>({<span class="an">@QueryHint</span>(name = HINT_FETCH_SIZE, value = <span class="str">"500"</span>)})
    Stream&lt;<span class="ty">Transaction</span>&gt; streamByAccountId(<span class="ty">String</span> id);
}

<span class="cm">// Usage with Java Stream (lazy iteration, constant memory)</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">TransactionExportService</span> {
    <span class="kw">private final</span> <span class="ty">TransactionRepository</span> repo;

    <span class="an">@Transactional</span>(readOnly = <span class="kw">true</span>)
    <span class="kw">public void</span> exportToFile(<span class="ty">String</span> accountId, <span class="ty">OutputStream</span> out) {
        <span class="kw">try</span> (<span class="ty">Stream</span>&lt;<span class="ty">Transaction</span>&gt; stream = repo.streamByAccountId(accountId)) {
            stream.forEach(tx -> writeCsvRow(out, tx)); <span class="cm">// one at a time</span>
        }
    }
}`,
      impl: ['Use Stream<T> from Spring Data for memory-efficient iteration — must be inside a @Transactional method.', 'Use Page<T> and Pageable for paginated REST APIs — clients control page size and number.', 'Set @QueryHint HINT_FETCH_SIZE to avoid loading the full ResultSet into JDBC memory.', 'Spring Batch\'s ItemReader is a production-grade iterator for large-scale ETL.']
    },
    {
      name: 'Mediator',
      badge: 'Behavioral', badgeClass: 'c-behave',
      tagline: 'Centralise communication between objects',
      intent: 'Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by preventing objects from referring to each other directly.',
      problem: 'A trading system has Order, RiskEngine, Portfolio, AuditLog, and MarketData components. When an order is placed, all of them need to interact. Direct references between all components creates a spaghetti dependency graph.',
      analogy: 'An air traffic control tower is the mediator between all planes. Planes don\'t communicate with each other — they all communicate with the tower. The tower coordinates all interactions.',
      solution: 'Create a Mediator class that all components register with. Instead of calling each other directly, components send messages to the mediator, which routes them to the right recipients.',
      code: `<span class="cm">// Mediator interface</span>
<span class="kw">public interface</span> <span class="ty">TradingMediator</span> {
    <span class="kw">void</span> register(<span class="ty">String</span> componentName, <span class="ty">TradingComponent</span> component);
    <span class="kw">void</span> notify(<span class="ty">String</span> from, <span class="ty">TradingEvent</span> event);
}

<span class="cm">// Colleague interface</span>
<span class="kw">public interface</span> <span class="ty">TradingComponent</span> {
    <span class="kw">void</span> receive(<span class="ty">TradingEvent</span> event);
}

<span class="cm">// Concrete mediator</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">TradingMediatorImpl</span> <span class="kw">implements</span> <span class="ty">TradingMediator</span> {
    <span class="kw">private final</span> Map&lt;String, <span class="ty">TradingComponent</span>&gt; components = <span class="kw">new</span> HashMap&lt;&gt;();

    <span class="kw">public void</span> register(<span class="ty">String</span> name, <span class="ty">TradingComponent</span> c) {
        components.put(name, c);
    }

    <span class="kw">public void</span> notify(<span class="ty">String</span> from, <span class="ty">TradingEvent</span> event) {
        <span class="kw">switch</span> (event.getType()) {
            <span class="kw">case</span> ORDER_PLACED:
                components.get(<span class="str">"risk"</span>).receive(event);
                components.get(<span class="str">"portfolio"</span>).receive(event);
                components.get(<span class="str">"audit"</span>).receive(event);
                <span class="kw">break</span>;
            <span class="kw">case</span> RISK_APPROVED:
                components.get(<span class="str">"execution"</span>).receive(event);
                <span class="kw">break</span>;
            <span class="kw">case</span> RISK_REJECTED:
                components.get(<span class="str">"order"</span>).receive(event);
                components.get(<span class="str">"audit"</span>).receive(event);
                <span class="kw">break</span>;
        }
    }
}

<span class="cm">// Components communicate only via mediator</span>
<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">OrderComponent</span> <span class="kw">implements</span> <span class="ty">TradingComponent</span> {
    <span class="kw">private final</span> <span class="ty">TradingMediator</span> mediator;

    <span class="kw">public void</span> placeOrder(<span class="ty">Order</span> order) {
        mediator.notify(<span class="str">"order"</span>, <span class="ty">TradingEvent</span>.orderPlaced(order));
        <span class="cm">// Does NOT call riskEngine.check(), portfolio.reserve() etc.</span>
    }

    <span class="kw">public void</span> receive(<span class="ty">TradingEvent</span> event) {
        <span class="kw">if</span> (event.getType() == RISK_REJECTED) markOrderRejected(event);
    }
}`,
      impl: ['Spring\'s ApplicationEventPublisher is a framework-level mediator — prefer it for in-process communication.', 'For distributed systems, a message broker (Kafka, RabbitMQ) is the mediator.', 'Keep the mediator focused on routing only — business logic belongs in the components.', 'The mediator is the only class with knowledge of all components — this is intentional.']
    },
    {
      name: 'Memento',
      badge: 'Behavioral', badgeClass: 'c-behave',
      tagline: 'Capture and restore object state',
      intent: 'Without violating encapsulation, capture and externalise an object\'s internal state so the object can be restored to this state later.',
      problem: 'A loan application goes through many editing steps. If the user cancels or the system crashes mid-edit, you need to restore the application to its previous valid state without exposing the internal fields.',
      analogy: 'A bank\'s core banking system takes a daily snapshot of all account balances. If data corruption occurs at 2pm, the system can restore to the midnight snapshot — the last known good state.',
      solution: 'The originator (LoanApplication) creates a Memento snapshot of its state. A Caretaker (history stack) stores mementos. To restore, the originator loads state from a memento.',
      code: `<span class="cm">// Memento — immutable snapshot of state</span>
<span class="kw">public record</span> <span class="ty">LoanApplicationSnapshot</span>(
    <span class="ty">String</span>     applicantId,
    <span class="ty">BigDecimal</span> amount,
    <span class="ty">Integer</span>    tenorMonths,
    <span class="ty">LoanStatus</span> status,
    <span class="ty">Instant</span>    snapshotTime
) {}

<span class="cm">// Originator — creates and restores from mementos</span>
<span class="kw">public class</span> <span class="ty">LoanApplication</span> {
    <span class="kw">private</span> <span class="ty">String</span>     applicantId;
    <span class="kw">private</span> <span class="ty">BigDecimal</span> amount;
    <span class="kw">private</span> <span class="ty">Integer</span>    tenorMonths;
    <span class="kw">private</span> <span class="ty">LoanStatus</span> status;

    <span class="cm">// Save — creates a memento</span>
    <span class="kw">public</span> <span class="ty">LoanApplicationSnapshot</span> save() {
        <span class="kw">return new</span> <span class="ty">LoanApplicationSnapshot</span>(
            applicantId, amount, tenorMonths, status, <span class="ty">Instant</span>.now());
    }

    <span class="cm">// Restore — loads from a memento</span>
    <span class="kw">public void</span> restore(<span class="ty">LoanApplicationSnapshot</span> snapshot) {
        <span class="kw">this</span>.applicantId  = snapshot.applicantId();
        <span class="kw">this</span>.amount       = snapshot.amount();
        <span class="kw">this</span>.tenorMonths  = snapshot.tenorMonths();
        <span class="kw">this</span>.status       = snapshot.status();
    }
}

<span class="cm">// Caretaker — manages history</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">LoanApplicationHistory</span> {
    <span class="kw">private final</span> <span class="ty">LoanSnapshotRepository</span> repo;

    <span class="kw">public void</span> checkpoint(<span class="ty">LoanApplication</span> app) {
        repo.save(app.save()); <span class="cm">// persist snapshot to DB</span>
    }

    <span class="kw">public void</span> rollback(<span class="ty">LoanApplication</span> app, <span class="ty">Instant</span> toTime) {
        <span class="ty">LoanApplicationSnapshot</span> snap = repo.findLatestBefore(
            app.getApplicantId(), toTime);
        app.restore(snap);
    }
}

<span class="cm">// Usage</span>
<span class="cm">// Before a risky operation, checkpoint</span>
history.checkpoint(application);
<span class="kw">try</span> {
    application.applyDiscountProgram(program); <span class="cm">// might fail</span>
} <span class="kw">catch</span> (<span class="ty">Exception</span> e) {
    history.rollback(application, <span class="ty">Instant</span>.now()); <span class="cm">// undo</span>
}`,
      impl: ['Use Java records for mementos — they are immutable by default.', 'Persist mementos to a database for durability (crash recovery) — this is essentially event sourcing.', 'For undo/redo functionality, maintain a Deque<Snapshot> as an in-memory stack.', 'Spring Data Envers (@Audited) implements a production-grade Memento pattern — it automatically versions every entity save.']
    },
    {
      name: 'Visitor',
      badge: 'Behavioral', badgeClass: 'c-behave',
      tagline: 'Add operations to objects without changing them',
      intent: 'Represent an operation to be performed on elements of an object structure. Visitor lets you define a new operation without changing the classes of the elements on which it operates.',
      problem: 'A portfolio contains Stocks, Bonds, and Derivatives. You need to calculate tax for each, generate a risk report for each, and export to XML for each. Adding these methods to each class violates single responsibility.',
      analogy: 'A tax auditor (visitor) visits each of your financial accounts: savings account, investment account, pension account. Each account type has a different tax treatment. The auditor knows the rules for each — the accounts just allow access.',
      solution: 'Define a Visitor interface with a visit method per element type. Each element has an accept(visitor) method. New operations are added by creating new Visitor implementations — element classes stay unchanged.',
      code: `<span class="cm">// Visitor interface — one method per asset type</span>
<span class="kw">public interface</span> <span class="ty">PortfolioVisitor</span> {
    <span class="kw">void</span> visit(<span class="ty">StockHolding</span> stock);
    <span class="kw">void</span> visit(<span class="ty">BondHolding</span> bond);
    <span class="kw">void</span> visit(<span class="ty">DerivativeHolding</span> derivative);
}

<span class="cm">// Element interface</span>
<span class="kw">public interface</span> <span class="ty">PortfolioAsset</span> {
    <span class="kw">void</span> accept(<span class="ty">PortfolioVisitor</span> visitor);
}

<span class="cm">// Concrete elements — accept visitor, don't change otherwise</span>
<span class="kw">public class</span> <span class="ty">StockHolding</span> <span class="kw">implements</span> <span class="ty">PortfolioAsset</span> {
    <span class="kw">private final</span> <span class="ty">String</span>     ticker;
    <span class="kw">private final</span> <span class="ty">Integer</span>    shares;
    <span class="kw">private final</span> <span class="ty">BigDecimal</span> price;
    <span class="kw">public void</span> accept(<span class="ty">PortfolioVisitor</span> v) { v.visit(<span class="kw">this</span>); }
    <span class="cm">// getters...</span>
}

<span class="kw">public class</span> <span class="ty">BondHolding</span> <span class="kw">implements</span> <span class="ty">PortfolioAsset</span> {
    <span class="kw">private final</span> <span class="ty">String</span>     issuer;
    <span class="kw">private final</span> <span class="ty">BigDecimal</span> faceValue;
    <span class="kw">private final</span> <span class="ty">Double</span>     coupon;
    <span class="kw">public void</span> accept(<span class="ty">PortfolioVisitor</span> v) { v.visit(<span class="kw">this</span>); }
}

<span class="cm">// Concrete visitor 1 — Tax calculation</span>
<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">TaxCalculationVisitor</span> <span class="kw">implements</span> <span class="ty">PortfolioVisitor</span> {
    <span class="kw">private</span> <span class="ty">BigDecimal</span> totalTax = <span class="ty">BigDecimal</span>.ZERO;

    <span class="kw">public void</span> visit(<span class="ty">StockHolding</span> s) {
        <span class="cm">// 15% capital gains on stocks</span>
        totalTax = totalTax.add(s.getMarketValue().multiply(BigDecimal.valueOf(<span class="str">0.15</span>)));
    }
    <span class="kw">public void</span> visit(<span class="ty">BondHolding</span> b) {
        <span class="cm">// 30% on bond income</span>
        totalTax = totalTax.add(b.getAnnualIncome().multiply(BigDecimal.valueOf(<span class="str">0.30</span>)));
    }
    <span class="kw">public void</span> visit(<span class="ty">DerivativeHolding</span> d) {
        <span class="cm">// Mark-to-market taxation</span>
        totalTax = totalTax.add(d.getUnrealisedGain().multiply(BigDecimal.valueOf(<span class="str">0.40</span>)));
    }
    <span class="kw">public</span> <span class="ty">BigDecimal</span> getTotalTax() { <span class="kw">return</span> totalTax; }
}

<span class="cm">// Concrete visitor 2 — Risk Report (no changes to asset classes!)</span>
<span class="an">@Component</span>
<span class="kw">public class</span> <span class="ty">RiskReportVisitor</span> <span class="kw">implements</span> <span class="ty">PortfolioVisitor</span> { ... }

<span class="cm">// Usage — traverse portfolio with any visitor</span>
<span class="ty">TaxCalculationVisitor</span> taxVisitor = <span class="kw">new</span> <span class="ty">TaxCalculationVisitor</span>();
portfolio.getAssets().forEach(asset -> asset.accept(taxVisitor));
<span class="ty">BigDecimal</span> tax = taxVisitor.getTotalTax();`,
      impl: ['Define one visit() method per concrete element type in the Visitor interface.', 'Each element\'s accept() method dispatches to the correct visit() overload — this is "double dispatch".', 'Add new operations by creating new Visitor classes — zero changes to existing asset classes.', 'Works best when element classes are stable but operations change frequently.']
    },
    {
      name: 'Interpreter',
      badge: 'Behavioral', badgeClass: 'c-behave',
      tagline: 'Interpret sentences in a language',
      intent: 'Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language.',
      problem: 'A rules engine for transaction approval needs to evaluate business rules like "amount > 10000 AND country != US AND riskScore > 0.8" — without hardcoding them. Rules must be configurable by operations teams.',
      analogy: 'A bank\'s FX trading desk has rules like "if USD/JPY rate drops below 140 and holding > 10M, trigger stop-loss". These rules are in a human-readable DSL configured by traders — not hardcoded by developers.',
      solution: 'Define a grammar for the rule language. Create an Expression class hierarchy that represents grammar rules. Compose expressions into trees that evaluate themselves against a context.',
      code: `<span class="cm">// Abstract expression</span>
<span class="kw">public interface</span> <span class="ty">RuleExpression</span> {
    <span class="kw">boolean</span> evaluate(<span class="ty">TransactionContext</span> ctx);
}

<span class="cm">// Terminal expressions — leaf nodes</span>
<span class="kw">public class</span> <span class="ty">AmountGreaterThan</span> <span class="kw">implements</span> <span class="ty">RuleExpression</span> {
    <span class="kw">private final</span> <span class="ty">BigDecimal</span> threshold;
    <span class="kw">public boolean</span> evaluate(<span class="ty">TransactionContext</span> ctx) {
        <span class="kw">return</span> ctx.getAmount().compareTo(threshold) > <span class="str">0</span>;
    }
}

<span class="kw">public class</span> <span class="ty">CountryEquals</span> <span class="kw">implements</span> <span class="ty">RuleExpression</span> {
    <span class="kw">private final</span> <span class="ty">String</span> country;
    <span class="kw">public boolean</span> evaluate(<span class="ty">TransactionContext</span> ctx) {
        <span class="kw">return</span> ctx.getCountry().equals(country);
    }
}

<span class="cm">// Non-terminal expressions — composite logic</span>
<span class="kw">public class</span> <span class="ty">AndExpression</span> <span class="kw">implements</span> <span class="ty">RuleExpression</span> {
    <span class="kw">private final</span> <span class="ty">RuleExpression</span> left, right;
    <span class="kw">public boolean</span> evaluate(<span class="ty">TransactionContext</span> ctx) {
        <span class="kw">return</span> left.evaluate(ctx) && right.evaluate(ctx);
    }
}

<span class="kw">public class</span> <span class="ty">NotExpression</span> <span class="kw">implements</span> <span class="ty">RuleExpression</span> {
    <span class="kw">private final</span> <span class="ty">RuleExpression</span> expr;
    <span class="kw">public boolean</span> evaluate(<span class="ty">TransactionContext</span> ctx) {
        <span class="kw">return</span> !expr.evaluate(ctx);
    }
}

<span class="cm">// Rule parser — builds expression tree from DSL string</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">RuleParser</span> {
    <span class="kw">public</span> <span class="ty">RuleExpression</span> parse(<span class="ty">String</span> rule) {
        <span class="cm">// Parses: "amount > 10000 AND NOT country = US"</span>
        <span class="cm">// Returns a tree of expression objects</span>
        <span class="kw">return</span> buildTree(tokenise(rule));
    }
}

<span class="cm">// Rules engine — evaluates rules against transactions</span>
<span class="an">@Service</span>
<span class="kw">public class</span> <span class="ty">TransactionRulesEngine</span> {
    <span class="kw">private final</span> <span class="ty">RuleRepository</span> ruleRepo;
    <span class="kw">private final</span> <span class="ty">RuleParser</span>     parser;

    <span class="kw">public boolean</span> approve(<span class="ty">Transaction</span> tx) {
        <span class="ty">TransactionContext</span> ctx = <span class="kw">new</span> <span class="ty">TransactionContext</span>(tx);
        <span class="kw">return</span> ruleRepo.findAllActive().stream()
            .map(r -> parser.parse(r.getExpression()))
            .allMatch(expr -> expr.evaluate(ctx));
    }
}

<span class="cm">// Note: For production, prefer Spring Expression Language (SpEL)</span>
<span class="cm">// or Drools rule engine rather than building your own interpreter</span>`,
      impl: ['For production rule engines, use Drools (business rules) or SpEL (Spring Expression Language) — don\'t build your own interpreter unless the language is very simple.', 'SpEL can evaluate expressions like "amount > 10000 and country != \'US\'" directly.', 'Store rule expressions as strings in the database — load and parse at runtime.', 'Cache parsed expression trees — parsing is expensive; evaluation is cheap.']
    }
  ],
  solid: SOLID_PATTERN_RECORDS
};

export const FINTECH_PATTERNS = [
  { name: 'Strategy', reason: 'Fee/pricing algorithms, payment routing, risk models' },
  { name: 'Observer', reason: 'Real-time notifications, fraud alerts, ledger updates' },
  { name: 'Command', reason: 'Transaction execution, audit trails, undo/compensate' },
  { name: 'Chain of Responsibility', reason: 'Payment validation pipelines, compliance checks' },
  { name: 'Factory Method', reason: 'Payment gateway selection, report generation' },
  { name: 'Builder', reason: 'Complex DTOs, loan applications, SWIFT messages' },
  { name: 'Singleton', reason: 'Config registry, connection pools, rate limiters' },
  { name: 'Decorator', reason: 'Logging, metrics, audit wrapping via Spring AOP' },
  { name: 'Facade', reason: 'Customer onboarding, KYC orchestration' },
  { name: 'State', reason: 'Transaction lifecycle, loan approval workflow' },
  { name: 'Proxy', reason: 'Caching (Redis), @Transactional, @PreAuthorize' },
  { name: 'Template Method', reason: 'Loan processing, report generation, ETL pipelines' }
];

export const PROJECT_FILES = {
  structure: `banking-platform/
├── docker-compose.yml
├── gateway-service/
│   ├── Dockerfile
│   ├── src/main/java/com/bank/gateway/
│   │   ├── config/          # Security, rate limiting
│   │   ├── filter/          # JWT validation, logging
│   │   └── GatewayApplication.java
│   └── src/main/resources/
│       └── application.yml
├── account-service/
│   ├── Dockerfile
│   ├── src/main/java/com/bank/account/
│   │   ├── domain/          # Account, Transaction (Builder, State)
│   │   ├── repository/      # Spring Data JPA
│   │   ├── service/         # AccountService (Facade, Singleton)
│   │   ├── event/           # Domain events (Observer)
│   │   └── controller/
│   └── src/main/resources/
│       └── application.yml
├── payment-service/
│   ├── Dockerfile
│   ├── src/main/java/com/bank/payment/
│   │   ├── strategy/        # FeeCalculationStrategy (Strategy)
│   │   ├── command/         # TransferCommand (Command)
│   │   ├── validator/       # PaymentValidator chain (CoR)
│   │   ├── gateway/         # SwiftAdapter, StripeAdapter (Adapter, Factory)
│   │   └── service/
│   └── src/main/resources/
│       └── application.yml
├── notification-service/
│   ├── Dockerfile
│   ├── src/main/java/com/bank/notification/
│   │   ├── channel/         # EmailChannel, SmsChannel (Bridge)
│   │   ├── template/        # Notification templates (Template Method)
│   │   └── listener/        # Kafka consumers (Observer)
│   └── src/main/resources/
│       └── application.yml
└── fraud-service/
    ├── Dockerfile
    ├── src/main/java/com/bank/fraud/
    │   ├── rule/            # RuleExpression (Interpreter)
    │   ├── engine/          # TransactionRulesEngine
    │   └── listener/
    └── src/main/resources/
        └── application.yml`,
  compose: `version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: bank
      POSTGRES_PASSWORD: bank_secret
      POSTGRES_DB: bankdb
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bank"]
      interval: 10s
      retries: 5

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    command: redis-server --appendonly yes
    volumes: [redis_data:/data]

  kafka:
    image: confluentinc/cp-kafka:7.6.0
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_LOG_DIRS: /tmp/kraft-combined-logs
      CLUSTER_ID: MkU3OEVBNTcwNTJENDM2Qk
    ports: ["9092:9092"]

  gateway-service:
    build: ./gateway-service
    ports: ["8080:8080"]
    environment:
      SPRING_PROFILES_ACTIVE: docker
      JWT_SECRET: \${JWT_SECRET}
    depends_on: [account-service, payment-service]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s

  account-service:
    build: ./account-service
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/bankdb
      SPRING_DATASOURCE_USERNAME: bank
      SPRING_DATASOURCE_PASSWORD: bank_secret
      SPRING_REDIS_HOST: redis
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
      SPRING_PROFILES_ACTIVE: docker
    depends_on:
      postgres: {condition: service_healthy}
      kafka: {condition: service_started}

  payment-service:
    build: ./payment-service
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/bankdb
      SPRING_DATASOURCE_USERNAME: bank
      SPRING_DATASOURCE_PASSWORD: bank_secret
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
      STRIPE_API_KEY: \${STRIPE_API_KEY}
      SWIFT_ENDPOINT: \${SWIFT_ENDPOINT}
      SPRING_PROFILES_ACTIVE: docker
    depends_on:
      postgres: {condition: service_healthy}
      kafka: {condition: service_started}

  notification-service:
    build: ./notification-service
    environment:
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
      SMTP_HOST: \${SMTP_HOST}
      SMS_API_KEY: \${SMS_API_KEY}
      SPRING_PROFILES_ACTIVE: docker
    depends_on: [kafka]

  fraud-service:
    build: ./fraud-service
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/bankdb
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
      SPRING_PROFILES_ACTIVE: docker
    depends_on:
      postgres: {condition: service_healthy}
      kafka: {condition: service_started}

volumes:
  postgres_data:
  redis_data:`,
  dockerfile: `# Multi-stage Dockerfile for each service
# ── Stage 1: Build ──────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline -q
COPY src ./src
RUN ./mvnw package -DskipTests -q

# ── Stage 2: Runtime ────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Security: run as non-root user
RUN addgroup -S bank && adduser -S bank -G bank
USER bank
# Health check endpoint
EXPOSE 8080
# Copy built jar
COPY --from=builder /app/target/*.jar app.jar
# JVM tuning for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport \\
               -XX:MaxRAMPercentage=75.0 \\
               -XX:+UseG1GC \\
               -Dspring.profiles.active=docker"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]`,
  appConfig: `# application.yml (account-service example)
spring:
  application:
    name: account-service
  datasource:
    url: jdbc:postgresql://localhost:5432/bankdb
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        jdbc.batch_size: 50
        order_inserts: true
  data:
    redis:
      host: localhost
      port: 6379
      timeout: 2000ms
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      acks: all
      retries: 3
    consumer:
      group-id: account-service
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
  cache:
    type: redis
    redis:
      time-to-live: 300000   # 5 minutes

server:
  port: 8081
  shutdown: graceful

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true

logging:
  pattern:
    console: "%d{HH:mm:ss} [%thread] [%X{traceId}] %-5level %logger{36} - %msg%n"
  level:
    com.bank: DEBUG
    org.springframework.security: WARN

resilience4j:
  circuitbreaker:
    instances:
      payment-gateway:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
  retry:
    instances:
      payment-gateway:
        maxAttempts: 3
        waitDuration: 1s
        exponentialBackoffMultiplier: 2`
};
