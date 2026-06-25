const User = require("../models/user.js");
const Swap = require("../models/swap.js");
const Feedback = require("../models/feedback.js");

module.exports.renderFeedbackForm = async(req , res , next) => {
    let { swapId } = req.params;
    let swap = await Swap.findById(swapId);   
    res.render("./feedback/new.ejs" , {swap});

}

module.exports.createFeedback = async(req , res , next) => {
    let {swapId , receiver , rating , message} = req.body.feedback;
    const newFeedback = new Feedback({
        swapId ,
        giver : req.user._id, 
        receiver , 
        rating , 
        message
    });
    //Single user cannot give more than 1 feedback for a particular swap
    const existingFeedback = await Feedback.findOne({
        swapId,
        giver : req.user._id
    })
    if (existingFeedback){
        req.session.error = "You already submitted.";
        return res.redirect("/swaps");
    }
    //User cannot rate himself/herself
    if (receiver.toString() === req.user._id.toString()){
        req.session.error = "You cannot rate yourself";
        return res.redirect("/swaps");
    }
    await newFeedback.save();
    //Calculate Average rating
    const reviews = await Feedback.find({receiver});
    const avg = reviews.reduce(
        (sum , r) => sum + r.rating,
        0
    )/reviews.length;
    await User.findByIdAndUpdate(receiver , {avgRating: avg});
    req.session.success = "Thanks for sharing your feedback..!!";
    res.redirect("/swaps");
}