const User = require("../models/user.js");
const Swap = require("../models/swap.js");
const Feedback = require("../models/feedback.js");

module.exports.showAllSwaps = async(req , res , next) => {
    const skill = req.query.skill; //Read skill given by user
    let filter = {
        $or : [
            {sender : req.user._id},
            {receiver : req.user._id}
        ]
    }
    if (req.query.status){
        filter.status = req.query.status;
    }
    if (req.query.skill) {
        filter.$and = [
            {
                $or: [
                    { sender: req.user._id },
                    { receiver: req.user._id }
                ]
            },
            {
                $or: [
                    { offeredSkill: { $regex: req.query.skill, $options: "i" } },
                    { requestedSkill: { $regex: req.query.skill, $options: "i" } }
                ]
            }
        ];

        delete filter.$or;
    }
    //find all swaps of currentUser + populate sender & receiver so that we can get entire data of sender and receiver easily by quering 
    let swaps = await Swap.find(filter) 
        .populate("sender")
        .populate("receiver")
    ; 
    let feedbacks = await Feedback.find({giver : req.user._id});
    const feedbackGivenForSwap = new Set(
        feedbacks.map(f => f.swapId.toString())
    );
    res.render("./profile/showCurrUser.ejs" , {swaps, status : req.query.status || "" , skill : req.query.skill || "" , feedbackGivenForSwap});
}

module.exports.createSwap = async(req , res , next) => {
    let {offeredSkill , requestedSkill , message , receiver} = req.body.swap;
    const newSwap = new Swap({
        sender : req.user._id , // logged-in user
        receiver,  // profile being requested  
        offeredSkill,
        requestedSkill,
        message
    });
    await newSwap.save();
    req.session.success = "Swap request sent";
    res.redirect("/swaps");
}

module.exports.acceptSwap = async(req , res , next) => {
    let {id} = req.params;
    let updatedSwap = await Swap.findByIdAndUpdate(id , {$set : {status : "accepted"}});
    //No need of -> updatedSwap.save(); as findByIdAndUpdate() already saves in DB
    req.session.success = "You accepted a swap request";
    res.redirect("/swaps");
}

module.exports.rejectSwap = async(req , res , next) => {
    let {id} = req.params;
    let updatedSwap = await Swap.findByIdAndUpdate(id , {$set : {status : "rejected"}});
    req.session.error = "You rejected this swap request";
    res.redirect("/swaps");
}

module.exports.completeSwap = async(req , res , next) => {
    let {id} = req.params;
    const swap = await Swap.findById(id);
    //Sender Marks as Complete
    if (swap.sender.equals(req.user._id)){
        let updatedSwap = await Swap.findByIdAndUpdate(id , {$set : {senderCompleted : true}}, {new : true});
        req.session.success = "Congratulations🎉!! You completed a swap. But when both users will mark it as completed, Only then status will be updated";
        //Both (Sender and Receiver) confirmed
        if (updatedSwap.senderCompleted && updatedSwap.receiverCompleted){
            await Swap.findByIdAndUpdate(id , {$set : {status : "completed"}});
            res.redirect("/swaps");
        }
        else{
            res.redirect("/swaps");
        }
        
    }
    //Receiver Marks as complete
    else if (swap.receiver.equals(req.user._id)){
        let updatedSwap = await Swap.findByIdAndUpdate(id , {$set : {receiverCompleted : true}}, {new : true});
        req.session.success = "Congratulations🎉!! You completed a swap. But when both users will mark it as completed, Only then status will be updated";
        //Both (Sender and Receiver) confirmed
        if (updatedSwap.senderCompleted && updatedSwap.receiverCompleted){
            await Swap.findByIdAndUpdate(id , {$set : {status : "completed"}});
            res.redirect("/swaps");
        }
        else{
            res.redirect("/swaps");
        }
    }
    
    
    
}

module.exports.deleteSwap = async(req , res , next) => {
    let {id} = req.params;
    const swap = await Swap.findById(id);
    if (swap.status == "pending" || swap.status == "rejected"){
        let deleted = await Swap.findByIdAndDelete(id);
        req.session.success = "Swap Request deleted successfully";
        res.redirect("/swaps");
    }
    else {
        req.session.error = "You cannot delete this swap as it is still in process";
        res.redirect("/swaps");
    }
    
}