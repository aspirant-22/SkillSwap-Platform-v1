//Require models + export features defined in routes
const User = require("../models/user.js");
const Swap = require("../models/swap.js");
const Feedback = require("../models/feedback.js");
const AdminMessage = require("../models/adminMessage.js");
const { Parser } = require("json2csv"); //For downloading csv reports

module.exports.showAdminDashboard = async(req , res , next) => {
    const totalUsers = await User.countDocuments();
    const totalSwaps = await Swap.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments();
    const bannedUsers = await User.countDocuments({
        isBanned : true
    });

    const view = req.query.view;

    let swaps = [];
    let users = [];
    let messages = [];

     // Dashboard
    if (!view) {
        swaps = await Swap.find()
            .populate("sender")
            .populate("receiver");

        users = await User.find();

        messages = await AdminMessage.find()
        .populate("createdBy");
    }

    if (view === "swaps"){
        swaps = await Swap.find()
            .populate("sender")
            .populate("receiver")
        ;
    }

    if (view === "users"){
        users = await User.find();
    }

    if (view === "messages"){
        messages = await AdminMessage.find()
            .populate("createdBy")
        ;
    }

    res.render("./admin/show.ejs" , {totalUsers , totalSwaps , totalFeedbacks , bannedUsers , view , swaps , users , messages});
} 

module.exports.showUsers = async(req , res , next) => {
    const users = await User.find();
    res.render("./admin/showUsers.ejs" , {users});
}

module.exports.banUser = async(req , res , next) => {
    let { id } = req.params;
    let updatedUser = await User.findByIdAndUpdate(id , {
        isBanned : true
    });
    req.session.error = "You banned a user.";
    res.redirect("/admin");
}

module.exports.unbanUser = async(req , res , next) => {
    let { id } = req.params;
    let updatedUser = await User.findByIdAndUpdate(id , {
        isBanned : false
    })
    req.session.success = "You unbanned a user";
    res.redirect("/admin");
}

module.exports.showSwaps = async(req , res , next) => {
    const swaps = await Swap.find()
    .populate("sender")
    .populate("receiver");
    res.render("./admin/showSwaps.ejs" , {swaps});
}

module.exports.showMsgs = async(req , res , next) => {
    const messages = await AdminMessage.find()
    .populate("createdBy")
    ;
    res.render("./admin/showMsgs.ejs" , {messages});
}

module.exports.createAdminMsg = async(req , res , next) => {
    let {title , message } = req.body.adminMessage;
    let newPlatformMsg = new AdminMessage({
        title,
        message,
        createdBy : req.user._id,
    })
    await newPlatformMsg.save();
    req.session.success = "New Platform Message created successfully.!!";
    res.redirect("/admin");
}

module.exports.deleteAdminMsg = async(req , res , next) => {
    let {id} = req.params;
    let deleteMsg = await AdminMessage.findByIdAndDelete(id);
    req.session.error = "You deleted a platform message";
    res.redirect("/admin");
}

module.exports.downloadUsersReport = async(req , res , next) => {
    const users = await User.find().lean(); //returns plain JavaScript objects. CSV libraries work better with plain objects.
    const report = users.map(user => ({
        Username : user.username,
        Email : user.email,
        Role : user.role,
        Banned : user.isBanned,
        SkillsOffered : user.skillsOffered.join(", "),
        SkillsWanted : user.skillsWanted.join(", "),
        Availability : user.availability.join(", "),
        PublicProfile : user.isPublic,
        AverageRating : user.avgRating,
        Location : user.location || "N/A",
        JoinedAt : user.createdAt.toLocaleDateString(),
    }));
    const parser = new Parser();
    const csv = parser.parse(report);

    res.header("Content-Type","text/csv");
    res.attachment(`users-report-${Date.now()}.csv`);

    res.send(csv);
}
module.exports.downloadSwapsReport = async(req,res)=>{

    const swaps = await Swap.find()
        .populate("sender" , "username")
        .populate("receiver" , "username")
        .lean();

    const report = swaps.map(swap => ({
        Sender: swap.sender.username,
        Receiver: swap.receiver.username,
        OfferedSkill: swap.offeredSkill,
        RequestedSkill: swap.requestedSkill,
        Status: swap.status,
        Message : swap.message,
        SenderCompleted : swap.senderCompleted,
        ReceiverCompleted :  swap.receiverCompleted,
        CreatedAt : swap.createdAt.toLocaleDateString(),
    }));

    const parser = new Parser();
    const csv = parser.parse(report);

    res.header("Content-Type","text/csv");
    res.attachment(`swaps-report-${Date.now()}.csv`);

    res.send(csv);
}

module.exports.downloadFeedbacksReport = async(req,res)=>{

    const feedbacks = await Feedback.find()
        .populate("giver" , "username")
        .populate("receiver" , "username")
        .lean();

    const report = feedbacks.map(feedback => ({
        Giver: feedback.giver.username,
        Receiver: feedback.receiver.username,
        Rating: feedback.rating,
        Message: feedback.message,
        CreatedAt : feedback.createdAt.toLocaleDateString(),
    }));

    const parser = new Parser();
    const csv = parser.parse(report);

    res.header("Content-Type","text/csv");
    res.attachment(`feedbacks-report-${Date.now()}.csv`);

    res.send(csv);
}
