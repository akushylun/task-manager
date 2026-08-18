import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../auth/role.enum';
import { User } from '../auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

// `satisfies` checks every key against the real Repository API, so a typo or a
// method that does not exist fails to compile. The inferred type is the mock's
// own shape, so calling a method we did not fake is a compile error too.
const createRepoMock = () =>
  ({
    findBy: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  }) satisfies Partial<Repository<Task>>;

type RepoMock = ReturnType<typeof createRepoMock>;

const userMock: User = {
  id: 1,
  email: 'owner@gmail.com',
  password: 'hashed',
  role: Role.User,
  tasks: [],
};

const otherUser: User = {
  id: 2,
  email: 'intruder@gmail.com',
  password: 'hashed',
  role: Role.User,
  tasks: [],
};

const taskMock: Task = {
  id: 10,
  title: 'write unit tests',
  status: TaskStatus.Pending,
  user: userMock,
};

describe('TasksService', () => {
  let service: TasksService;
  let repo: RepoMock;

  beforeEach(async () => {
    repo = createRepoMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: repo },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('findAll', () => {
    it('queries only the tasks owned by the given user', async () => {
      repo.findBy.mockResolvedValue([]);

      await service.findAll(userMock);

      expect(repo.findBy).toHaveBeenCalledWith({ user: userMock });
    });

    it('returns the repository result unchanged', async () => {
      const tasks = [taskMock];
      repo.findBy.mockResolvedValue(tasks);

      const result = await service.findAll(userMock);

      expect(result).toBe(tasks);
    });
  });

  describe('createTask', () => {
    const draftTask = { title: 'write unit tests', status: TaskStatus.Pending };
    const createdTask: Task = { id: 1, ...draftTask, user: userMock };
    const savedTask: Task = { ...createdTask };

    beforeEach(() => {
      repo.create.mockReturnValue(createdTask);
      repo.save.mockResolvedValue(savedTask);
    });

    it('attaches the current user to the created task', async () => {
      await service.createTask(draftTask, userMock);

      expect(repo.create).toHaveBeenCalledWith({
        ...draftTask,
        user: userMock,
      });
    });

    it('persists the task it built', async () => {
      await service.createTask(draftTask, userMock);

      expect(repo.save).toHaveBeenCalledWith(createdTask);
    });

    it('returns the persisted task', async () => {
      const result = await service.createTask(draftTask, userMock);

      expect(result).toBe(savedTask);
    });
  });

  describe('updateTask', () => {
    const update = { title: 'renamed task' };

    it('looks the task up by both id and owner', async () => {
      repo.findOneBy.mockResolvedValue(taskMock);
      repo.save.mockResolvedValue(taskMock);

      await service.updateTask(taskMock.id, update, userMock);

      expect(repo.findOneBy).toHaveBeenCalledWith({
        id: taskMock.id,
        user: userMock,
      });
    });

    it('rejects with NotFoundException when the user owns no such task', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateTask(taskMock.id, update, otherUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('persists nothing when the user owns no such task', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateTask(taskMock.id, update, otherUser),
      ).rejects.toThrow();
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('saves the stored task merged with the requested changes', async () => {
      repo.findOneBy.mockResolvedValue(taskMock);
      repo.save.mockResolvedValue(taskMock);

      await service.updateTask(taskMock.id, update, userMock);

      expect(repo.save).toHaveBeenCalledWith({ ...taskMock, ...update });
    });

    it('returns the saved task', async () => {
      const savedTask: Task = { ...taskMock, ...update };
      repo.findOneBy.mockResolvedValue(taskMock);
      repo.save.mockResolvedValue(savedTask);

      const result = await service.updateTask(taskMock.id, update, userMock);

      expect(result).toBe(savedTask);
    });
  });

  describe('removeTask', () => {
    it('looks the task up by both id and owner', async () => {
      repo.findOneBy.mockResolvedValue(taskMock);
      repo.remove.mockResolvedValue(taskMock);

      await service.removeTask(taskMock.id, userMock);

      expect(repo.findOneBy).toHaveBeenCalledWith({
        id: taskMock.id,
        user: userMock,
      });
    });

    it('rejects with NotFoundException when the user owns no such task', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.removeTask(taskMock.id, otherUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('removes nothing when the user owns no such task', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(
        service.removeTask(taskMock.id, otherUser),
      ).rejects.toThrow();
      expect(repo.remove).not.toHaveBeenCalled();
    });

    it('removes the task it found', async () => {
      repo.findOneBy.mockResolvedValue(taskMock);
      repo.remove.mockResolvedValue(taskMock);

      await service.removeTask(taskMock.id, userMock);

      expect(repo.remove).toHaveBeenCalledWith(taskMock);
    });
  });

  // AC7 — documents CURRENT behaviour. Do not treat these as desired behaviour.
  // `updateTask(id, value: Partial<Task>, user)` spreads `value` last, so any
  // Task field a caller passes wins — including `user` and `id`, the two fields
  // the ownership check exists to protect. See the PR description.
  describe('updateTask — AC7: unconstrained Partial<Task> merge', () => {
    it('currently lets the caller reassign the task to another user', async () => {
      repo.findOneBy.mockResolvedValue(taskMock);
      repo.save.mockResolvedValue(taskMock);

      await service.updateTask(taskMock.id, { user: otherUser }, userMock);

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ user: otherUser }),
      );
    });

    it('currently lets the caller change the primary key, retargeting the write', async () => {
      repo.findOneBy.mockResolvedValue(taskMock);
      repo.save.mockResolvedValue(taskMock);

      await service.updateTask(taskMock.id, { id: 999 }, userMock);

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 999 }),
      );
    });
  });
});
