const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const swapSchema = new Schema ({
    sender : {
        type : Schema.Types.ObjectId, //Here user objectID is a sender type
        ref : "User", //Here, sender will be a user therefore it will reference "user" collection
        required : true,
    },
    receiver : { 
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    offeredSkill : {
        type : String,
        required : true,
    },
    requestedSkill : {
        type : String,
        required : true,
    },
    message : {
        type : String,
    },
    status : {
        type : String,
        enum : [
            "pending",
            "accepted",
            "rejected",
            "completed",
            "cancelled"
        ],
        default : "pending",
    },
    senderCompleted: {
        type: Boolean,
        default: false
    },

    receiverCompleted: {
        type: Boolean,
        default: false
    },
    
},
{ timestamps : true},
)

module.exports = mongoose.model("Swap" , swapSchema);