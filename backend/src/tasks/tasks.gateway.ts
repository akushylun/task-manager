import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { IncomingMessage } from 'http';
import { Server, Socket } from 'socket.io';
import type { AppSession } from '../auth/session';
import { BROWSER_ORIGIN } from '../browser-origin';

/** The handshake request, after SessionIoAdapter has run the session middleware. */
type HandshakeRequest = IncomingMessage & { session?: AppSession };

/**
 * Pushes task changes to the browser.
 *
 * The `cors` option is not covered by `app.enableCors()` in `main.ts`.
 * That configures Express middleware; socket.io answers its own handshake
 * requests without ever entering the Express stack. A gateway declared with no
 * `cors` option accepts a handshake from any origin on the internet.
 *
 * Why that matters more here than on a normal route: a cross-origin `fetch`
 * still reaches the server, but the browser withholds the *response* from the
 * calling page. WebSockets have no such backstop — if the server completes the
 * handshake, the calling page gets a fully working duplex channel. This check is
 * the only thing in that path.
 *
 * It defends against a hostile *page*, not a hostile client: anything that is
 * not a browser sets `Origin` to whatever it likes. What stops those is not
 * having a session cookie.
 */
@WebSocketGateway({
  // Sets the CORS response headers. The browser honours them on the *polling*
  // transport, because that is XHR. It does not honour them on a native
  // WebSocket — a `101` is never checked against `Access-Control-Allow-Origin`.
  // So this alone does not keep anyone out; `allowRequest` below does.
  cors: {
    origin: BROWSER_ORIGIN,
    credentials: true,
  },
  // engine.io calls this for every handshake, on both transports, before a
  // connection exists. Refusing here is a 403 at the door rather than an accept
  // followed by a disconnect.
  //
  // A missing Origin header is refused too: browsers always send one, so its
  // absence means a non-browser client, and nothing but the browser app is meant
  // to connect. Loosen this if you ever want to poke at the gateway with wscat.
  allowRequest: (req, callback) =>
    callback(null, req.headers.origin === BROWSER_ORIGIN),
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(TasksGateway.name);

  @WebSocketServer()
  private readonly server: Server;

  /**
   * Authentication happens exactly once, here, because the handshake is the only
   * moment this connection will ever carry HTTP headers. Contrast `AuthGuard`,
   * which re-reads the session on every single request: a socket authenticated
   * now stays authenticated for hours, outliving the session that opened it.
   * Signout therefore has to close the socket — nothing here will notice.
   *
   * Only the id is taken, not the full `User`. `AuthGuard` resolves the row
   * because handlers need the entity; all this connection needs is which room to
   * join, and a DB round trip per connection buys nothing.
   */
  handleConnection(client: Socket) {
    const { session } = client.request as HandshakeRequest;
    const userId = session?.userId;

    if (!userId) {
      // `true` closes the underlying connection rather than just leaving the
      // namespace. Safe to do after connect only because every emit is
      // room-scoped (AC4) and this socket has joined nothing.
      this.logger.warn(`refused ${client.id}: no authenticated session`);
      client.disconnect(true);
      return;
    }

    client.data.userId = userId;
    this.logger.log(
      `connected ${client.id} as user ${userId} via ${client.conn.transport.name}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`disconnected ${client.id}`);
  }
}
