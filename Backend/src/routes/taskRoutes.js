const router = require('express').Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/taskController');
router.use(auth);
router.get('/', controller.getTasks);
router.post('/', controller.createTask);
router.put('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);
module.exports = router;
