import type { Session, SessionData } from 'express-session';

// Module augmentation. express-session ships `SessionData` empty — it cannot
// know what WE put on a session. Declaring it once types `session.userId`
// everywhere in the app, with no annotation needed at the call sites.
declare module 'express-session' {
  interface SessionData {
    userId: number | null;
  }
}

// What `req.session` actually is. `Partial` because a freshly created session
// has none of our fields yet.
export type AppSession = Session & Partial<SessionData>;

// destroy() is callback-only — express-session predates promises.
export function destroySession(session: AppSession): Promise<void> {
  return new Promise((resolve, reject) =>
    session.destroy((err) => (err ? reject(err) : resolve())),
  );
}
