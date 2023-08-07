const express=require('express');
const mongoose= require('mongoose');
const dotenv = require('dotenv');
const authRoute= require("./routes/auth");
const protectedRoute=require("./routes/protected");
const passport = require("passport");
const session = require('express-session');
const flash = require('connect-flash');

require("./config/passport-config"); // Include the passport-config.js file


dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB connected succesfully")
}).catch((err)=>{
    console.log(err);
});

const app = express();
app.use(session({ 
    secret: 'ok',
    resave: false,
    saveUninitialized: true 
}));
app.use(flash());
app.use(express.json());
app.use(passport.initialize());

app.use("/api", authRoute);
app.use("/api", protectedRoute);

const port = 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});