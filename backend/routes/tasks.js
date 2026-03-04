const express = require('express');
const { getTasksHandler, postTasksHandler } = require('../controllers/tasks');

const router = express.Router();

router.get('/', getTasksHandler);
router.post('/', postTasksHandler);

module.exports = router;
