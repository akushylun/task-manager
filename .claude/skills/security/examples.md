# Security Code Examples — Unsafe vs Safe Patterns

Each section shows a vulnerable pattern and its secure replacement, tailored to Angular frontend applications.

---

## 1. XSS via bypassSecurityTrust

### UNSAFE — Bypassing sanitization with user-controlled input

```typescript
@Component({
  template: `<div [innerHTML]="trustedHtml"></div>`
})
export class CommentComponent {
  private sanitizer = inject(DomSanitizer);

  trustedHtml: SafeHtml;

  ngOnInit() {
    // User-controlled content bypasses Angular's sanitizer!
    this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml(this.comment.body);
  }
}
```

### SAFE — DOMPurify before bypass, or rely on Angular's built-in sanitization

```typescript
import DOMPurify from 'dompurify';

@Component({
  template: `<div [innerHTML]="sanitizedHtml"></div>`
})
export class CommentComponent {
  sanitizedHtml: SafeHtml;

  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    // Option 1: Let Angular handle it (safest — no bypass needed)
    // this.sanitizedHtml = this.comment.body;

    // Option 2: If you need tags Angular would strip, sanitize first then bypass
    const clean = DOMPurify.sanitize(this.comment.body, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOW_DATA_ATTR: false
    });
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(clean);
  }
}
```

**Why it works:** Angular's `[innerHTML]` binding sanitizes automatically. If you need richer HTML, DOMPurify strips dangerous elements before `bypassSecurityTrustHtml` marks it as trusted.

---

## 2. URL-Based XSS

### UNSAFE — Binding user-controlled URLs without validation

```typescript
@Component({
  template: `<a [href]="userLink">Visit</a>`
})
export class LinkComponent {
  @Input() userLink: string; // Could be "javascript:alert(document.cookie)"
}
```

### SAFE — Protocol validation

```typescript
@Component({
  template: `<a [href]="safeUrl" rel="noopener noreferrer" target="_blank">Visit</a>`
})
export class LinkComponent {
  @Input() set userLink(value: string) {
    this.safeUrl = this.validateUrl(value);
  }

  safeUrl = '#';

  private validateUrl(url: string): string {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:', 'mailto:'].includes(parsed.protocol) ? url : '#';
    } catch {
      return '#';
    }
  }
}
```

**Why it works:** Angular sanitizes `[href]` bindings and blocks `javascript:` by default, but explicit validation makes the intent clear and handles edge cases. `rel="noopener noreferrer"` prevents the opened page from accessing `window.opener`.

---

## 3. Token Handling in Interceptors

### UNSAFE — Inconsistent token attachment, no error handling

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  // Attaches expired tokens, doesn't handle 401, token visible in all requests
  const cloned = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
  return next(cloned);
};
```

### SAFE — Conditional attachment with refresh and error handling

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (req.url.includes('/public/') || req.url.includes('/auth/login')) {
    return next(req);
  }

  const token = authService.getAccessToken();
  if (!token) {
    authService.redirectToLogin();
    return EMPTY;
  }

  const cloned = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.clearSession();
        authService.redirectToLogin();
      }
      return throwError(() => error);
    })
  );
};
```

**Why it works:** Tokens aren't attached to public endpoints. Expired/invalid tokens trigger logout instead of silently failing. The interceptor handles auth errors globally so individual services don't need to.

---

## 4. Secrets in Environment Files

### UNSAFE — API keys in the Angular bundle

```typescript
// environment.prod.ts — this is bundled into the client JS!
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  stripeKey: 'sk_live_abc123xyz789', // SECRET KEY exposed to all users!
  googleMapsKey: 'AIzaSyB1234567890abcdefg', // Billed key exposed
  internalApiSecret: 'super-secret-value' // Attacker can extract this
};
```

### SAFE — Only public configuration in environment files

```typescript
// environment.prod.ts — only non-secret, public values
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  stripePublishableKey: 'pk_live_abc123', // Publishable keys are designed to be public
  sentryDsn: 'https://abc@sentry.io/123' // DSN is public by design
};
```

**Why it works:** Everything in `environment.ts` is visible in the compiled JavaScript bundle. Secret keys must live on the API side. Only keys explicitly designed for public use (Stripe publishable key, Sentry DSN) belong in the frontend.

---

## 5. Insecure postMessage Handling

### UNSAFE — No origin validation

```typescript
@Component({ /* ... */ })
export class PaymentComponent implements OnInit {
  ngOnInit() {
    window.addEventListener('message', (event) => {
      // Any iframe or window can send messages — no origin check!
      this.processPaymentResult(event.data);
    });
  }
}
```

### SAFE — Origin and structure validation

```typescript
@Component({ /* ... */ })
export class PaymentComponent implements OnInit, OnDestroy {
  private readonly TRUSTED_ORIGIN = 'https://payments.provider.com';
  private messageHandler = this.onMessage.bind(this);

  ngOnInit() {
    window.addEventListener('message', this.messageHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.messageHandler);
  }

  private onMessage(event: MessageEvent): void {
    if (event.origin !== this.TRUSTED_ORIGIN) {
      return;
    }

    if (!this.isValidPaymentResult(event.data)) {
      return;
    }

    this.processPaymentResult(event.data);
  }

  private isValidPaymentResult(data: unknown): data is PaymentResult {
    return (
      typeof data === 'object' && data !== null &&
      'status' in data && 'transactionId' in data
    );
  }
}
```

