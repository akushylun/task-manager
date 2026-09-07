---
name: safe-ui-refactoring
description: "Safe, incremental refactoring of Angular 21 applications. Use when restructuring components, extracting services, migrating state management, reorganizing file structure, or reducing technical debt in Angular code. Enforces behavior preservation, baby-step execution, and verification at every step."
---

# Safe UI Refactoring

Structured approach to refactoring Angular 21 applications without breaking existing behavior. Every change is small, verified, and reversible.

For the full list of sources and articles behind these guidelines, see [RESOURCES.md](RESOURCES.md).

## Core Rule

**Behavior must be identical before and after every refactoring step.** If you cannot prove the output is unchanged, the step is not complete.

> Refactoring is not a special task — it is part of day-to-day programming. Small, behavior-preserving transformations that keep the system working after each change. — Martin Fowler

## When This Activates

- Restructuring or splitting Angular components
- Extracting services from component bodies
- Migrating state management (services → NgRx, observables → signals, decorator → signal inputs/outputs)
- Reorganizing file/folder structure
- Removing dead code or reducing duplication
- Upgrading Angular versions or replacing deprecated APIs
- Reducing component size (>200 lines) or input count (>7 signal inputs/@Input decorators)
- Addressing code smells flagged by the `angular-best-practices` skill

---

## Phase 1: Assess Before Touching Code

Before any refactoring, establish a clear picture of what exists.

### Identify the Refactoring Target

1. **Read the code** — understand what it does, not just what it looks like
2. **Map dependencies** — what imports this? what does it import?
3. **Check test coverage** — are there tests? do they pass? what do they cover?
4. **Capture current behavior** — document inputs, outputs, side effects, rendered UI

### Decide Whether to Refactor

Refactoring is justified when:

- Code changes frequently AND is hard to modify (high churn + high complexity)
- A new feature would be easier to add after restructuring
- Multiple developers struggle to understand the module
- Code smells accumulate (see catalog below)

Refactoring is NOT justified when:

- Code works, is rarely touched, and is well-tested
- You're under a tight deadline with no safety net
- The "improvement" is purely aesthetic with no measurable benefit

### Establish a Safety Net

Before the first change:

- [ ] All existing tests pass (`npm test`)
- [ ] Baseline behavior is documented or screenshots captured
- [ ] Git working tree is clean (commit or stash unrelated changes)
- [ ] You know how to verify the refactoring didn't break anything

If test coverage is insufficient, **write characterization tests first** — tests that capture current behavior, even if imperfect. These are your safety net.

---

## Phase 2: Plan in Baby Steps

**Every refactoring is a sequence of tiny, independently verifiable steps.** Never combine multiple structural changes in one step.

### Baby Step Rules

1. **One structural change per step** — extract one service method OR rename one file OR split one component. Never combine.
2. **Each step must compile and pass tests** — if it doesn't, the step is too big.
3. **Each step should be summarizable in one sentence** — if you need a paragraph, split it further.
4. **Commit after each successful step** — creates a reversible checkpoint.
5. **Verify behavior after EVERY step** — not just at the end.

### Planning Template

Before starting, write out the step sequence:

```
Refactoring: [target component/module]
Goal: [what the end state looks like]

Steps:
1. [one-sentence description] → verify: [how to confirm behavior unchanged]
2. [one-sentence description] → verify: [how to confirm behavior unchanged]
3. [one-sentence description] → verify: [how to confirm behavior unchanged]
...
```

### Step Sizing Guide

| Step size                                   | Example                                        | Correct?                    |
| ------------------------------------------- | ---------------------------------------------- | --------------------------- |
| Extract one function to a helper            | `formatPrice()` moved to `utils/`              | Yes                         |
| Extract one service method from a component | `loadTasks()` extracted to `TasksService`      | Yes                         |
| Rename a file and update imports            | `list.component.ts` → `task-list.component.ts` | Yes                         |
| Extract service + rename + split component  | Three things at once                           | **No — split into 3 steps** |
| Rewrite entire module from scratch          | "Let me just redo this"                        | **No — incremental only**   |

