const router= require("express").Router();
const CryptoJS= require("crypto-js");
const jwt= require("jsonwebtoken");
const Joi = require("joi");
const User=require("../models/User"); 
const passport = require("passport");


const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().regex(strongPasswordRegex).required(),
});


//Register
router.post("/register", async(req,res)=>{
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
          if(error.details[0].path[0]==="email"){
            return res.status(400).json("Email is invalid");
          }
          else if(error.details[0].path[0]==="password"){
            return res.status(400).json("Password is not strong");
          }
          else{
            return res.status(400).json({ message: error.details[0].path[0]});
          }
          
        }
        const { email, password } = req.body;

        const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();
    
        // Create a new user
        const newUser = new User({
          email: email,
          password: encryptedPassword,
        });
    
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
      }catch (err) {

        res.status(500).json("User already exits");
      }
    
})

//LOGIN
router.post("/login",async(req,res)=>{
    try{
        const user= await User.findOne({email: req.body.email});


        if (!user) {
          return res.status(401).json("Wrong Credentials!. Email is not correct");
        }

        const hashedPassword= CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const Originalpassword= hashedPassword.toString(CryptoJS.enc.Utf8);

        if (Originalpassword !== req.body.password) {
          return res.status(401).json("Wrong Credentials!.Password is not correct.");
        }

        const accessToken= jwt.sign({
            id: user._id,
        },
        process.env.JWT_SEC,
        {expiresIn: "3d"}
        );

        const { password ,...others}= user._doc;

        return res.status(200).json({...others,accessToken});
    }catch(err){
        return res.status(500).json(err);
    }
    
})


//google facebook authentication

router.get("/google", 
  passport.authenticate("google", { 
    scope: ["profile", "email"] 
  })
);


router.get("/google/callback", 
  passport.authenticate("google", { 
    failureRedirect: "/login",
    successRedirect: "/profile",
    failureFlash: true,
    successFlash: "Successfully logged in!",
  })
);


router.get("/facebook", 
  passport.authenticate("facebook", { 
    scope: ["email"] 
  })
);


router.get("/facebook/callback", 
  passport.authenticate("facebook", { 
    failureRedirect: "/login",
    successRedirect: "/profile",
    failureFlash: true,
    successFlash: "Successfully logged in!",
  })
);


module.exports=router;