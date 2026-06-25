const Joi = require("joi");
const User = require("./models/user.js");
const Swap = require("./models/swap.js");
const Feedback = require("./models/feedback.js");
const adminMessage = require("./models/adminMessage.js");

const userSchema = Joi.object({
    user : Joi.object({
        username : Joi.string().required(),
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net'] },
        }),
        availability: Joi.string()
            .valid("weekdays", "weekends")
            .required(),
        location: Joi.string().allow(""),
        skillsOffered: Joi.array().items(Joi.string()),
        skillsWanted: Joi.array().items(Joi.string()),
        isPublic: Joi.boolean().required(),
    }).required(),
})
//Note : String gets converted to ObjectId by mongoose
//status -> Not included in validation because a malicious user may send status : "Accepted", DB automatically stores "pending"
const swapSchema = Joi.object({
    swap : Joi.object({
        receiver : Joi.string().required(),
        offeredSkill : Joi.string().required(),
        requestedSkill : Joi.string().required(),
        message : Joi.string().allow(""),
        
    }).required() 
})

const feedbackSchema = Joi.object({
    feedback : Joi.object({
        swapId : Joi.string().required(),
        receiver : Joi.string().required(), 
        rating : Joi.number().integer().min(1).max(5).required(),
        message : Joi.string().required(),
    }).required()
})

const adminMessageSchema = Joi.object({
    adminMessage : Joi.object({
        title : Joi.string().required(),
        message : Joi.string().required(),
    }).required()
})

module.exports = { userSchema , swapSchema , feedbackSchema , adminMessageSchema}; 