---

## Phase 3: Execute the Refactoring

### Verification Protocol

After EVERY baby step, run this checklist:

- [ ] **Tests pass** — `npm test` (or the relevant subset)
- [ ] **No new lint errors** — `ng lint` if available
- [ ] **UI renders the same** — visual comparison if applicable
- [ ] **No console errors/warnings** — check browser console
- [ ] **Behavior is identical** — same inputs produce same outputs, same side effects fire
- [ ] **No subscription leaks** — verify observables are properly unsubscribed or use async pipe
- [ ] **Signal dependencies correct** — computed signals update when dependencies change

### Pre/Post Behavior Comparison

For each refactoring step, explicitly verify:

| Check                                   | Before                   | After                    | Match?     |
| --------------------------------------- | ------------------------ | ------------------------ | ---------- |
| Rendered output                         | [describe/screenshot]    | [describe/screenshot]    | Must match |
| Event handlers                          | [list template bindings] | [list template bindings] | Must match |
| API calls (HttpClient)                  | [list calls + params]    | [list calls + params]    | Must match |
| State transitions (signals/observables) | [describe flow]          | [describe flow]          | Must match |
| Side effects (RxJS operators)           | [list effects]           | [list effects]           | Must match |

If ANY row doesn't match, **stop and fix before proceeding.**

### When Something Breaks

1. **Revert the last step** — `git checkout .` or `git stash`
2. **Analyze why** — was the step too large? did you miss a dependency?
3. **Break the step into smaller sub-steps**
4. **Try again** with the smaller steps

Never push forward with broken behavior hoping to "fix it later."

---

## Phase 4: Refactoring Catalog

Specific techniques ordered from safest/simplest to most involved.

### Tier 1 — Rename & Reorganize (lowest risk)

**Rename for clarity** — Change variable, function, or file names to express intent. Use IDE rename refactoring to update all references automatically.

**Move file to correct location** — Relocate a file to match feature-based structure. Update all imports. One file per step. Remember to move both `.ts` and `.html` files for components.

**Remove dead code** — Delete unused imports, unreachable branches, commented-out code. Verify nothing breaks.

### Tier 2 — Extract (medium risk)

**Extract helper function** — Move pure computation out of component body to module scope or a `utils/` file. Function must be pure (same input → same output, no side effects).

**Extract service method** — Move data fetching, business logic, or stateful operations from component to a service. Use `inject()` to access the service in the component.

```typescript
// Before: logic in component
export class TaskList {
  private readonly http = inject(HttpClient);

  loadTasks() {
    return this.http.get<Task[]>('/api/tasks');
  }
}

// After: extracted to service
@Injectable({ providedIn: 'root' })
export class TasksDataService {
  private readonly http = inject(HttpClient);

  loadTasks() {
    return this.http.get<Task[]>('/api/tasks');
  }
}

export class TaskList {
  private readonly tasksService = inject(TasksDataService);

  loadTasks() {
    return this.tasksService.loadTasks();
  }
}
```

**Extract child component** — Split a section of template + its local state into a child component. Pass data via signal inputs or `@Input` decorators. Emit events via signal outputs or `@Output`. The parent's behavior must remain identical.

```typescript
// Before: large component
@Component({
  template: `
    <div class="task-list">
      @for (task of tasks(); track task.id) {
        <div class="task-card">
          <h3>{{ task.title }}</h3>
          <button (click)="deleteTask(task.id)">Delete</button>
        </div>
      }
    </div>
  `
})
export class TaskList {
  tasks = signal<Task[]>([]);
  delete = output<string>();

  deleteTask(id: string) {
    this.delete.emit(id);
  }
}

// After: extracted child component
@Component({
  selector: 'app-task-card',
  template: `
    <div class="task-card">
      <h3>{{ task().title }}</h3>
      <button (click)="delete.emit(task().id)">Delete</button>
    </div>
  `
})
export class TaskCard {
  task = input.required<Task>();
  delete = output<string>();
}

@Component({
  template: `
    <div class="task-list">
      @for (task of tasks(); track task.id) {
        <app-task-card [task]="task" (delete)="delete.emit($event)" />
      }
    </div>
  `
})
export class TaskList {
  tasks = signal<Task[]>([]);
  delete = output<string>();
}
```

