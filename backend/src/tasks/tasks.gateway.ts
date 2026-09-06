import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BROWSER_ORIGIN } from '../browser-origin';

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

  // TODO(AC3): these sockets are still anonymous. Any page served from
  // BROWSER_ORIGIN can connect without a session, and nothing yet resolves which
  // user is on the other end. Authentication lands next.
  handleConnection(client: Socket) {
    this.logger.log(
      `connected ${client.id} via ${client.conn.transport.name}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`disconnected ${client.id}`);
  }
}
