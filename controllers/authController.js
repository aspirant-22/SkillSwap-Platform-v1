const User = require("../models/user.js");
const passport = require("passport");


//------------------Signup------------------------------------
module.exports.renderSignupForm = (req , res) => {
    res.render("auth/signup.ejs"); //Since it is in /views/auth/signup.ejs
}

module.exports.signup = async(req , res , next) => {
    try {
        let {user, password} = req.body; 

        //Convert availability to array
        user.availability = [user.availability];

        // Convert string to boolean
        user.isPublic = user.isPublic === "true";

        const newUser = new User(user);
        newUser.profilePhoto = {
            url: req.file.path,
            filename: req.file.filename
        };
        const registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) { 
                return next(err); 
            }
            req.session.success = "Welcome to SkillSwap";
            res.redirect("/");
        });
    } catch (e) {
        req.session.error = e.message;
        res.redirect("/signup");
    }
}

//-----------------------Login--------------------------

module.exports.renderLoginForm = (req , res) => {
    res.render("auth/login.ejs");
}

module.exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);

        // ❌ Login failed
        if (!user) {
            req.session.error = info?.message || "Invalid username or password";
            return res.redirect('/login');
        }

        // ✅ Login success
        req.logIn(user, (err) => {
            if (err) return next(err);

            req.session.success = "Welcome back!";
            if (user.role === "admin"){
                return res.redirect("/admin");
            }
            else {
                return res.redirect('/');
            }
            
        });

    })(req, res, next);
};

//-----------------------Logout---------------------------

module.exports.logout = (req , res , next) => {
    req.logout((err) => {
        if (err){
            return next(err);
        }
        req.session.success = "You are logged out!";
        res.redirect("/");
    })
}