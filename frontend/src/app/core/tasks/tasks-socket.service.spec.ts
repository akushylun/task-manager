import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '../api-url';
import { UserService } from '../user/user.service';
import { Task, TaskStatus } from './task';
import { TasksSocketService } from './tasks-socket.service';
import { TasksStore } from './tasks-store';

// `vi.mock` is hoisted above the imports, so the fake has to be built inside
// `vi.hoisted` rather than in module scope.
const mocks = vi.hoisted(() => {
  const socketHandlers = new Map<string, (payload: unknown) => void>();
  const managerHandlers = new Map<string, () => void>();
  const socket = {
    on: vi.fn((event: string, cb: (payload: unknown) => void) => {
      socketHandlers.set(event, cb);
    }),
    disconnect: vi.fn(),
    io: {
      on: vi.fn((event: string, cb: () => void) => {
        managerHandlers.set(event, cb);
      }),
    },
  };
  return { socket, socketHandlers, managerHandlers, io: vi.fn(() => socket) };
});

vi.mock('socket.io-client', () => ({ io: mocks.io }));

const API = 'http://localhost:3000';

const task = (id: number, overrides: Partial<Task> = {}): Task => ({
  id,
  title: `task ${id}`,
  status: TaskStatus.Pending,
  ...overrides,
});

describe('TasksSocketService', () => {
  let store: TasksStore;
  let users: UserService;
  let http: HttpTestingController;

  /** Push an event the server would have emitted. */
  const emit = (event: string, payload: unknown) => mocks.socketHandlers.get(event)?.(payload);

  beforeEach(() => {
    TestBed.resetTestingModule();
    mocks.socketHandlers.clear();
    mocks.managerHandlers.clear();
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: API },
      ],
    });

    store = TestBed.inject(TasksStore);
    users = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);

    users.set({ id: 1, email: 'owner@example.com' });
    TestBed.inject(TasksSocketService);
    TestBed.tick();

    // The store's httpResource fetches as soon as it is created. Settle it so
    // every test starts from a known, empty board.
    http.expectOne(`${API}/tasks`).flush([]);
    TestBed.tick();
  });

  afterEach(() => http.verify({ ignoreCancelled: true }));

  it('opens the socket with credentials once authenticated', () => {
    expect(mocks.io).toHaveBeenCalledWith(API, { withCredentials: true });
  });

  it('adds a task the server says was created', () => {
    emit('task.created', task(1));

    expect(store.tasks()).toEqual([task(1)]);
  });

  it('does not duplicate a task when its own echo comes back', () => {
    emit('task.created', task(1));
    emit('task.created', task(1));

    expect(store.tasks()).toHaveLength(1);
  });

  it('replaces a task the server says was updated', () => {
    emit('task.created', task(1));
    emit('task.updated', task(1, { status: TaskStatus.Completed }));

    expect(store.tasks()).toEqual([task(1, { status: TaskStatus.Completed })]);
    expect(store.completedTasks()).toHaveLength(1);
  });

  it('applies an update for a task it never saw created', () => {
    emit('task.updated', task(7, { status: TaskStatus.InProgress }));

    expect(store.inProgressTasks()).toHaveLength(1);
  });

  it('removes a task the server says was deleted', () => {
    emit('task.created', task(1));
    emit('task.deleted', { id: 1 });

    expect(store.tasks()).toEqual([]);
  });

  it('ignores a delete for a task it has already dropped', () => {
    emit('task.deleted', { id: 99 });

    expect(store.tasks()).toEqual([]);
  });

  it('refetches on reconnect, because events sent while offline are gone', () => {
    // Stubbed, not just observed: the real reload would fire an HTTP request
    // that the afterEach verify() would then flag as outstanding.
    const reload = vi.spyOn(store, 'reload').mockImplementation(() => {});

    mocks.managerHandlers.get('reconnect')?.();

    expect(reload).toHaveBeenCalledOnce();
  });

  it('does not refetch on the first connection', () => {
    // `connect` would have fired here and raced the store's own initial fetch.
    expect(mocks.socketHandlers.has('connect')).toBe(false);
  });

  it('closes the socket on signout', () => {
    users.clear();
    TestBed.tick();

    expect(mocks.socket.disconnect).toHaveBeenCalledOnce();
  });
});
