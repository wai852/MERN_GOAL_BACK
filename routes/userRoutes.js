const express = require('express'); // maybe better to use CommonJS in backend
const router = express.Router();
//const {getGoals, createGoal, updateGoal, deleteGoal} = require('../controller/goalController')
const user_controller = require('../controller/userController')
const authManager = require('../middleware/authManager');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('User Route Time: ', Date.now());
    next();
  });

// define the goals route with controllesr
router.post('/',user_controller.user_register);
router.post('/login',user_controller.user_login);
router.get('/me',authManager.verifyToken,user_controller.get_user);
//router.route('/:id').put(user_controller.goal_update).delete(user_controller.goal_delete);

module.exports = router;