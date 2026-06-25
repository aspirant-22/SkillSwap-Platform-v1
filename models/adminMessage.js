const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminMessageSchema = new Schema ({
    title : {
        type : String,
        required : true,
        trim :true,
    }, 
    message : {
        type : String,
        required : true,
        trim : true,
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    }
},
{timestamps : true}
)

module.exports = mongoose.model("AdminMessage" , adminMessageSchema); //AdminMessage has capital 'A' because Mongoose convention is pascal case model names