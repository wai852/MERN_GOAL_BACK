const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

exports.generateToken = (id) =>{
    return jwt.sign({ id }, process.env.SECRET_JWT, { expiresIn: process.env.EXPIRES_IN });
};

exports.verifyToken = asyncHandler(async (req, res, next)=>{
    //check header have the token or not;
    //check bearer
    let token;
    var decoded;
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        try {
            //get the token by using split: Bearer asdadsadsadsd
            token = req.headers.authorization.split(' ')[1];
            console.log(token);
            //verify the token, if true => get the playload
            decoded = jwt.verify(token, process.env.SECRET_JWT);
            //check token is expried or not
            //get user from the token playload, also will not get the password 
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("Not Authorized!");
        }
    }
    //when No token at all
    if(!token){
        res.status(401);
        throw new Error("Not Authorized _ token?!");
    }
});
