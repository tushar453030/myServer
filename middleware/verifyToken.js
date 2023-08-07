const jwt = require("jsonwebtoken");
const User = require("../models/User");


const verifyToken = (req,res,next) => {
    const authHeader = req.headers.token
    if(authHeader){
        const token=authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC,async(err,user) =>{
            if(err){
                return res.status(403).json("Token not valid");
            }
            // user.id Extract the user ID
            const info=await User.findById(user.id);

            req.user=info;
            next();
        });
    }else{
        return res.status(401).json("You are not authenticated.Missing token");
    }
}
module.exports = {verifyToken};