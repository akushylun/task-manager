const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const PORT = 3000;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:4200',
  }),
);

app.use('/tasks', tasksRouter);

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
