if (process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log("Cloud Name:", process.env.CLOUD_NAME);
// console.log("API Key:", process.env.CLOUD_API_KEY);
// console.log("API Secret:", process.env.CLOUD_API_SECRET ? "Loaded" : "Missing");

const express = require("express");
const app = express();
const { cloudinary } = require("./cloudConfig");
const port = 3000;
const path = require("path");
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require("connect-mongo").default;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ejsMate = require('ejs-mate');
const User = require("./models/user");
const Swap = require("./models/swap.js");
const Feedback = require("./models/feedback.js");
const AdminMessage = require("./models/adminMessage.js");
const authRouter = require("./routes/auth.js"); //Add auth router
const profileRouter = require("./routes/profile.js"); //Add profile router
const swapRouter = require("./routes/swaps.js"); //Add swap route
const feedbackRouter = require("./routes/feedback.js"); //Add Feedback Router
const adminRouter = require("./routes/admin.js");
const ExpressError = require("./utils/ExpressError"); 

const dbUrl = process.env.ATLASDB_URL;

app.set("views" , path.join(__dirname , "views"));
app.set("view engine" , "ejs");
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname , "public")));
app.use(express.urlencoded({extended : true})); //V Imp for post route otherwise it won't work
app.engine('ejs', ejsMate);
console.log(MongoStore);
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter : 24 * 3600,
})

store.on("error" , (err) => {
    console.log("ERROR in MONGO SESSION STORE" , err);
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  },
}

app.listen(port , (req , res) => {
    console.log(`Server is listening at port ${port}`);
})

// app.get("/" , (req , res) => {
//     res.send("Server is working"); 
// })

// ADD THIS HERE
app.get("/cloud-test", async (req, res) => {
    try {
        const result = await cloudinary.api.ping();
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});
app.get("/upload-test", async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(
            "https://res.cloudinary.com/demo/image/upload/sample.jpg"
        );

        res.send(result);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});
app.get("/cloud-config", (req, res) => {
    res.send({
        cloud_name: cloudinary.config().cloud_name,
        api_key: cloudinary.config().api_key,
    });
});
//--------------------Express Sessions---------------------------------------





app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use( //Since we are doing login using email
    new LocalStrategy(
        {
            usernameField: "email"
        },
        User.authenticate()
    )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next) => {
    // res.locals.successMsg = req.flash("success"); //Since flash is outdated now
    res.locals.success = req.session.success;
    // res.locals.errorMsg = req.flash("error");
    res.locals.error = req.session.error;
    res.locals.currUser = req.user;

    // clear after one use (flash behavior)
    delete req.session.success;
    delete req.session.error;
    next();
})
//-------------Code for connecting mongoose with Node.js--------------
const mongoose = require('mongoose');
const { type } = require("os");

main()
    .then(() => {
        console.log("connection successful");
    })
    . catch ((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}
//-----------------Test User schema-----------------------

// app.get("/testUser", async(req,res)=>{

//     let user = new User({
//         username:"Sara",
//         email:"sara@gmail.com",
//         location:"US",
//         availability:["weekdays"],
//         isPublic : false,
//         role : "admin",
//     });

//     console.log(req.body);
//     let registeredUser = await User.register( //Adds password + salt + saves user in DB
//         user,
//         "admin123" //this is password for test user
//     );

//     res.send(registeredUser);
// });

//-------------------Test Swap Schema---------------------------

// app.get("/testSwap" , async(req , res) => {
//     let swap = new Swap({
//         sender :  '6a1ce79ab89f2d03d5481ca4',
//         receiver : '6a244132b2286fb50b03eda8',
//         offeredSkill : "Excel",
//         requestedSkill : "UI/UX",
//         message : "I can teach you advanced excel.",
//     });

//     let savedSwap = await swap.save(); //to save newly created swap in DB

//     res.send(savedSwap);
// })

//---------------Test Feedback Schema---------------------------------------
// app.get("/testFeedback" , async(req , res) => {
//     let feedback = new Feedback({
//         swapId : '6a2443e113c61035a88ef9ee',
//         giver : '6a1ce79ab89f2d03d5481ca4',
//         receiver : '6a244132b2286fb50b03eda8',
//         rating : 5,
//         message : "Wonderful Teacher !!! Makes concepts super easy !!",

//     })
//     let savedFeedback = await feedback.save();
//     res.send(savedFeedback);

// })

//--------------Test AdminMessage Schema-------------------------
// app.get("/testAdminMsg" , async(req , res) => {
//     let adminMsg = new AdminMessage({
//         title : "Platform Maintainance",
//         message : "This platform will undergo maintainance from 12am till 1am.",
//         createdBy : '6a24f956e289cebb5886ecce',
//     })
//     let savedAdminMsg = await adminMsg.save();
//     res.send(savedAdminMsg);
// })
//---------------------------------------------------------------------
//----------------Defining routes---------------------------------
app.get("/" , async(req , res) => {
    //Pagination Implementation
    // Current page number
    const page = parseInt(req.query.page) || 1;

    // Users per page
    const limit = 3;

    // Number of users to skip
    const skip = (page - 1) * limit;

    const skill = req.query.skill; //Read skill given by user

    // Filter users
    //Mention condition using which you want to filter users
    let filter = {
        isPublic : true,
        isBanned : false
    }
    if (req.user) { //If user is loggedIn, then do not show his profile in list
        filter._id = {$ne : req.user._id};
    }
    if (req.query.availability) {
        filter.availability = req.query.availability;
    }
    if (req.query.skill) {
        filter.skillsOffered = {
            $regex: req.query.skill,
            $options: "i"
        };
    }
    let users = await User.find(filter)
    .skip(skip)
    .limit(limit);
     // Count total matching users
    const totalUsers = await User.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    res.render("home.ejs", {
        users,
        page,
        totalPages,
        availability : req.query.availability || "",
        skill : req.query.skill || "",
    });
})

app.get("/announcements" , async(req , res) => {
    const messages = await AdminMessage.find();
    res.render("announcement.ejs" , {messages});
})

app.use("/" , authRouter);//For User
app.use("/profile" , profileRouter); //For Profile
app.use("/swaps" , swapRouter); //For Swaps
app.use("/feedback" , feedbackRouter); //For Feedbacks
app.use("/admin" , adminRouter); //For Admin

//---------------Error Handling--------------------------------------------
//Error Handling

app.use((req , res , next) => {
    next(new ExpressError(404 , "Page Not Found!"));
})

app.use((err , req , res , next) => {
    let {statusCode = 500 , message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs" , { message });
    //res.status(statusCode).send(message);
})