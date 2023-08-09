// passport-config.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const dotenv = require('dotenv');
const CryptoJS= require("crypto-js");



dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const currentUser = await User.findOne({
    id,
  });
  done(null, currentUser);
});



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.clientSecret,
      callbackURL: "/api/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        const email=profile.emails[0].value;
        const id=profile.id;
        console.log(profile);
        console.log(profile.emails[0].value);
        console.log(profile.id);
        // Check if the user already exists in the database based on the Google ID
        let user = await User.findOne({email: profile.emails[0].value});

        if (!user) {
          // If the user does not exist, create a new user entry in the database
          const encryptedPassword = CryptoJS.AES.encrypt(id, process.env.PASS_SEC).toString();
          user = new User({
            email: email,
            password: encryptedPassword,
            loginType: "google",
          });
          await user.save();
        }

        if (user.loginType !== "google") {
          //return error
          return done(null, false, {
            message: `You have previously signed up with a different signin method`,
          });
        }

        // Call the 'done' function to complete the authentication process with Passport.js
        return done(null, user);
      } catch (err) {
        console.log(err);
        return done(null,profile);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/facebook/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email=profile.id+"@facebook.com";
        const facebookId= profile.id;
        console.log(email);
        console.log(profile);
        // Check if the user already exists in the database based on the Facebook ID
        let user = await User.findOne({ email });
        console.log(user);
        if (!user) {
          // If the user does not exist, create a new user entry in the database
          const encryptedPassword = CryptoJS.AES.encrypt(facebookId, process.env.PASS_SEC).toString();
          user = new User({
            email,
            password: encryptedPassword,
            loginType: "facebook",
          });
          await user.save();
        }

        if (user.loginType !== "fackbook") {
          //return error
          return done(null, false, {
            message: `You have previously signed up with a different signin method`,
          });
        }

        // Call the 'done' function to complete the authentication process with Passport.js
        return done(null, user);
      } catch (err) {
        
        return done(null,profile);
      }
    }
  )
);

