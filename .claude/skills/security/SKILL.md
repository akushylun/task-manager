---
name: security
description: "Angular frontend security best practices based on OWASP Top 10:2025. Use when reviewing code for vulnerabilities, implementing auth/authorization, handling user input, managing secrets, or working with sensitive data in the browser. Covers Angular sanitization, interceptors, route guards, and CSP."
---

# Security Best Practices — Angular Frontend (OWASP Top 10:2025)

Security guidance for Angular frontend applications. See `examples.md` for unsafe/safe code pairs, `checklists.md` for quick checklists, `references.md` for all sources.

---

## Core Philosophy — Confidence-Based Review

Before flagging any issue, **trace the data flow** and confirm the input source.

| Confidence | Criteria | Action |
|------------|----------|--------|
| **HIGH** | Vulnerable pattern + attacker-controlled input confirmed | **Report** with file, line, exploit, and fix |
| **MEDIUM** | Vulnerable pattern, input source unclear | **Note** for manual verification |
| **LOW** | Theoretical / best-practice deviation | **Do not report** — mention only if asked |

**Do NOT flag**: test files, dead code, values from environment files used only at build time, framework-mitigated patterns (Angular template auto-escaping), development-only code gated by `isDevMode()`.

> **Golden rule**: `environment.apiUrl` (build-time constant) = safe. `route.snapshot.queryParams['url']` (user-controlled) = vulnerable. Always ask: **"Can an attacker control this value?"**

---

## OWASP Top 10:2025 — Frontend Relevance

| # | Category | Key Risk in Angular Apps |
|---|----------|----------------------|
| A01 | **Broken Access Control** | Route guards as sole protection, IDOR via client-side ID manipulation |
| A02 | **Security Misconfiguration** | Missing CSP, permissive CORS expectations, source maps in prod |
| A03 | **Supply Chain Failures** | Compromised npm packages, typosquatting |
| A04 | **Cryptographic Failures** | Secrets in bundles, tokens in localStorage, weak token handling |
| A05 | **Injection** | XSS via `bypassSecurityTrust*`, `innerHTML` bindings, template injection |
| A06 | **Insecure Design** | Sensitive logic in client code, no rate-limit awareness on forms |
| A07 | **Authentication Failures** | Token storage insecurity, missing token refresh, interceptor gaps |
| A08 | **Integrity Failures** | Unvalidated API responses rendered as HTML, postMessage trust |
| A09 | **Logging Failures** | Tokens/PII in console.log, sensitive data in error tracking |
| A10 | **Exceptional Conditions** | Unhandled HTTP errors exposing auth state, error components leaking data |

---

## A01 — Broken Access Control

- Route guards (`CanActivate`, `CanMatch`) are **UX only** — the API must enforce all access control
- Never trust client-side role checks as security boundaries — they prevent UI confusion, not unauthorized access
- Do not embed resource IDs from URL params directly into delete/update requests without understanding the API enforces ownership
- Hide admin UI elements with `*ngIf` but never assume hiding = protection
- Avoid storing authorization decisions in localStorage/sessionStorage where they can be tampered

---

## A02 — Security Misconfiguration

- **CSP**: Configure via meta tag or response headers. Restrict `script-src` to `'self'`, avoid `'unsafe-inline'` and `'unsafe-eval'`
- **Source maps**: Never deploy source maps to production — they expose full source code
- **Environment files**: `environment.prod.ts` is bundled into client code — never put secrets there
- **Angular compiler options**: Ensure `"aot": true` in production (prevents template injection via JIT)
- **Strict template checking**: Enable `strictTemplates: true` to catch unsafe bindings at compile time
- **X-Frame-Options / frame-ancestors**: Prevent clickjacking by ensuring your deployment sets these headers

---

## A03 — Supply Chain Failures

- Run `npm audit` before every release. Commit `package-lock.json` always.
- Pin exact versions for security-sensitive packages
- Before adding a dependency: check CVEs, maintenance activity (< 6 months), download count (> 10K/week), scope of access
- Watch for typosquatting (`@angualr/core` vs `@angular/core`)
- Third-party Angular libraries with custom schematics can execute arbitrary code during `ng add` — audit before running

