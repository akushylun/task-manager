# Resources — Safe UI Refactoring Skill

All sources used in creating the `safe-ui-refactoring` skill for Angular 21, organized by category.

**Note**: This skill was originally created for React and adapted for Angular 21. The foundational refactoring principles from Martin Fowler remain framework-agnostic.

---

## Martin Fowler — Foundational Theory (Framework-Agnostic)

| #   | Title                                                        | URL                                                               | Key takeaway                                                                                                                                   |
| --- | ------------------------------------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Modularizing React Applications with Established UI Patterns | https://martinfowler.com/articles/modularizing-react-apps.html    | Treat UI frameworks as the view layer; separate domain logic from presentation using Presentation-Domain-Data layering (applicable to Angular) |
| 2   | Refactoring Module Dependencies                              | https://martinfowler.com/articles/refactoring-dependencies.html   | How to split programs with layering and manage module dependencies (Service Locator, DI) — JS + Java examples                                  |
| 3   | Refactoring (main site)                                      | https://martinfowler.com/refactoring/                             | Continuous, small, behavior-preserving transformations as part of daily work                                                                   |
| 4   | Catalog of Refactorings                                      | https://martinfowler.com/refactoring/catalog/                     | Comprehensive catalog of named refactoring techniques                                                                                          |
| 5   | Rewriting Strangler Fig (2024)                               | https://martinfowler.com/articles/2024-strangler-fig-rewrite.html | Incrementally replace legacy systems without big-bang rewrites                                                                                 |
| 6   | Branch By Abstraction                                        | https://martinfowler.com/bliki/BranchByAbstraction.html           | Large-scale changes on mainline without long-lived branches — introduce abstraction, swap implementations                                      |
| 7   | Micro Frontends                                              | https://martinfowler.com/articles/micro-frontends.html            | Breaking monolithic frontends into independently deployable pieces                                                                             |
| 8   | Front-end tagged articles (all)                              | https://martinfowler.com/tags/front-end.html                      | Full index of Fowler's frontend writing                                                                                                        |

---

## Angular-Specific Refactoring & Architecture

| #   | Title                                    | URL                                                                                                                                                   | Key takeaway                                                                   |
| --- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 9   | Angular Architecture Best Practices      | https://angular.dev/style-guide                                                                                                                       | Official Angular style guide with architectural patterns and best practices    |
| 10  | Refactoring Angular Applications         | https://blog.angular.io/modern-angular-patterns-standalone-components-f8629f5c9bc6                                                                    | Modern Angular patterns: standalone components, signals, improved tree-shaking |
| 11  | Angular Component Composition Patterns   | https://blog.angular-university.io/angular-component-design-how-to-avoid-custom-event-bubbling-and-extraneous-properties-in-the-local-component-tree/ | Smart vs presentational components, avoiding prop drilling                     |
| 12  | Large-Scale Angular Applications         | https://indepth.dev/posts/1514/clean-architecture-with-angular                                                                                        | Clean architecture principles for scalable Angular apps                        |
| 13  | Enterprise Angular Monorepo Patterns     | https://nx.dev/concepts/decisions/folder-structure                                                                                                    | Nx monorepo structure, modular boundaries, dependency management               |
| 14  | Angular Signals: A New Era of Reactivity | https://blog.angular.io/angular-v16-is-here-4d7a28ec680d                                                                                              | Signal-based reactivity replacing zones, computed values, better performance   |

---

## Angular Code Smells & Anti-Patterns

| #   | Title                          | URL                                                                                                                                     | Key takeaway                                                               |
| --- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 15  | Common Angular Mistakes        | https://blog.angular-university.io/angular-2-smart-components-vs-presentation-components-whats-the-difference-when-to-use-each-and-why/ | Smart vs presentational component confusion, tight coupling                |
| 16  | Angular Anti-Patterns to Avoid | https://blog.simplified.courses/angular-anti-patterns-to-avoid/                                                                         | Manual subscriptions, logic in templates, improper change detection        |
| 17  | RxJS Anti-Patterns in Angular  | https://blog.angular-university.io/rxjs-error-handling/                                                                                 | Nested subscriptions, missing error handling, subscription leaks           |
| 18  | Change Detection Anti-Patterns | https://blog.angular-university.io/onpush-change-detection-how-it-works/                                                                | Default change detection everywhere, missing OnPush optimization           |
| 19  | NgRx Architecture Mistakes     | https://ngrx.io/guide/eslint-plugin/rules                                                                                               | Common state management issues: entity adapter misuse, effect side effects |

