const express = require('express');
const { getTasksHandler, postTasksHandler, updateTaskHandler } = require('../controllers/tasks');

const router = express.Router();

router.get('/', getTasksHandler);
router.post('/', postTasksHandler);
router.put('/', updateTaskHandler);

module.exports = router;