---

## A04 — Cryptographic Failures

- **Never store secrets in Angular code** — environment files, constants, and source are all visible in the bundle
- **Token storage**: Prefer `httpOnly` cookies (set by API) over `localStorage`. If localStorage is required, understand XSS = full token theft
- **Sensitive data**: Never store PII, payment details, or credentials in browser storage
- **API keys**: Must be proxied through the API — never embed third-party API keys in the frontend bundle
- **Avoid custom crypto**: Don't implement encryption/hashing client-side for security purposes — it provides false confidence

---

## A05 — Injection (XSS)

### Angular's Built-in Sanitization
- Angular auto-sanitizes values bound to `[innerHTML]`, `[style]`, `[href]`, etc.
- The `DomSanitizer` service handles contextual escaping by default

### Dangerous Bypass APIs
- **Never** use `bypassSecurityTrustHtml()`, `bypassSecurityTrustScript()`, `bypassSecurityTrustUrl()`, `bypassSecurityTrustResourceUrl()`, or `bypassSecurityTrustStyle()` with user-controlled input
- If bypass is necessary, sanitize with DOMPurify first, then bypass the already-safe value
- Audit every `bypassSecurityTrust*` call — each one is a potential XSS vector

### Template Injection
- AOT compilation prevents template injection — never use JIT in production
- Never construct templates from user input dynamically (e.g., `new Function()` or `eval()`)
- `[innerHTML]` is safe (Angular sanitizes it), but `bypassSecurityTrustHtml()` on the bound value is not

### URL-Based XSS
- Validate URLs before binding to `[href]` or `[src]` — reject `javascript:` protocol
- User-provided URLs (from query params, API responses) must be validated against an allowlist of protocols (`https:`, `http:`, `mailto:`)

---

## A06 — Insecure Design

- **Client-side validation is UX, not security** — always expect the API to validate
- **Debounce/disable submit buttons** to reduce accidental duplicate submissions, but know the API must handle idempotency
- **Sensitive operations** (payments, account deletion) should require re-authentication — coordinate with API
- **Feature flags**: Don't gate sensitive features purely client-side — code is visible even if UI is hidden

---

## A07 — Authentication Failures

- **Token handling**: Use HTTP interceptors to attach tokens consistently. Never manually append tokens in individual service calls.
- **Token refresh**: Implement refresh logic in the interceptor — queue requests during refresh, retry after new token
- **Logout**: Clear all stored tokens, revoke on the API side, redirect to login
- **Session expiry**: Handle 401 responses globally in the interceptor — redirect to login, clear stale state
- **Auto-logout**: Implement idle timeout for sensitive applications
- **Never decode JWT client-side for authorization decisions** — decode only for display (e.g., showing username). The API enforces authorization.

---

## A08 — Software and Data Integrity

- **postMessage**: Always validate `event.origin` and `event.data` structure in `window.addEventListener('message', ...)` handlers
- **API responses rendered as HTML**: If the API returns HTML content (rich text, CMS), sanitize before rendering with `[innerHTML]` or use DOMPurify + `bypassSecurityTrustHtml`
- **Service workers**: Validate cache integrity. A compromised SW can intercept all requests
- **Third-party scripts**: Load from trusted CDNs with SRI (Subresource Integrity) hashes when possible

---

## A09 — Logging and Alerting

**Never log/send to error trackers**: Tokens, passwords, API keys, PII, credit card numbers
- Scrub sensitive fields before sending to Sentry/Datadog/LogRocket
- Avoid `console.log` with request/response bodies in production builds
- Use Angular's `ErrorHandler` to centralize error reporting and scrub sensitive data
- Configure build to strip `console.*` in production via terser options

---

## A10 — Exceptional Conditions

- **Global error handler**: Implement `ErrorHandler` to catch unhandled exceptions — show user-friendly messages, never raw error details
- **HTTP error interceptor**: Handle 401, 403, 500 gracefully — don't expose API error messages directly to users in production
- **Network failures**: Show appropriate offline/retry UI, don't silently fail and leave stale data
- **Fail-closed on auth errors**: If token verification fails in the interceptor, redirect to login — don't continue with unauthenticated state

