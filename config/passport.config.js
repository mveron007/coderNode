import passport from "passport";
import GitHubStrategy from 'passport-github';
import { userModel } from "../dao/models/user.model.js";
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const callback = process.env.CALLBACK_URL;

const initializePassport = () =>{
    passport.use('github', new GitHubStrategy({
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callback
      }, async (accessToken, refreshToken, profile, done) => {
        console.log("ACCESS: " + accessToken);

        try {
            console.log(profile);
            let user = await userModel.findOne({email:profile._json.email});
    
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email: profile._json.email,
                    password: ''
                };
                let result = await userModel.create(newUser);
                done(null, result);
            }else{
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
      }));

    passport.serializeUser((user, done) =>{
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) =>{
        let user = await userModel.findById(id);
        done(null, user);
    })
}

export default initializePassport;