---

## Angular Architecture & Scaling Patterns

| #   | Title                                           | URL                                                           | Key takeaway                                                       |
| --- | ----------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| 20  | Modular Architecture with Standalone Components | https://angular.dev/guide/standalone-components               | Migration from NgModules to standalone, simplifying architecture   |
| 21  | State Management Patterns in Angular            | https://ngrx.io/guide/store                                   | NgRx patterns, entity adapters, effects, selectors, signal store   |
| 22  | Lazy Loading Best Practices                     | https://angular.dev/guide/lazy-loading-ngmodules              | Route-based code splitting, loadComponent for standalone           |
| 23  | Folder Structure for Large Angular Apps         | https://angular-enterprise.app/blog/folder-structure/         | Feature-first organization, shared modules, core/shared separation |
| 24  | Angular Service Layers                          | https://blog.angular-university.io/angular-2-redux-ngrx-rxjs/ | Data services, facade pattern, business logic separation           |

---

## Safe Migration & Incremental Strategies

| #   | Title                              | URL                                                                                                            | Key takeaway                                                                 |
| --- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 25  | Feature Flags for Safe Refactoring | https://techdebt.guru/playbooks/feature-flags/                                                                 | Refactoring flags, gradual rollout (1%→100%), zero-risk rollback, flag types |
| 26  | Migrating to Standalone Components | https://angular.dev/reference/migrations/standalone                                                            | Official migration guide from NgModules to standalone architecture           |
| 27  | Angular Signals Migration Guide    | https://angular.dev/guide/signals                                                                              | Incrementally adopting signals, migration from observables                   |
| 28  | Incremental Angular Upgrades       | https://update.angular.io/                                                                                     | Version-by-version upgrade path with automated schematics                    |
| 29  | Control Flow Syntax Migration      | https://angular.dev/guide/templates/control-flow                                                               | Migrating from *ngIf/*ngFor to @if/@for built-in control flow                |
| 30  | UI Strangler Fig Playbook          | https://replay.build/blog/ui-strangler-fig-playbook-a-practical-path-to-replacing-500k-lines-of-monolith-logic | Visual auditing, bridge construction, incremental frontend replacement       |

---

## Technical Debt Prioritization

| #   | Title                                                  | URL                                                                                                                                                                                  | Key takeaway                                                                                    |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| 30  | Technical Debt in React: Prioritizing with CodeScene   | https://codescene.com/engineering-blog/codescene-prioritize-technical-debt-in-react/                                                                                                 | Behavioral code analysis, hotspot detection, churn + complexity metrics                         |
| 31  | Technical Debt in Angular: Prioritizing with CodeScene | https://codescene.com/engineering-blog/codescene-prioritize-technical-debt-in-react/                                                                                                 | Behavioral code analysis, hotspot detection, churn + complexity metrics (applicable to Angular) |
| 32  | Managing Technical Debt in 2026                        | https://zeonedge.com/en/blog/managing-technical-debt-2026-strategies-paydown-engineering                                                                                             | Sprint allocation (20%), data-driven prioritization, velocity tracking                          |
| 33  | Technical Debt Management for Frontend Teams           | https://blog.hemense.net/posts/2025-24-05-the-power-of-technical-debt-management-strategies-for-frontend-teams/the-power-of-technical-debt-management-strategies-for-frontend-teams/ | Embedding debt reduction into delivery cadence                                                  |

---

## Automated Refactoring (Angular Schematics)

| #   | Title                          | URL                                                 | Key takeaway                                                               |
| --- | ------------------------------ | --------------------------------------------------- | -------------------------------------------------------------------------- |
| 34  | Angular CLI Schematics         | https://angular.dev/tools/cli/schematics            | Automated code generation and migration with `ng generate` and `ng update` |
| 35  | Angular Update Guide           | https://update.angular.io/                          | Interactive migration guide with version-specific schematics               |
| 36  | Creating Custom Schematics     | https://angular.dev/tools/cli/schematics-authoring  | Build custom automated refactoring tools for Angular codebase              |
| 37  | Standalone Migration Schematic | https://angular.dev/reference/migrations/standalone | Automated conversion from NgModules to standalone components               |
| 38  | Angular ESLint Rules           | https://github.com/angular-eslint/angular-eslint    | Enforce best practices, detect code smells automatically                   |

---

## Testing for Refactoring Confidence

