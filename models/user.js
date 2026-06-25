const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    // profilePhoto : {
    //     type : String,
    //     // Not "./public/images/profile_photo.avif" 
    //     //Because, This -> app.use(express.static(path.join(__dirname , "public"))); tells that Everything inside public/ is publicly accessible.
    //     default : "/images/profile_photo.avif" 
    // },
    profilePhoto : {
        url : String,
        filename : String,
    },
    location : {
        type : String
    },
    skillsOffered : {
        type : [String],
        default : [],
    },
    skillsWanted : {
        type : [String],
        default : [],
    },
    availability : [ //We are making array + enum [{}] so that user can have multiple choice
        {
            type : String,
            enum : [
                "weekdays",
                "weekends",
            ],
            required : true,
        } 
        
    ],
    isPublic : {
        type : Boolean,
        required : true,
    },
    role : {
        type : String,
        enum : ["user" , "admin"],
        default : "user"
    },
    isBanned : {
        type : Boolean,
        default : false,
    },
    avgRating : {
        type : Number,
        min : 0,
        max : 5,
        default : 0,
    },
},
{ timestamps : true},
);

userSchema.plugin(passportLocalMongoose, {  //This automatically creates "password" for each user and uses "email" + "password" for authentication
    usernameField: "email"
});

module.exports = mongoose.model("User" , userSchema); //Here we are exporting "User" Model