**Why it works:** Origin validation ensures only messages from the trusted payment provider are processed. Structure validation prevents processing unexpected data shapes. Cleanup on destroy prevents memory leaks and stale handlers.

---

## 6. Open Redirect via Query Parameters

### UNSAFE — Redirecting to unvalidated URL

```typescript
@Component({ /* ... */ })
export class LoginCallbackComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    // Attacker crafts: /login?returnUrl=https://evil.com/phishing
    window.location.href = returnUrl;
  }
}
```

### SAFE — Validate redirect is internal

```typescript
@Component({ /* ... */ })
export class LoginCallbackComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.safeRedirect(returnUrl);
  }

  private safeRedirect(url: string): void {
    if (url.startsWith('/') && !url.startsWith('//')) {
      this.router.navigateByUrl(url);
    } else {
      this.router.navigateByUrl('/dashboard');
    }
  }
}
```

**Why it works:** Only relative paths starting with a single `/` are allowed. Double-slash (`//evil.com`) is rejected because browsers treat it as a protocol-relative URL. Using Angular's router instead of `window.location.href` keeps navigation within the app.

---

## 7. Sensitive Data in Browser Storage

### UNSAFE — Storing sensitive data in localStorage

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  saveUserSession(user: User, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // PII: email, phone, address
    localStorage.setItem('paymentMethods', JSON.stringify(user.cards)); // Card data!
  }
}
```

### SAFE — Minimal storage, sensitive data fetched on demand

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUser = signal<UserProfile | null>(null);

  saveSession(token: string, displayName: string) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('displayName', displayName);
  }

  clearSession() {
    sessionStorage.clear();
    this.currentUser.set(null);
  }

  loadProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/profile').pipe(
      tap(profile => this.currentUser.set(profile))
    );
  }
}
```

**Why it works:** Only non-sensitive identifiers are stored locally. Sensitive data (PII, payment methods) is fetched from the API when needed and held in memory only. `sessionStorage` is cleared when the tab closes. Any XSS vulnerability cannot steal sensitive user data from storage.

---

## 8. Route Guard Without API Enforcement Awareness

### UNSAFE — Client-side role check as sole protection

```typescript
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const user = authService.currentUser();

  // This "protects" admin routes but an attacker can:
  // 1. Modify localStorage to fake admin role
  // 2. Call admin API endpoints directly
  if (user?.role === 'admin') {
    return true;
  }
  return false;
};
```

### SAFE — Guard as UX, explicit API enforcement awareness

```typescript
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.hasRole('admin')) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};

// The guard prevents navigation confusion. The actual protection is in the API:
// - API validates JWT on every request
// - API checks role claims from the verified token
// - API returns 403 if role insufficient
// The interceptor handles unexpected 403s as a fallback
```

**Why it works:** The guard improves UX by preventing users from seeing pages they can't use. Security enforcement happens on the API side. The comment documents this intentionally — making it clear the guard is not a security boundary.

---

## 9. Console Logging Sensitive Data

### UNSAFE — Logging tokens and user data in production

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap(response => {
        console.log('Login response:', response); // Token in console!
        console.log('User credentials:', credentials); // Password in console!
        this.storeToken(response.token);
      })
    );
  }
}
```

### SAFE — No sensitive data logging, environment-aware

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private logger = inject(LoggerService);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap(response => {
        this.logger.debug('Login successful', { email: credentials.email });
        this.storeToken(response.token);
      }),
      catchError(error => {
        this.logger.warn('Login failed', { email: credentials.email, status: error.status });
        return throwError(() => error);
      })
    );
  }
}

// LoggerService strips output in production builds
@Injectable({ providedIn: 'root' })
export class LoggerService {
  debug(message: string, context?: Record<string, unknown>) {
    if (isDevMode()) {
      console.debug(`[DEBUG] ${message}`, context);
    }
  }
}
```

**Why it works:** Sensitive data (tokens, passwords) is never logged. A centralized logger respects the build mode. In production, debug logs are suppressed entirely. Error tracking only captures non-sensitive context.

---

## 10. Direct DOM Manipulation Bypassing Angular Sanitization

### UNSAFE — Using ElementRef to set innerHTML

```typescript
@Directive({ selector: '[appRichText]' })
export class RichTextDirective {
  private el = inject(ElementRef);

  @Input() set appRichText(content: string) {
    // Bypasses Angular's sanitization entirely!
    this.el.nativeElement.innerHTML = content;
  }
}
```

### SAFE — Using Renderer2 or Angular bindings

```typescript
@Component({
  selector: 'app-rich-text',
  template: `<div [innerHTML]="sanitizedContent"></div>`
})
export class RichTextComponent {
  @Input() set content(value: string) {
    // Angular's [innerHTML] binding sanitizes automatically
    this.sanitizedContent = value;
  }

  sanitizedContent = '';
}
```

**Why it works:** Angular's `[innerHTML]` binding runs content through the built-in sanitizer, stripping dangerous elements like `<script>`, event handlers, and `javascript:` URLs. Direct DOM manipulation via `ElementRef.nativeElement` bypasses this entirely.
