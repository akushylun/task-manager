import { Task } from './task.entity';

/**
 * What a task looks like on the wire — the frontend's `Task` interface, not the
 * entity.
 *
 * The distinction is not cosmetic. A `Task` loaded with its relation carries the
 * owner, password hash included, and the socket channel runs no interceptors, so
 * `TaskDto` does not protect it. This type and `toTaskPayload` are the whole
 * defence on this channel.
 */
export type TaskPayload = Pick<Task, 'id' | 'title' | 'status'>;

/**
 * Rebuilds the payload field by field.
 *
 * A cast or a bare type annotation would not be enough: TypeScript happily lets
 * a wider object satisfy a narrower type, so an entity with `user` still
 * attached would pass the check and go out on the wire intact. Destructuring is
 * what actually removes it.
 */
export const toTaskPayload = ({
  id,
  title,
  status,
}: TaskPayload): TaskPayload => ({ id, title, status });

/**
 * The room carrying one user's board.
 *
 * Server-assigned on connect: socket.io has no client API for joining a room, so
 * a hostile client cannot ask for someone else's. The alternative — broadcast
 * everything and let the browser filter — would put every user's tasks on every
 * client and trust the frontend not to look.
 */
export const roomForUser = (userId: number) => `user:${userId}`;