**Extract constants** — Move magic strings, numbers, configuration objects to `constants/` files or environment files.

### Tier 3 — Restructure (higher risk)

**Replace input drilling with services** — Instead of passing signal inputs through multiple component layers, inject a shared service to access common data.

**Replace state duplication with derivation** — Remove redundant signals that sync with other state. Use `computed()` to derive values from source signals.

```typescript
// Before: duplicated state
export class TaskList {
  tasks = signal<Task[]>([]);
  completedTasks = signal<Task[]>([]);

  ngOnInit() {
    effect(() => {
      this.completedTasks.set(
        this.tasks().filter(t => t.status === 'completed')
      );
    });
  }
}

// After: derived with computed
export class TaskList {
  tasks = signal<Task[]>([]);
  completedTasks = computed(() =>
    this.tasks().filter(t => t.status === 'completed')
  );
}
```

**Consolidate related state** — Replace multiple related signals with a service using `BehaviorSubject`, a signal-based store, or NgRx when state changes together.

**Introduce layering** — Separate smart components (data fetching, state management) from presentational components (pure display, event emission). Move business logic to services. Follow the Presentation-Domain-Data pattern.

```typescript
// Before: God component
@Component({...})
export class TaskList {
  private readonly http = inject(HttpClient);
  tasks = signal<Task[]>([]);

  ngOnInit() {
    this.http.get<Task[]>('/api/tasks').subscribe(tasks => {
      const sorted = tasks.sort((a, b) => a.priority - b.priority);
      const filtered = sorted.filter(t => !t.archived);
      this.tasks.set(filtered);
    });
  }
}

// After: layered architecture
// Data layer (service)
@Injectable({ providedIn: 'root' })
export class TasksDataService {
  private readonly http = inject(HttpClient);
  getTasks() {
    return this.http.get<Task[]>('/api/tasks');
  }
}

// Domain layer (business logic)
export function filterActiveTasks(tasks: Task[]): Task[] {
  return tasks.filter(t => !t.archived);
}

export function sortByPriority(tasks: Task[]): Task[] {
  return tasks.sort((a, b) => a.priority - b.priority);
}

// Presentation layer (smart component)
@Component({...})
export class TaskListContainer {
  private readonly tasksService = inject(TasksDataService);
  tasks = signal<Task[]>([]);

  ngOnInit() {
    this.tasksService.getTasks().subscribe(tasks => {
      const processed = sortByPriority(filterActiveTasks(tasks));
      this.tasks.set(processed);
    });
  }
}

// Presentation layer (presentational component)
@Component({
  selector: 'app-task-list',
  template: `...`
})
export class TaskList {
  tasks = input.required<Task[]>();
  taskClick = output<Task>();
}
```

**Optimize change detection** — Ensure components use `OnPush` strategy. Add `trackBy` functions to `@for` loops. Minimize template complexity and bindings.

```typescript
// Before: Default change detection
@Component({
  selector: 'app-task-list',
  template: `
    @for (task of tasks(); track task) {
      <app-task-card [task]="task" />
    }
  `
})
export class TaskList {
  tasks = signal<Task[]>([]);
}

// After: OnPush with proper trackBy
@Component({
  selector: 'app-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (task of tasks(); track task.id) {
      <app-task-card [task]="task" />
    }
  `
})
export class TaskList {
  tasks = signal<Task[]>([]);
}
```

### Tier 4 — Migrate (highest risk, requires feature flags)

**Decorator → Signal inputs/outputs** — Migrating from `@Input`/`@Output` decorators to signal-based `input()`/`output()` APIs. Do component by component.

```typescript
// Before: decorator-based
@Component({...})
export class TaskCard {
  @Input({ required: true }) task!: Task;
  @Output() delete = new EventEmitter<string>();
}

