import { createFeature, createReducer, on, State } from '@ngrx/store';
import { Task } from '../../task-list/task-card/task';
import { tasksActions } from './tasks.actions';

export interface TasksState {
  tasks: Task[];
  loading: boolean;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
};

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: createReducer(
    initialState,
    on(tasksActions.loadTasks, (state) => ({ ...state, loading: true })),
    on(tasksActions.tasksLoadedSuccess, (state, { tasks }) => {
      return { ...state, tasks, loading: false };
    }),
    on(tasksActions.taskAddedSuccess, (state, { task }) => {
      const tasks = [...state.tasks, task];
      return { ...state, tasks };
    }),
    on(tasksActions.taskUpdatedSuccess, (state, { task }) => {
      const tasks = state.tasks.map((t) => (t.id === task.id ? task : t));
      return { ...state, tasks };
    }),
  ),
});
