const getTasksHandler = (req, res) => {
  console.log('Fetching tasks...');
  res.json([
    { id: 2, title: 'Learn NodeJs', status: 'pending' },
    { id: 3, title: 'Build a Task Manager', status: 'in-progress' },
    { id: 1, title: 'Learn Angular', status: 'completed' },
  ]);
};

module.exports = { getTasksHandler };
