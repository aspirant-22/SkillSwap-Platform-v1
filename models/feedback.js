const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema ({
    swapId : { //swapId for which feedback is given
        type : Schema.Types.ObjectId,
        ref : "Swap",
        required : true,
    },
    giver : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    receiver : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    rating : {
        type : Number,
        min : 1,
        max : 5,
        required : true,
    },
    message : {
        type : String,
        required : true,
        trim : true,  //It prevents too much leading and trailing spaces eg. "          Great teacher        "
    },
},
{timestamps : true},
);

module.exports = mongoose.model("Feedback" , feedbackSchema);