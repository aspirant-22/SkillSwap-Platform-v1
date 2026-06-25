const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const Swap = require("../models/swap.js");
const {isLoggedIn , validateSwap , isSwapReceiver , isSwapParticipant , isSwapSender} = require("../middleware.js");
const swapController = require("../controllers/swapController.js");

router.get("/" , isLoggedIn , wrapAsync(swapController.showAllSwaps)); //To show all swap requests 
router.post("/" , isLoggedIn , validateSwap , wrapAsync(swapController.createSwap)); //Create a new swap request 
router.patch("/:id/accept" , isLoggedIn , isSwapReceiver , wrapAsync(swapController.acceptSwap)); //Accept Swap request
router.patch("/:id/reject" , isLoggedIn , isSwapReceiver , wrapAsync(swapController.rejectSwap)); //Reject Swap request
router.patch("/:id/complete" , isLoggedIn , isSwapParticipant , wrapAsync(swapController.completeSwap)); //Complete a Swap 
router.delete("/:id" , isLoggedIn , isSwapSender , wrapAsync(swapController.deleteSwap)); //Delete a swap request

module.exports = router;   