const data = [
  { id: 1, title: 'Learn NodeJs', status: 'pending' },
  { id: 2, title: 'Build a Task Manager', status: 'in-progress' },
  { id: 3, title: 'Learn Angular', status: 'completed' },
];

const getTasksHandler = (req, res) => {
  console.log('Fetching tasks...');
  res.json(data);
};

const postTasksHandler = (req, res) => {
  console.log('Creating a new task...');
  console.log('Request body:', req.body);
  const nextId = data.length + 1;
  const { status, title } = req.body.task;
  const newTask = { id: nextId, title, status };
  data.push(newTask);
  res.status(201).json({ task: newTask });
};

module.exports = { getTasksHandler, postTasksHandler };