// After: signal-based (Angular 21)
@Component({...})
export class TaskCard {
  task = input.required<Task>();
  delete = output<string>();
}
```

**Old → New control flow** — Migrate from `*ngIf`, `*ngFor`, `*ngSwitch` to `@if`, `@for`, `@switch`. Update templates one control structure at a time.

```html
<!-- Before: old control flow -->
<div *ngIf="user$ | async as user">
  <h1>{{ user.name }}</h1>
</div>

<div *ngFor="let task of tasks; trackBy: trackById">
  {{ task.title }}
</div>

<!-- After: new control flow (Angular 21) -->
@if (user$ | async; as user) {
  <div>
    <h1>{{ user.name }}</h1>
  </div>
}

@for (task of tasks; track task.id) {
  <div>{{ task.title }}</div>
}
```

**Observable → Signal-based state** — Migrating from `BehaviorSubject` patterns to signals. Use Branch by Abstraction.

```typescript
// Before: Observable-based
export class UserService {
  private user$$ = new BehaviorSubject<User | null>(null);
  user$ = this.user$$.asObservable();

  setUser(user: User) {
    this.user$$.next(user);
  }
}

// After: Signal-based
export class UserService {
  private userSignal = signal<User | null>(null);
  user = this.userSignal.asReadonly();

  setUser(user: User) {
    this.userSignal.set(user);
  }
}
```

**Template-driven → Reactive forms** — Migrating forms from `ngModel` to `FormControl`/`FormGroup`. One form at a time.

**Module-based → Standalone components** — Remove `NgModule`, add `imports: []` to component decorator, bootstrap standalone. Use `ng generate` schematics where possible.

**Services → NgRx state management** — Introduce NgRx store for complex state. Use Branch by Abstraction: create store, migrate reads, migrate writes, remove service.

**Angular version upgrades** — Use `ng update` schematics for automated migrations. Apply one major version at a time. Review migration guide, update dependencies, run tests.

```bash
ng update @angular/core@21 @angular/cli@21
```

---

## Phase 5: Validate Completion

After ALL steps are done:

- [ ] Full test suite passes
- [ ] No new lint errors or warnings (`ng lint`)
- [ ] Visual regression check (manual or automated) confirms UI unchanged
- [ ] No console errors in browser
- [ ] Bundle size hasn't increased unexpectedly
- [ ] Performance hasn't degraded (no new unnecessary change detection cycles)
- [ ] No subscription leaks (all observables properly cleaned up)
- [ ] Signal dependencies work correctly (computed signals update when source changes)
- [ ] Code is easier to understand than before (the whole point)
- [ ] All temporary scaffolding / feature flags are cleaned up

---

## Code Smells That Signal Refactoring Need

| Smell                                                               | Typical Fix                                                       |
| ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Component > 200 lines                                               | Extract child components and services                             |
| > 7 signal inputs or @Input decorators                              | Split component or use composition                                |
| Multiple signals/BehaviorSubjects in component                      | Extract to service or migrate to NgRx                             |
| Subscriptions without unsubscribe                                   | Use `takeUntilDestroyed()`, `async` pipe, or store in DestroyRef  |
| Nested subscriptions (subscribe inside subscribe)                   | Use RxJS operators: `switchMap`, `combineLatest`, `forkJoin`      |
| Complex logic in templates                                          | Move to component methods, `computed()` signals, or pipes         |
| Manual change detection calls (`detectChanges()`, `markForCheck()`) | Fix OnPush strategy, use signals, or fix observable bindings      |
| Component fetching data in `ngOnInit`                               | Extract to service, use resolver, or NgRx effects                 |
| Copy-pasted template blocks                                         | Extract shared component or `ng-template` with `ngTemplateOutlet` |
| Boolean signal input explosion (`isX()`, `isY()`, `isZ()`)          | Consolidate into variant/status enum                              |
| Using old control flow (`*ngIf`, `*ngFor`) in new code              | Migrate to `@if`, `@for`, `@switch`                               |
| Mixing decorator and signal inputs/outputs                          | Standardize on signal-based APIs (`input()`, `output()`)          |
| God component (fetch + transform + render)                          | Split into smart/presentational components + service              |
| Large service (>300 lines, many responsibilities)                   | Split by domain, introduce facade pattern                         |

---

## Safe Migration Patterns

### Branch by Abstraction

For replacing an implementation without long-lived branches:

1. Create an abstraction (interface/wrapper) over the old code
2. Migrate all consumers to use the abstraction
3. Build the new implementation behind the same abstraction
4. Switch consumers one by one to the new implementation
5. Remove old implementation once fully migrated

### Strangler Fig

For gradually replacing legacy pages or large modules:

1. Identify a self-contained route or feature to migrate first
2. Build the replacement alongside the legacy version (new standalone component)
3. Route traffic to the new version (configure routing or use feature flag)
4. Monitor for errors and performance regressions
5. Repeat for next route/feature until legacy is fully replaced

```typescript
// routes configuration - gradual migration
export const routes: Routes = [
  // New standalone component (migrated)
  { path: 'tasks', loadComponent: () => import('./task-list/task-list').then(m => m.TaskList) },

  // Legacy module-based route (not yet migrated)
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) }
];
```

### Codemods for Bulk Changes

For repetitive, mechanical transforms across many files:

1. Use Angular schematics: `ng update` or `ng generate` with migration schematics
2. For Angular version upgrades, run `ng update @angular/cli @angular/core`
3. For custom migrations, write custom schematics or use find-and-replace with regex
4. Dry-run when possible: `ng update --dry-run`
5. Apply, commit, verify tests pass

```bash
# Angular CLI automated migrations
ng update @angular/core@21 @angular/cli@21

