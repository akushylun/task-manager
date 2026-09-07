---
name: angular-best-practices
description: TypeScript and Angular conventions for this repo — strict typing, DI with inject(), standalone components, change detection, testing, and maintainable patterns.
---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

# Angular v15 Development Guide

## Core Patterns

### Dependency Injection

Use the `inject()` function (preferred in v15+):

```typescript
// ✅ Preferred
private readonly http = inject(HttpClient);
private readonly store = inject(FeatureStore);

// ❌ Avoid constructor injection for new code
constructor(private http: HttpClient) {}
```

### Standalone Components (v15+)

When creating new components, consider standalone:

```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `...`,
})
export class FeatureComponent {}
```

### Change Detection

Always use OnPush for performance:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

## RxJS Best Practices

### Subscription Management

```typescript
private readonly destroy$$ = new Subject<void>();

ngOnInit(): void {
  this.source$.pipe(
    takeUntil(this.destroy$$)
  ).subscribe();
}

ngOnDestroy(): void {
  this.destroy$$.next();
  this.destroy$$.complete();
}
```

### Avoid Nested Subscribes

```typescript
// ❌ Bad
this.user$.subscribe((user) => {
  this.orders$.subscribe((orders) => {});
});

// ✅ Good
combineLatest([this.user$, this.orders$])
  .pipe(takeUntil(this.destroy$$))
  .subscribe(([user, orders]) => {});
```

## NgRx Component Store

### State Updates with Immer

```typescript
import { produce } from 'immer';

readonly updateItem = this.updater((state, item: Item) =>
  produce(state, draft => {
    const index = draft.items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      draft.items[index] = item;
    }
  })
);
```

### Effect Error Handling

```typescript
readonly loadData = this.effect<string>(
  pipe(
    switchMap((id) => this.service.getData(id).pipe(
      tapResponse(
        (data) => this.patchState({ data, loading: false }),
        (error: HttpErrorResponse) => {
          this.patchState({ error: error.message, loading: false });
          // Optionally: this.notificationService.showError(error.message);
        }
      )
    ))
  )
);
```

### ViewModel Pattern

```typescript
// Combine multiple selectors into single vm$
readonly vm$ = this.select({
  items: this.items$,
  loading: this.loading$,
  error: this.error$,
  selectedItem: this.selectedItem$
});

// In template: *ngIf="vm$ | async as vm"
```

## Forms

### Reactive Forms with Strict Typing

```typescript
interface UserForm {
  name: FormControl<string>;
  email: FormControl<string>;
  age: FormControl<number | null>;
}

this.form = this.fb.group<UserForm>({
  name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
  email: this.fb.control('', { nonNullable: true, validators: [Validators.email] }),
  age: this.fb.control(null),
});
```

## Performance

### TrackBy for ngFor

```typescript
trackById = (index: number, item: Entity) => item.id;
```

```html
<div *ngFor="let item of items; trackBy: trackById"></div>
```

### Lazy Loading

```typescript
// In routing module
{
  path: 'feature',
  loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule)
}
```

## Testing

Tests run on **Vitest** via the `@angular/build:unit-test` builder (`npm test` in `frontend/`).
`tsconfig.spec.json` sets `types: ["vitest/globals"]`, so `describe` / `it` / `expect` / `vi`
are global — there is no Jasmine and no Karma. Use `vi.fn()` and `vi.spyOn()`;
`jasmine.createSpyObj` does not exist and will throw.

### Service Testing (HTTP)

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('FeatureService', () => {
  let service: FeatureService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FeatureService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('loads items', async () => {
    const items = [{ id: '1', name: 'Test' }];
    const promise = firstValueFrom(service.getItems());

    httpTesting.expectOne('/api/items').flush(items);

    expect(await promise).toEqual(items);
  });
});
```

### Mocking a Dependency

```typescript
const service = { getItems: vi.fn().mockReturnValue(of(items)) };

TestBed.configureTestingModule({
  providers: [{ provide: FeatureService, useValue: service }],
});
```

Use `provideHttpClient()` + `provideHttpClientTesting()` — `HttpClientTestingModule` is deprecated.
