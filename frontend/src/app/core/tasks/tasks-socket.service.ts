import { effect, inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../api-url';
import { UserService } from '../user/user.service';
import { Task } from './task';
import { TasksStore } from './tasks-store';

/**
 * Applies server-pushed task changes to {@link TasksStore}.
 *
 * Owns the socket's whole lifecycle. Nothing calls `connect()` — the connection
 * follows `isAuthenticated`, so signing in opens it and signing out closes it
 * without any component having to remember.
 */
@Injectable({ providedIn: 'root' })
export class TasksSocketService {
  private readonly url = inject(API_URL);
  private readonly store = inject(TasksStore);
  private readonly isAuthenticated = inject(UserService).isAuthenticated;

  private socket: Socket | null = null;

  constructor() {
    effect(() => (this.isAuthenticated() ? this.open() : this.close()));
  }

  private open() {
    if (this.socket) {
      return;
    }

    // Without `withCredentials` the handshake carries no session cookie and the
    // gateway hangs up — the connection looks like it works right up until it
    // silently does not.
    const socket = io(this.url, { withCredentials: true });
    this.socket = socket;

    socket.on('task.created', (task: Task) => this.store.upsertTask(task));
    socket.on('task.updated', (task: Task) => this.store.upsertTask(task));
    socket.on('task.deleted', ({ id }: Pick<Task, 'id'>) => this.store.removeTask(id));

    // Events emitted while we were disconnected are gone — nobody buffered them,
    // and nothing will resend them. Refetching on reconnect is the only thing
    // that stops the board drifting silently out of date.
    //
    // This listens on the Manager, not the socket. `socket.on('connect')` also
    // fires for the *first* connection, where it would race the store's own
    // initial fetch; `reconnect` fires only after a connection was lost and
    // re-established.
    socket.io.on('reconnect', () => this.store.reload());
  }

  private close() {
    // A signed-out socket is still an authenticated socket: the gateway checked
    // the session once, at the handshake, and will never look again. Closing it
    // here is what actually ends the session's reach.
    this.socket?.disconnect();
    this.socket = null;
  }
}
