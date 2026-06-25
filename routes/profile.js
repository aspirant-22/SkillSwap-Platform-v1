const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const {isLoggedIn ,  validateProfile , isOwner} = require("../middleware.js");
const profileController = require("../controllers/profileController.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });  

router.get("/" , isLoggedIn , wrapAsync(profileController.showCurrUserProfile));
router.get("/:id" , isLoggedIn, wrapAsync(profileController.renderProfile)); //Show Profile of a particular user (all loggedIn users can see)
router.get("/:id/edit" , isLoggedIn , isOwner , wrapAsync(profileController.renderEditForm)); //Render Edit form
router.patch("/:id" , isLoggedIn ,isOwner, validateProfile, upload.single("user[profilePhoto]"), wrapAsync(profileController.updateProfile));//Edit a particular user profile

module.exports = router;   
