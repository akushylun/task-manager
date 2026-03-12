import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { Task, TaskStatus } from '../../core/tasks/task';
import { tasksActions } from './tasks.actions';

export interface TasksState extends EntityState<Task> {
  loading: boolean;
}

export const entityAdapter = createEntityAdapter<Task>();
export const initialState: TasksState = entityAdapter.getInitialState({ loading: false });
export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: createReducer(
    initialState,
    on(tasksActions.loadTasks, (state) => ({ ...state, loading: true })),
    on(tasksActions.tasksLoadedSuccess, (state, { tasks }) =>
      entityAdapter.setAll(tasks, { ...state, loading: false }),
    ),
    on(tasksActions.taskAddedSuccess, (state, task) => entityAdapter.addOne(task, state)),
    on(tasksActions.taskUpdatedSuccess, (state, { update }) =>
      entityAdapter.updateOne(update, state),
    ),
    on(tasksActions.taskDeletedSuccess, (state, { id }) => entityAdapter.removeOne(id, state)),
  ),
  extraSelectors: ({ selectTasksState }) => ({
    ...entityAdapter.getSelectors(selectTasksState),
    loading: createSelector(selectTasksState, (state) => state.loading),
    selectPendingTasks: createSelector(
      entityAdapter.getSelectors(selectTasksState).selectAll,
      (tasks) => tasks.filter((item) => item.status === TaskStatus.Pending),
    ),
    selectInProgressTasks: createSelector(
      entityAdapter.getSelectors(selectTasksState).selectAll,
      (tasks) => tasks.filter((item) => item.status === TaskStatus.InProgress),
    ),
    selectCompletedTasks: createSelector(
      entityAdapter.getSelectors(selectTasksState).selectAll,
      (tasks) => tasks.filter((item) => item.status === TaskStatus.Completed),
    ),
  }),
});