# Generate components with specific patterns
ng generate component my-component --standalone --change-detection OnPush
```

---

## Anti-Patterns

- **Big Bang rewrite** — Rewriting from scratch instead of incrementally. Fails ~70% of the time.
- **Refactoring without tests** — No safety net means no confidence. Write characterization tests first.
- **Combining refactoring with feature work** — Separate commits: refactor first, then build the feature on the clean code.
- **Skipping verification steps** — "It's just a rename" — until it breaks an import path or template binding.
- **Premature abstraction** — Don't create "reusable" components/services before you have 2+ real consumers.
- **Refactoring rarely-touched code** — Focus on high-churn, high-complexity modules. Leave stable code alone.
- **"I'll fix the tests later"** — Tests must pass after EVERY step, not just at the end.
- **Using Default change detection everywhere** — Default strategy causes performance issues. Use `OnPush` by default.
- **Not unsubscribing from observables** — Memory leaks accumulate. Use `async` pipe, `takeUntilDestroyed()`, or proper cleanup.
- **Overusing `ngOnChanges`** — With signals, use `computed()` or `effect()` instead of lifecycle hooks for derived state.
- **Mixing template-driven and reactive forms** — Pick one approach per form. Don't combine `ngModel` with `formControl`.
- **Mixing decorator and signal inputs/outputs** — Standardize on one approach. Prefer signal-based APIs in new Angular 21 code.
- **Using old control flow in new components** — Use `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`, `*ngSwitch` in new code.
- **Manual change detection calls** — Calling `markForCheck()` or `detectChanges()` signals broken reactivity. Fix the root cause with signals or observables.

---

## Remember

- Refactoring changes structure, NEVER behavior
- If behavior changed, it's not refactoring — it's rewriting
- Baby steps feel slow but finish faster than heroic rewrites
- Every step needs a verification checkpoint
- Commit early, commit often — each passing step is a safe rollback point
- The goal is code that's easier to understand and change, not "perfect" code
