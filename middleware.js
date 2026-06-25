//Require (models +  ExpressError.js + schema.js) + export middlewares
const User = require("./models/user.js");
const Swap = require("./models/swap.js");
const Feedback = require("./models/feedback.js");
const AdminMessage = require("./models/adminMessage.js");
const ExpressError = require("./utils/ExpressError.js");
const {userSchema , swapSchema , feedbackSchema , adminMessageSchema}  = require("./schema.js");

 
module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()){
        req.session.error = "You must be logged in to do this action";
        return res.redirect("/login");
    }
    next(); 
}

//Defining Middleware functn (validateProfile) + Joi (profileSchema.validate) for validating profile
module.exports.validateProfile = (req , res , next) => {
    let { error } = userSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    } else {
        next();
    }
}

module.exports.isOwner = async (req , res , next) => {
    let { id } = req.params;
    let user = await User.findById(id);
    if (!user._id.equals(res.locals.currUser._id)){
        req.session.error = "You are not authorised";
        return res.redirect(`/profile/${id}`);
    }
    next();
}

//Defining Middleware functn (validateSwap) + Joi (swapSchema.validate) for validating Swap
module.exports.validateSwap = async(req , res , next) => {
    let { error } = swapSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    } else {
        next();
    }
}

module.exports.isSwapReceiver = async(req , res , next) => {
    let {id} = req.params;
    const swap = await Swap.findById(id);
    if (!swap){
        req.session.error = "Swap request does not exist";
        return res.render("./profile/showCurrUser.ejs");
    }
    if (!swap.receiver.equals(req.user._id)){
        req.session.error = "Only receiver can perform this action";
        return res.render("./profile/showCurrUser.ejs");
    }
    next();
}

module.exports.isSwapSender = async(req , res , next) => {
    let { id} = req.params;
    const swap = await Swap.findById(id);

    if (!swap){
        req.session.error = "Swap request doesn't exist";
        return res.render("./profile/showCurrUser.ejs");
    }
    if (!swap.sender.equals(req.user._id)){
        req.session.error = "Only sender can perform this action";
        return res.render("./profile/showCurrUser.ejs");
    }
    next();
}

module.exports.isSwapParticipant = async(req , res , next) => {
    let { id } = req.params;

    const swap = await Swap.findById(id);

    if (!swap){
        req.session.error = "Swap request doesn't exist";
        return res.render("./profile/showCurrUser.ejs");
    }

    const isSender = swap.sender.equals(req.user._id);
    const isReceiver = swap.receiver.equals(req.user._id);

    if (!isSender && !isReceiver){ //LoggedIn User is Neither a sender or receiver of a particular swap
        req.session.error = "You are not a participant of this swap";
        return res.render("./profile/showCurrUser.ejs");
    }

    next();
}

//Defining Middleware functn (validateFeedback) + Joi (swapSchema.validate) for validating Feedback
module.exports.validateFeedback = async(req , res , next) => {
    let { error } = feedbackSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    } else {
        next();
    }
}

module.exports.isCompleteSwapParticipant = async(req , res , next) => {
    const swapId =
        req.params.swapId ||
        req.body?.feedback?.swapId
    ; //Extract the corresponding swapId
    let swap = await Swap.findById(swapId) ; //Find corresponding Swap

    if (!swap){
        req.session.error = "Swap not found";
        return res.redirect("/swaps");
    }
    if (!(swap.status === "completed" && (req.user._id.equals(swap.sender) || req.user._id.equals(swap.receiver)))){
        req.session.error = "You are not allowed to give feedback for this swap.";
        return res.redirect("/swaps");
    }

    next();
}

//Defining Middleware functn (validateAdminMessage) + Joi (adminMessageSchema.validate) for validating adminMessage
module.exports.validateAdminMessage = async(req , res , next) => {
    let { error } = adminMessageSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    } else {
        next();
    }
}

module.exports.isAdmin = async(req , res , next) => {
    if (!req.user || req.user.role !== "admin"){ //req.user -> Means loggedIn User
        req.session.error = "You are not allowed to access this";
        return res.redirect("/");
    }

    next();
}