// (Express + Express Router + models + middlewares + controllers + router.get(routes--define) + export router)
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const Swap = require("../models/swap.js");
const Feedback = require("../models/feedback.js");
const AdminMessage = require("../models/adminMessage.js");
const {isLoggedIn , isAdmin , validateAdminMessage} = require("../middleware.js");
const adminController = require("../controllers/adminController.js");

router.get("/" , isLoggedIn , isAdmin , wrapAsync(adminController.showAdminDashboard));
router.get("/users" , isLoggedIn , isAdmin , wrapAsync(adminController.showUsers)); //To show all users
router.patch("/users/:id/ban" , isLoggedIn , isAdmin , wrapAsync(adminController.banUser));
router.patch("/users/:id/unban" , isLoggedIn , isAdmin , wrapAsync(adminController.unbanUser));
router.get("/swaps" , isLoggedIn , isAdmin , wrapAsync(adminController.showSwaps)); //To show all swaps
router.get("/messages" , isLoggedIn , isAdmin, wrapAsync(adminController.showMsgs)); //To show all messages
router.post("/messages" , isLoggedIn , isAdmin , validateAdminMessage , wrapAsync(adminController.createAdminMsg));
router.delete("/:id/messages" , isLoggedIn , isAdmin , wrapAsync(adminController.deleteAdminMsg));
router.get("/reports/users" , isLoggedIn , isAdmin , wrapAsync(adminController.downloadUsersReport));
router.get("/reports/swaps" , isLoggedIn , isAdmin , wrapAsync(adminController.downloadSwapsReport));
router.get("/reports/feedbacks" , isLoggedIn , isAdmin , wrapAsync(adminController.downloadFeedbacksReport));

module.exports = router;  