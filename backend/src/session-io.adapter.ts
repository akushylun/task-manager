import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RequestHandler } from 'express';
import { Server, ServerOptions } from 'socket.io';

/**
 * Runs the app's `express-session` middleware on the WebSocket handshake.
 *
 * Why an adapter at all: Nest constructs the socket.io `Server` itself, and a
 * gateway's decorator options are evaluated before the DI container exists, so
 * there is no hook inside `TasksGateway` that can reach the server instance.
 * Subclassing the adapter is where you get it.
 *
 * Why reuse the middleware rather than read the cookie: the browser sends
 * `s:<sid>.<signature>`, not a session id. Verifying that signature by hand
 * would put a second definition of "a valid session" in the codebase, keyed on
 * the same secret and free to drift from the first. Handing the request to the
 * *same middleware instance* the HTTP side uses means there is only one.
 *
 * `engine.use` runs for every handshake request, upgrades included, and
 * express-session works against raw Node req/res — it does not need Express.
 */
export class SessionIoAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private readonly sessionMiddleware: RequestHandler,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options) as Server;
    server.engine.use(this.sessionMiddleware);
    return server;
  }
}
