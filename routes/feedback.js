const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const Swap = require("../models/swap.js");
const Feedback = require("../models/feedback.js");
const {isLoggedIn , isCompleteSwapParticipant , validateFeedback } = require("../middleware.js");
const feedbackController = require("../controllers/feedbackController.js");


router.get("/new/:swapId" , isLoggedIn , isCompleteSwapParticipant , wrapAsync(feedbackController.renderFeedbackForm));
router.post("/" , isLoggedIn , isCompleteSwapParticipant , validateFeedback , wrapAsync(feedbackController.createFeedback));

module.exports = router;   