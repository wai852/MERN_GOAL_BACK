const asyncHandler = require('express-async-handler')
const Goal = require('../models/goal');
const User = require('../models/user')
// @desc GET goals
// @route /api/goal
// @access private
exports.goals_list = asyncHandler(async (req,res)=>{
    console.log(`${req.method}:`);
    //const er = authManager.verifyToken(req.user.token);
    //console.log(er);
    const goals = await Goal.find({user:req.user.id});
    if(!goals){
        console.log("No Goal found");
        res.status(400); 
    }
    console.log(`goal_controller: ${goals}`);
    res.status(200).json(goals);
});

// @desc create a goals
// @route /api/goal
// @access private
exports.goal_create = asyncHandler(async (req,res)=>{
    console.log(`${req.method}:`);
    console.log(req.body);
    if(!req.body.text){
        res.status(400)
        throw new Error("Add a text field!")
    }    
    const goal = new Goal({
        user: req.user.id,
        text: req.body.text
    });
    console.log(goal);
    await goal.save().then(()=>{
        res.status(201).json({text:goal.text, createdAt: goal.createdAt});
    });
})

// @desc Update a goals
// @route /api/goasl/:id
// @access private
exports.goal_update = asyncHandler(async (req,res)=>{
    console.log(`${req.method}:`);
    console.log(req.body.text);
    const goal = await Goal.findById(req.params.id);
    if(!goal){
        res.status(400)
        throw new Error("Goal Not Found!!")
    }
    if(!req.user){
        res.status(401)
        throw new Error("Error!!")
    }
    //A cannot update/delete B's goal vice versa
    if(goal.user.toString()!== req.user.id){
        res.status(401)
        throw new Error("Error!!")
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, 
        {$set:{text:req.body.text}},{new:true});
    res.status(200).json(updatedGoal) //return json obj
})


// @desc Delete goals
// @route /api/goals/:id
// @access private
exports.goal_delete = asyncHandler(async (req,res)=>{
    console.log(`goal delete: ${req.method}:`);
    const goal = await Goal.findById(req.params.id);
    if(!goal){
        res.status(400)
        throw new Error("Error!!")
    }
    if(!req.user){
        res.status(401)
        throw new Error("Error!!")
    }
    //A cannot update/delete B's goal vice versa
    if(goal.user.toString()!== req.user.id){
        res.status(401)
        throw new Error("Bad behavior")
    }
    await Goal.deleteOne(goal);
    res.status(200).json({id: req.params.id, message:`You have deleted goals ${req.params.id} !`}) //return json obj
})

//module.exports = {getGoals, createGoal, updateGoal, deleteGoal};