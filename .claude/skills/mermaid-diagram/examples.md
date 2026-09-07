# Mermaid Diagram Examples

Ready-to-use templates tailored to Angular frontend applications.

---

## 1. Flowchart — Form Submission Flow

```mermaid
flowchart TD
    A((User)) --> B[Fill form fields]
    B --> C{Client validation?}
    C -->|Invalid| D[Show validation errors]
    D --> B
    C -->|Valid| E[Disable submit button]
    E --> F[Call API via service]
    F --> G{API response?}
    G -->|Success| H[Show success toast]
    G -->|Error| I[Show error message]
    I --> J[Re-enable submit]
    H --> K[Navigate to list]

    style D fill:#ff6b6b,color:#fff
    style H fill:#51cf66,color:#fff
```

---

## 2. Sequence Diagram — JWT Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant App as Angular App
    participant Guard as Route Guard
    participant Interceptor as HTTP Interceptor
    participant API as REST API

    User->>App: Enter credentials
    App->>API: POST /api/auth/login
    activate API
    API-->>App: 200 { token, user }
    deactivate API
    App->>App: Store token in sessionStorage
    App->>App: Navigate to /dashboard

    User->>App: Visit /admin
    App->>Guard: CanActivate check
    Guard->>Guard: Check token exists & not expired
    alt Authorized
        Guard-->>App: true
        App->>Interceptor: GET /api/admin/data
        Interceptor->>Interceptor: Attach Bearer token
        Interceptor->>API: Request with Authorization header
        API-->>App: 200 { data }
    else Unauthorized
        Guard-->>App: UrlTree(/login)
    end
```

---

## 3. Sequence Diagram — HTTP Interceptor Chain

```mermaid
sequenceDiagram
    participant Component
    participant Service as Angular Service
    participant AuthInt as Auth Interceptor
    participant ErrorInt as Error Interceptor
    participant LoadingInt as Loading Interceptor
    participant API as REST API

    Component->>Service: loadData()
    Service->>LoadingInt: HttpRequest
    LoadingInt->>LoadingInt: Show loading spinner
    LoadingInt->>AuthInt: Forward request
    AuthInt->>AuthInt: Attach Bearer token
    AuthInt->>ErrorInt: Forward request
    ErrorInt->>API: Send HTTP request
    alt Success
        API-->>ErrorInt: 200 Response
        ErrorInt-->>AuthInt: Pass through
        AuthInt-->>LoadingInt: Pass through
        LoadingInt->>LoadingInt: Hide spinner
        LoadingInt-->>Service: HttpResponse
        Service-->>Component: Data Observable
    else 401 Unauthorized
        API-->>ErrorInt: 401
        ErrorInt->>ErrorInt: Clear session, redirect to login
    end
```

---

## 4. Class Diagram — Angular Service Architecture

```mermaid
classDiagram
    class AuthService {
        -currentUser: Signal~User~
        -tokenKey: string
        +login(credentials) Observable~LoginResponse~
        +logout() void
        +getAccessToken() string
        +isAuthenticated() boolean
        +hasRole(role) boolean
    }

    class HttpInterceptorFn {
        <<functional>>
        +intercept(req, next) Observable~HttpEvent~
    }

    class AuthGuard {
        <<functional>>
        +canActivate() boolean | UrlTree
    }

    class UserProfileComponent {
        +user: Signal~User~
        +isEditing: Signal~boolean~
        +save() void
        +cancel() void
    }

    class UserService {
        -http: HttpClient
        +getProfile() Observable~User~
        +updateProfile(data) Observable~User~
    }

    AuthService --> HttpInterceptorFn : provides token
    AuthService --> AuthGuard : checks auth
    UserProfileComponent --> UserService : uses
    UserService --> AuthService : depends on
```

---

## 5. State Diagram — Authentication State Machine

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated: App loads
    Unauthenticated --> Authenticating: Login submitted
    Authenticating --> Authenticated: Token received
    Authenticating --> Unauthenticated: Login failed
    Authenticated --> Refreshing: Token near expiry
    Refreshing --> Authenticated: New token received
    Refreshing --> Unauthenticated: Refresh failed
    Authenticated --> Unauthenticated: Logout / 401

    state Authenticated {
        [*] --> Idle
        Idle --> Loading: API request
        Loading --> Idle: Response received
        Loading --> Error: Request failed
        Error --> Idle: Retry / dismiss
    }
```

---

## 6. Flowchart — Lazy Loading Route Resolution