---

## Secret Detection

Scan for these patterns in all code and config — none should be in the Angular bundle:

| Type | Pattern |
|------|---------|
| AWS Key | `AKIA[0-9A-Z]{16}` |
| Google API | `AIza[0-9A-Za-z_-]{35}` |
| Generic Secret | `(secret\|key\|token\|password)\s*[:=]\s*['"][^'"]{8,}` |
| Private Key | `-----BEGIN .* PRIVATE KEY-----` |
| GitHub Token | `gh[ps]_[A-Za-z0-9]{36,}` |
| Slack Token | `xox[bpsa]-[0-9a-zA-Z-]+` |

**Never commit**: `.env`, `.env.local`, files containing API keys. Check `environment.ts` files don't contain secrets.

---

## Framework Security Quirks

### Angular-Specific
- `bypassSecurityTrust*` APIs disable Angular's built-in sanitization — every use is a potential XSS
- `[innerHTML]` is safe (sanitized), but `[outerHTML]` is not available and direct DOM manipulation via `ElementRef.nativeElement` bypasses sanitization
- `Renderer2` is safer than direct DOM access — use it for dynamic DOM manipulation
- JIT mode allows template injection — always use AOT in production
- `@HostBinding('innerHTML')` is sanitized, but `@HostBinding('attr.href')` with user input needs validation
- `DomSanitizer.sanitize()` with `SecurityContext.HTML` is the explicit sanitization call

### TypeScript/JavaScript
- Prototype pollution via `__proto__`/`constructor.prototype` — validate object keys from API responses before spreading
- `JSON.parse()` throws on malformed input — always wrap in try-catch
- `RegExp(userInput)` enables ReDoS — escape special characters
- `setTimeout(string)` and `eval()` are implicit code execution — never use with dynamic values
- Template literals with user input in `document.createElement` calls bypass Angular sanitization

### Browser Storage
- `localStorage`/`sessionStorage` are accessible to any script on the same origin — XSS = data theft
- Prefer `httpOnly` cookies for tokens (not accessible to JS)
- Clear sensitive data from storage on logout
- Never store full API responses with PII in browser storage

### Third-Party Integrations
- Embedded iframes: Use `sandbox` attribute to restrict capabilities
- OAuth/OIDC: Validate `state` parameter to prevent CSRF, use PKCE for public clients
- Payment forms: Use provider's hosted fields (Stripe Elements, etc.) — never handle raw card data

---

## Security Review Process

1. **Detect context** — Template binding, interceptor, route guard, service, storage, or dependency change
2. **Load relevant rules** — Only the OWASP categories that apply to this context
3. **Trace data flow** — Where does the input come from? Is it attacker-controlled?
4. **Check framework controls** — Angular sanitization, AOT compilation, strict templates already applied?
5. **Verify exploitability** — Can an attacker actually reach and control this?
6. **Report HIGH confidence only** — Include file, line, exploit scenario, specific fix

---

## Severity Classification

| Severity | Criteria | Angular Examples |
|----------|----------|----------------|
| **CRITICAL** | Direct exploit, no auth required | `bypassSecurityTrustHtml(userInput)`, secrets in environment files, auth bypass in interceptor |
| **HIGH** | Exploitable with conditions | Stored XSS via unsanitized API content, token in localStorage + XSS elsewhere, open redirect |
| **MEDIUM** | Specific conditions, limited impact | Missing CSP, source maps in prod, postMessage without origin check, verbose error display |
| **LOW** | Defense-in-depth | Console.log with tokens in dev, route guard without API enforcement noted |

---

## ASVS 5.0 Quick Reference (Frontend Relevance)

**Level 1 (All Apps)**: HTTPS, no secrets in client bundle, input validation as UX, CSP headers, secure token storage, generic error messages

**Level 2 (Sensitive)**: + Idle timeout, re-auth for sensitive ops, SRI for third-party scripts, comprehensive error handling, postMessage origin validation

**Level 3 (Critical)**: + Certificate pinning consideration, runtime integrity checks, anomaly detection, penetration testing
