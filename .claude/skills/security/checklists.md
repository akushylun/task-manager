# Security Checklists — Quick Reference

Compact checklists for common security scenarios in Angular frontend applications. Use these for self-review before committing or creating a PR.

---

## Pre-Commit Security Self-Review

Run through this before every commit that touches auth logic, user input handling, or template bindings.

- [ ] No hardcoded secrets, passwords, or API keys in code or environment files
- [ ] No `.env` files staged for commit
- [ ] No `bypassSecurityTrust*` calls with user-controlled input
- [ ] No direct DOM manipulation (`ElementRef.nativeElement.innerHTML`) with dynamic content
- [ ] Error display doesn't leak API internals or stack traces to the user
- [ ] Auth interceptor handles 401/403 responses globally
- [ ] No sensitive data (tokens, PII) in `console.log` statements
- [ ] No secrets in `environment.ts` / `environment.prod.ts`
- [ ] URLs from user input or API are validated before binding to `[href]`/`[src]`
- [ ] `postMessage` handlers validate origin and data structure

---

## New Component/Page Checklist

When adding a new routed component or feature module.

### Access Control
- [ ] Route guard applied if page requires authentication
- [ ] Role-based guard applied for admin/restricted pages
- [ ] Understanding documented that guards are UX — API enforces access
- [ ] Sensitive data not pre-loaded until auth is confirmed

### Input Handling
- [ ] Form inputs have client-side validation (as UX, not security)
- [ ] User-generated content rendered via `[innerHTML]` (auto-sanitized) not direct DOM
- [ ] URLs from external sources validated before rendering
- [ ] File inputs have accepted MIME types and size guidance

### Error Handling
- [ ] HTTP errors handled gracefully (user-friendly messages)
- [ ] Loading/error states don't expose internal API details
- [ ] Network failure shows retry/offline UI

### Data Display
- [ ] Sensitive data (emails, phones) masked where appropriate
- [ ] No full tokens, keys, or secrets visible in the UI
- [ ] Pagination/limits on data fetching (no unbounded API calls)

---

## New Dependency Checklist

Before adding a package to `package.json`.

- [ ] **Need check**: Can this be done with Angular built-ins or existing dependencies?
- [ ] **Audit**: `npm audit` shows no known vulnerabilities for this package
- [ ] **Maintenance**: Last commit within 6 months, responsive to issues
- [ ] **Popularity**: Reasonable download count (>10K weekly for production deps)
- [ ] **Scope**: Package doesn't require unnecessary permissions or make network calls
- [ ] **Name**: Package name is correct (not a typosquat — `@angualr/core` vs `@angular/core`)
- [ ] **License**: Compatible license (MIT, Apache 2.0, BSD — avoid GPL for proprietary code)
- [ ] **Size**: Bundle size reasonable for what it does (check bundlephobia.com)
- [ ] **Lock file**: `package-lock.json` updated and committed after install

---

## Authentication Flow Checklist

When modifying login, token handling, or session management.

### Token Storage
- [ ] Token stored in sessionStorage or memory (prefer over localStorage)
- [ ] No sensitive user data stored in browser storage
- [ ] Token cleared on logout and session expiry
- [ ] No token exposed in URL query parameters or fragment

### Interceptor
- [ ] Token attached via centralized HTTP interceptor (not per-service)
- [ ] Public/auth endpoints excluded from token attachment
- [ ] 401 response triggers logout and redirect
- [ ] Token refresh logic handles concurrent requests (queue and retry)
- [ ] Interceptor is fail-closed: missing token = redirect to login

### Route Guards
- [ ] `CanActivate`/`CanMatch` guard protects authenticated routes
- [ ] Guard checks token existence and validity (not expired)
- [ ] Unauthorized access redirects to login with return URL
- [ ] Guard does NOT serve as the sole security mechanism

### Logout
- [ ] All browser storage cleared (sessionStorage, localStorage tokens)
- [ ] In-memory state reset (signals, BehaviorSubjects)
- [ ] API logout endpoint called (token revocation)
- [ ] User redirected to login page

---

## Environment & Build Checklist

Before deploying to production.

### Environment Files
- [ ] `environment.prod.ts` contains only public configuration
- [ ] No API secrets, private keys, or internal URLs in any environment file
- [ ] API URL points to production endpoint

### Build Configuration
- [ ] AOT compilation enabled (default in Angular CLI)
- [ ] Source maps disabled for production (`"sourceMap": false`)
- [ ] Bundle analyzer run — no unexpected large/suspicious dependencies
- [ ] `console.*` statements stripped or gated behind `isDevMode()`

### Security Headers (coordinate with deployment)
- [ ] CSP configured: `script-src 'self'`, no `'unsafe-inline'` or `'unsafe-eval'`
- [ ] `X-Frame-Options: DENY` or `frame-ancestors 'none'` (anti-clickjacking)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Strict-Transport-Security` header present
- [ ] CORS configured on API to accept only your production origin

### Third-Party Scripts
- [ ] Analytics/tracking scripts loaded conditionally (consent)
- [ ] External scripts use SRI hashes where possible
- [ ] No inline scripts that would require `'unsafe-inline'` CSP

---

## Security Incident Response Checklist

If a security vulnerability is discovered in the frontend.

### Immediate (0-1 hours)
- [ ] Assess severity and scope of the vulnerability
- [ ] Determine if user tokens or data could be compromised
- [ ] If secrets exposed in bundle: rotate all affected keys immediately
- [ ] If XSS found: determine if stored data could be stolen
- [ ] Create a private issue/ticket to track the incident

### Short-term (1-24 hours)
- [ ] Develop and test a fix
- [ ] Deploy the fix to production
- [ ] Verify the fix resolves the vulnerability
- [ ] If tokens compromised: coordinate with API team to revoke affected sessions
- [ ] Review error tracking for exploitation attempts

### Follow-up (1-7 days)
- [ ] Conduct root cause analysis
- [ ] Add automated test that would catch this vulnerability
- [ ] Update security checklists if a gap was found
- [ ] Review similar code for the same vulnerability pattern
- [ ] Document lessons learned

---

*Use these checklists as living documents. Update them as new patterns emerge or the stack evolves.*