| #9 | Angular Testing Best Practices | https://angular.dev/guide/testing | Component testing, service testing, TestBed configuration |
| 40 | Testing Implementation Details (Kent C. Dodds) | https://kentcdodds.com/blog/testing-implementation-details | Tests that verify behavior (not implementation) survive refactoring (framework-agnostic) |
| 41 | Angular Testing Library | https://testing-library.com/docs/angular-testing-library/intro/ | User-centric testing approach for Angular components |
| 42 | Spectator - Angular Testing Framework | https://ngneat.github.io/spectator/ | Simplified Angular testing with less boilerplate |
| 43 | NgRx Testing Guide | https://ngrx.io/guide/store/testing | Testing reducers, effects, selectors, integration tests |
| 44 | Visual Regression Testing for Angular | https://bug0.com/knowledge-base/visual-regression-testing-react-angular | Storybook + Chromatic, Playwright VRT, pixel-level comparison |
| 45 | E2E Testing with Playwright | https://playwright.dev/docs/intro | Modern E2E testing for Angular applications |

---

## Angular Performance & Optimization

| #   | Title                                | URL                                                                      | Key takeaway                                                             |
| --- | ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| 46  | OnPush Change Detection Strategy     | https://blog.angular-university.io/onpush-change-detection-how-it-works/ | Performance optimization through OnPush, avoiding unnecessary re-renders |
| 47  | Angular Signals Performance Benefits | https://angular.dev/guide/signals                                        | Fine-grained reactivity, better performance than zone.js                 |
| 48  | TrackBy Functions in Templates       | https://angular.dev/api/common/NgForOf#change-propagation                | Optimizing \*ngFor/@for with proper trackBy                              |
| 49  | Lazy Loading & Code Splitting        | https://angular.dev/guide/lazy-loading-ngmodules                         | Route-based and component-based lazy loading                             |
| 50  | Angular Bundle Optimization          | https://angular.dev/tools/cli/build                                      | Build optimization, dead code elimination, differential loading          |

---

## RxJS Patterns for Angular

| #   | Title                             | URL                                                               | Key takeaway                                                         |
| --- | --------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| 51  | RxJS Best Practices               | https://blog.angular-university.io/rxjs-error-handling/           | Error handling, avoiding nested subscriptions, combination operators |
| 52  | Managing Subscriptions in Angular | https://blog.angular-university.io/rxjs-subjects-and-observables/ | takeUntil pattern, async pipe, DestroyRef with takeUntilDestroyed    |
| 53  | RxJS Operators Decision Tree      | https://rxjs.dev/operator-decision-tree                           | Choose the right operator for data transformation                    |
| 54  | Marble Testing for RxJS           | https://rxjs.dev/guide/testing/marble-testing                     | Testing observable streams and timing                                |

---

## Angular Migration Case Studies

| #   | Title                            | URL                                                          | Key takeaway                                               |
| --- | -------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| 55  | Migrating to Angular Signals     | https://blog.angular.io/introducing-angular-v17-4d7033312e4b | Real-world patterns for adopting signals incrementally     |
| 56  | NgModule to Standalone Migration | https://angular.dev/reference/migrations/standalone          | Step-by-step migration strategy from modules to standalone |
| 57  | AngularJS to Angular Migration   | https://angular.dev/guide/upgrade                            | Hybrid applications, incremental upgrade strategies        |

---

## General Best Practices

| #   | Title                                      | URL                                                                                     | Key takeaway                                                                                |
| --- | ------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 58  | Angular Coding Style Guide                 | https://angular.dev/style-guide                                                         | Official naming conventions, file structure, organizational patterns                        |
| 59  | TypeScript Best Practices for Angular      | https://angular.dev/guide/typescript-configuration                                      | Strict mode, type safety, configuration                                                     |
| 60  | Dependency Injection Patterns              | https://angular.dev/guide/di                                                            | Hierarchical injectors, providedIn, inject() function                                       |
| 61  | Reactive Forms Best Practices              | https://angular.dev/guide/forms/reactive-forms                                          | FormBuilder, validators, dynamic forms                                                      |
| 62  | Angular Security Best Practices            | https://angular.dev/best-practices/security                                             | XSS prevention, sanitization, trusted types                                                 |

---

## Additional Resources

- **Angular Blog**: https://blog.angular.io/ - Official Angular team updates and best practices
- **Angular Community**: https://angular.dev/community - Forums, Discord, conferences
- **This Is Angular**: https://www.thisisangular.com/ - Curated Angular content and patterns
- **Nx Documentation**: https://nx.dev/ - Enterprise-scale Angular architecture
- **NgRx Documentation**: https://ngrx.io/ - Reactive state management for Angular
