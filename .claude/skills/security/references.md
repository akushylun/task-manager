# Security Skill — References and Sources

All sources used to build this security skill, organized by category.

---

## OWASP Official Resources

### OWASP Top 10:2025
- **Official page**: https://owasp.org/Top10/2025/en/
- **Introduction**: https://owasp.org/Top10/2025/0x00_2025-Introduction/
- **What's new in 2025**:
  - A03 expanded to "Software Supply Chain Failures" (was "Injection" at #3)
  - A10 is new: "Mishandling of Exceptional Conditions" (24 CWEs)
  - Broken Access Control remains #1
  - Security Misconfiguration moved from #5 to #2

### OWASP Top 10 2025 Categories

| # | Category | CWEs | % Apps Affected |
|---|----------|------|-----------------|
| A01 | Broken Access Control | 40 | 3.73% |
| A02 | Security Misconfiguration | 16 | 3.00% |
| A03 | Software Supply Chain Failures | 5 | New |
| A04 | Cryptographic Failures | 32 | 3.80% |
| A05 | Injection | 38 | — |
| A06 | Insecure Design | — | — |
| A07 | Authentication Failures | 36 | — |
| A08 | Software/Data Integrity Failures | — | — |
| A09 | Security Logging & Alerting Failures | 5 | — |
| A10 | Mishandling of Exceptional Conditions | 24 | New |

### ASVS 5.0 (Application Security Verification Standard)
- **Official project**: https://owasp.org/www-project-application-security-verification-standard/
- Three verification levels: L1 (all apps), L2 (sensitive data), L3 (critical systems)

### OWASP Agentic AI Security (2026)
- 10 risk categories for AI-powered applications (ASI01–ASI10)
- Covers prompt injection, tool misuse, identity abuse, supply chain, code execution, memory poisoning, inter-agent comms, cascading failures, human-agent trust, rogue agents

---

## Community Security Skills — Sources

### Sentry Security Review Skill (Recommended Winner)
- **Repository**: https://github.com/getsentry/skills
- **Path**: `plugins/sentry-skills/skills/security-review/SKILL.md`
- **Key innovation**: Confidence-based reporting (HIGH/MEDIUM/LOW) to eliminate false positives
- **Approach**: Trace data flow before flagging, understand framework mitigations
- **Coverage**: 17 vulnerability reference guides, Python/JS/Go/Rust/Java, infrastructure

### agamm OWASP Security Skill
- **Repository**: https://github.com/agamm/claude-code-owasp
- **Key innovation**: OWASP Top 10:2025 + ASVS 5.0 + Agentic AI security in one skill
- **Coverage**: 20+ language-specific security quirks with unsafe/safe code pairs

### Trail of Bits Security Skills
- **Repository**: https://github.com/trailofbits/skills
- **Key innovation**: Professional-grade audit tooling (24 skills)
- **Notable skills**:
  - `static-analysis` — CodeQL, Semgrep, SARIF integration
  - `insecure-defaults` — Detect hardcoded credentials, fail-open patterns
  - `differential-review` — Security-focused diff review with git history
  - `supply-chain-risk-auditor` — Dependency threat landscape audit
  - `variant-analysis` — Find similar vulnerabilities across codebases
  - `sharp-edges` — Error-prone APIs and dangerous configurations
  - `constant-time-analysis` — Timing side-channels in crypto code

### Transilience AI Community Tools
- **Repository**: https://github.com/transilienceai/communitytools
- **Key innovation**: Full pentest lifecycle (23 skills, 8 agents, 2 tool integrations)
- **Notable skills**: `/injection`, `/client-side`, `/authentication`, `/api-security`, `/source-code-scanning`

### Anthropic Cybersecurity Skills
- **Repository**: https://github.com/mukul975/Anthropic-Cybersecurity-Skills
- **Coverage**: 754 structured skills mapped to 5 frameworks (MITRE ATT&CK, NIST CSF 2.0, MITRE ATLAS, D3FEND, NIST AI RMF)

---

## Review Articles and Analysis

### TimOnWeb: Security Skills Comparison
- **URL**: https://timonweb.com/ai/i-checked-5-security-skills-for-claude-code-only-one-is-worth-installing/
- **Finding**: Sentry's `security-review` was the only skill worth installing
- **Criteria**: Confidence-based reporting, framework awareness, data flow tracing

### Snyk: Top 9 Claude Security Skills
- **URL**: https://snyk.io/articles/top-claude-skills-cybersecurity-hacking-vulnerability-scanning/
- **Warning**: "Prompt injection found in 36% of skills tested" — always review SKILL.md before installing
- **Top picks**: Trail of Bits, Snyk Fix, Claude Code OWASP

### Hardening Claude Code (Security Review Framework)
- **URL**: https://medium.com/@emergentcap/hardening-claude-code-a-security-review-framework-and-the-prompt-that-does-it-for-you-c546831f2cec

### CSA: Secure Vibe Coding (R.A.I.L.G.U.A.R.D.)
- **URL**: https://cloudsecurityalliance.org/blog/2025/05/06/secure-vibe-coding-level-up-with-cursor-rules-and-the-r-a-i-l-g-u-a-r-d-framework
- **Framework**: R.A.I.L.G.U.A.R.D. for securing AI-assisted development

### OWASP Top 10 2025 Developer Guide
- **URL**: https://www.aikido.dev/blog/owasp-top-10-2025-changes-for-developers
- **Focus**: What changed and what developers should know

---

## Stack-Specific Security Documentation

### Angular
- **Security guide**: https://angular.dev/best-practices/security
- **DomSanitizer API**: https://angular.dev/api/platform-browser/DomSanitizer
- **HttpClient security**: https://angular.dev/guide/http/security
- **CSP compatibility**: https://angular.dev/guide/security#content-security-policy

### DOMPurify
- **Repository**: https://github.com/cure53/DOMPurify
- **Angular integration**: Use with `bypassSecurityTrustHtml` after sanitization

### JWT (Client-Side Handling)
- **RFC 7519**: https://datatracker.ietf.org/doc/html/rfc7519
- **JWT best practices (RFC 8725)**: https://datatracker.ietf.org/doc/html/rfc8725
- **Angular JWT libraries**: `@auth0/angular-jwt`

### Content Security Policy
- **MDN CSP Guide**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- **CSP Evaluator**: https://csp-evaluator.withgoogle.com/
- **Angular CSP considerations**: Avoid `'unsafe-eval'` (required by JIT — use AOT instead)

---

## CVE Databases and Security Tools

### Vulnerability Databases
- **NVD (National Vulnerability Database)**: https://nvd.nist.gov/
- **CVE.org**: https://www.cve.org/
- **GitHub Advisory Database**: https://github.com/advisories
- **Snyk Vulnerability Database**: https://snyk.io/vuln/

### SAST (Static Analysis) Tools
- **SonarQube**: Open source + commercial, 75% detection rate
- **Semgrep**: Open source, rule-based pattern matching
- **CodeQL**: GitHub's query language for code analysis
- **ESLint Security Plugin**: `eslint-plugin-security` for JavaScript patterns

### Dependency Scanning
- **npm audit**: Built into npm CLI
- **Snyk**: SCA + SAST with automated remediation
- **Socket.dev**: Supply chain security for npm

### Browser DevTools Security Features
- **Security tab**: Certificate info, connection security
- **Application tab**: Storage inspection, service worker status
- **Network tab**: Mixed content detection, CORS errors
- **Console**: CSP violation reports

---

## OWASP Cheat Sheets (Quick References)

- **Authentication**: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- **Authorization**: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- **Input Validation**: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- **XSS Prevention**: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- **CSRF Prevention**: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- **JWT Security**: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- **Logging**: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- **Error Handling**: https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html
- **REST Security**: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- **Content Security Policy**: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- **Clickjacking Defense**: https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html

---

## Notable CVEs Relevant to Frontend Security

| CVE | Component | Impact |
|-----|-----------|--------|
| CVE-2025-59536 | Claude Code | Project code executing before trust dialog |
| CVE-2026-21852 | Claude Code | API traffic redirect via ANTHROPIC_BASE_URL |
| Prototype Pollution | Various npm packages | Object injection via `__proto__` |
| ReDoS | User-provided regex | Denial of service via catastrophic backtracking |

---

*Last updated: May 2026. Review and update these references quarterly.*
