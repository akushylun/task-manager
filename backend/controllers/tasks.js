const data = [
  { id: 1, title: 'Learn NodeJs', status: 'pending' },
  { id: 2, title: 'Build a Task Manager', status: 'in-progress' },
  { id: 3, title: 'Learn Angular', status: 'completed' },
];

const getTasksHandler = (req, res) => {
  res.json(data);
};

const postTasksHandler = (req, res) => {
  const nextId = data.length + 1;
  const { status, title } = req.body.task;
  const newTask = { id: nextId, title, status };
  data.push(newTask);
  res.status(201).json({ task: newTask });
};

const updateTaskHandler = (req, res) => {
  const { status, id } = req.body.task;
  const taskIndex = data.findIndex((t) => t.id === id);

  if (taskIndex !== -1) {
    data[taskIndex].status = status;
    res.json({ task: data[taskIndex] });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
};

module.exports = { getTasksHandler, postTasksHandler, updateTaskHandler };
