const User = require("../models/user.js");
const Swap = require("../models/swap.js");
const Feedback = require("../models/feedback.js");

module.exports.showCurrUserProfile = async(req, res, next) => {
    const skill = req.query.skill; 
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
    let {id} = req.params;
    const user = await User.findById(id);
    let swaps = await Swap.find(filter) 
        .populate("sender")
        .populate("receiver")
    ; 
    let feedbacks = await Feedback.find({giver : req.user._id});
    const feedbackGivenForSwap = new Set(
        feedbacks.map(f => f.swapId.toString())
    );
    res.render("./profile/showCurrUser.ejs" , { user , swaps, status : req.query.status || "", skill : req.query.skill || "" , feedbackGivenForSwap});
}

module.exports.renderProfile = async(req , res , next) => {
    let { id } = req.params; //Extract "id" of a particular user
    const profile = await User.findById(id);
    if (!profile){
        req.session.error = "Profile you requested for doesn't exist";
        return res.redirect("/");
    }
    const feedbacks = await Feedback.find({ //Since we have to get only those feedbacks which are received by that user (Not send by that user)
        receiver : profile._id,
    })
    .populate("giver")
    .sort({ createdAt: -1}) //Sorts the feedbacks by "newest first" (-1 => Sort in Descending order)
    ;
    res.render("./profile/show.ejs" , { profile , feedbacks }); 
}

module.exports.renderEditForm = async(req , res) => {
    let { id } = req.params; //Extract "id" of that particular user
    const profile = await User.findById(id); //Find user data from DB
    if (!profile) {
        req.session.error = "Profile you requested for doesn't exist";
        return res.redirect(`/profile/${id}`); //redirect to that profile which client was viewing
    }
    res.render("./profile/edit.ejs" , { profile });
}

module.exports.updateProfile = async(req , res ) => {
    let { id } = req.params; //Find Id from url

    let updatedData = {...req.body.user};

    if (req.file){
        updatedData.profilePhoto = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await User.findByIdAndUpdate(id , updatedData);
    
    req.session.success = "Listing Updated successfully"; //Display success message post updation
    res.redirect(`/profile/${id}`); 
}