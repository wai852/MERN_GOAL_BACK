const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const authManager = require('../middleware/authManager');

// @desc register a user
// @route POST /api/users
// @access public
exports.user_register = asyncHandler(async (req,res)=>{
    console.log(`${req.method}:`);
    //const {username, email, password} = req.body; can use distructing 
    console.log(req.body.username)
    if(!req.body.username||!req.body.email||!req.body.password){
        res.status(400)
        throw new Error("Specifly username/email/password!")
    }
    //check if user has already existed
    const userExists = await User.find({$or:[{'email':req.body.email},{'username':req.body.username}]});
    if(userExists.length >=1){
        let errors ={}
        if (userExists[0].email === req.body.email){
            errors.email = "Email already exists"
        } else if(userExists[0].username === req.body.username) {
            errors.username = "User Name already exists"
        }
        return res.status(409).json(errors)
    }else{
        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password,salt);
        //create user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })
        const user = await newUser.save();
        console.log(user);
        if(user){ 
            //can give back a JWT 
            res.status(201).json({message:"You sucessfully registered in our website!",
            token: authManager.generateToken(user._id)})
        }else{
            res.status(400);
            throw new Error('Invalid user data!')
        }
    }
});

// @desc login a user
// @route POST /api/users/login
// @access public
exports.user_login = asyncHandler(async (req,res)=>{
    console.log(`${req.method}:`);
    //const {email, password } = req.body
    if(!req.body.email||!req.body.password){
        res.status(400)
        throw new Error("Please Enter the email/password")
    }
    const user = await User.findOne({email:req.body.email});
    if(user && (await bcrypt.compare(req.body.password, user.password))){
        res.status(200).json({message:"Welcome back!",token: authManager.generateToken(user._id)})
    }else{
        res.status(401);
        throw new Error('Invalid user credentials!')
    }

})
// @desc Get user data
// @route GET /api/users/me
// @access private
exports.get_user = asyncHandler(async (req,res)=>{
    console.log(`${req.method}:`);
    res.status(200).json(req.user)
})