```mermaid
flowchart LR
    A[User navigates] --> B{Route matched?}
    B -->|No| C[Show 404 page]
    B -->|Yes| D{Lazy loaded?}
    D -->|No| E[Activate component]
    D -->|Yes| F[Load chunk JS]
    F --> G{Chunk loaded?}
    G -->|Error| H[Show load error]
    G -->|Yes| I{Guards pass?}
    I -->|No| J[Redirect to login]
    I -->|Yes| K{Resolver?}
    K -->|No| E
    K -->|Yes| L[Fetch data]
    L --> E

    style C fill:#ff6b6b,color:#fff
    style H fill:#ff6b6b,color:#fff
```

---

## 7. Flowchart — Global Error Handling Architecture

```mermaid
flowchart TD
    A[Angular Component] --> B{Error type?}
    B -->|HTTP Error| C[HTTP Interceptor]
    B -->|Runtime Error| D[Global ErrorHandler]
    B -->|RxJS Error| E[catchError operator]

    C --> F{Status code?}
    F -->|401| G[Clear session → Login]
    F -->|403| H[Show forbidden page]
    F -->|404| I[Show not found]
    F -->|500| J[Show generic error]
    F -->|0| K[Show offline message]

    D --> L[Log to error service]
    L --> M[Show error toast]
    E --> N[Component error state]

    style G fill:#ff6b6b,color:#fff
    style H fill:#ff6b6b,color:#fff
```

---

## 8. ER Diagram — Application Data Model

```mermaid
erDiagram
    USER {
        string id PK
        string email UK "unique"
        string displayName
        string role "enum: admin, user"
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    PAYMENT_METHOD {
        string id PK
        string userId FK
        string type "enum: card, bank, wallet"
        string provider
        string maskedNumber "last 4 digits"
        boolean isDefault
        datetime createdAt
    }

    TRANSACTION {
        string id PK
        string userId FK
        string paymentMethodId FK
        number amount
        string currency
        string status "enum: pending, completed, failed"
        datetime createdAt
    }

    USER ||--o{ PAYMENT_METHOD : "has"
    USER ||--o{ TRANSACTION : "makes"
    PAYMENT_METHOD ||--o{ TRANSACTION : "used in"
```

---

## 9. Flowchart — Reactive Form Validation

```mermaid
flowchart TD
    A[User types in field] --> B[FormControl valueChanges]
    B --> C{Sync validators}
    C -->|Invalid| D[Set control errors]
    C -->|Valid| E{Async validators?}
    E -->|No| F[Mark as valid]
    E -->|Yes| G[Call API for validation]
    G --> H{API response?}
    H -->|Valid| F
    H -->|Invalid| D
    D --> I[Show error messages]
    F --> J{Form valid?}
    J -->|All valid| K[Enable submit button]
    J -->|Some invalid| L[Disable submit button]

    style D fill:#ff6b6b,color:#fff
    style K fill:#51cf66,color:#fff
```

---

## 10. Gantt Chart — Feature Implementation Plan

```mermaid
gantt
    dateFormat YYYY-MM-DD
    title Feature Implementation Plan

    section Shared
        Data models & interfaces  :done, models, 2024-01-01, 1d
        API service layer         :done, api, after models, 2d
        State management setup    :state, after api, 2d

    section Components
        List component            :list, after state, 2d
        Detail component          :detail, after list, 2d
        Form component            :form, after detail, 3d
        Dialog components         :dialog, after form, 1d

    section Integration
        Route configuration       :routes, after dialog, 1d
        Guard & resolver setup    :guards, after routes, 1d
        E2E tests                 :e2e, after guards, 3d
        Code review               :review, after e2e, 1d
```

---

## 11. Mindmap — Angular Application Architecture

```mermaid
mindmap
  root((Angular App))
    Core
      Auth Service
      HTTP Interceptors
      Error Handler
      Route Guards
    Features
      Dashboard Module
      Payments Module
      Settings Module
      Admin Module
    Shared
      UI Components
      Pipes
      Directives
      Validators
    State
      Signals
      RxJS Subjects
      NgRx Store
    Infrastructure
      Angular 19
      Angular Material
      Tailwind CSS
      Nx Workspace
```

---

## 12. Sequence Diagram — Component Communication via Service

```mermaid
sequenceDiagram
    participant Sidebar as SidebarComponent
    participant Service as NavigationService
    participant Header as HeaderComponent
    participant Router as Angular Router

    Sidebar->>Service: selectMenuItem(item)
    Service->>Service: Update BehaviorSubject
    Service-->>Header: activeItem$ emits
    Header->>Header: Update breadcrumb
    Service-->>Router: router.navigate([item.route])
    Router-->>Sidebar: routerLinkActive updates
```
