const express = require('express');
const { getTasksHandler } = require('../controllers/tasks');

const router = express.Router();

router.get('/', getTasksHandler);

module.exports = router;
