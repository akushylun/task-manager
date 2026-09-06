/**
 * The single origin the browser app is served from.
 *
 * Shared by two layers that configure CORS through completely separate
 * mechanisms: `app.enableCors()` in `main.ts` (Express middleware) and the
 * `cors` option on `@WebSocketGateway()` (engine.io). If those two ever drift
 * apart, HTTP keeps working while sockets silently fail to connect — so they
 * read one constant instead of repeating a string literal.
 *
 * Deliberately not from `ConfigService`: a gateway's decorator options are
 * evaluated when the class is defined, before the Nest DI container exists, so
 * nothing injectable can reach them.
 */
export const BROWSER_ORIGIN = 'http://localhost:4200';
