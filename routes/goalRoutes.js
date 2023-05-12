const express = require('express'); // maybe better to use CommonJS in backend
const router = express.Router();
//const {getGoals, createGoal, updateGoal, deleteGoal} = require('../controller/goalController')
const goal_controller = require('../controller/goalController')
const authManager = require('../middleware/authManager');


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Goal Route Time: ', Date.now());
    next();
});

// define the goals route with controllesr
router.route('/').get(authManager.verifyToken, goal_controller.goals_list).post(authManager.verifyToken, goal_controller.goal_create);
router.route('/:id').put(authManager.verifyToken, goal_controller.goal_update).delete(authManager.verifyToken, goal_controller.goal_delete);

module.exports = router;