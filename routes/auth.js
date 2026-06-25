const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const authController = require("../controllers/authController.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); 


//--------------Signup--------------------------------------
router.get("/signup" , authController.renderSignupForm);
router.post("/signup" , upload.single("user[profilePhoto]"), wrapAsync(authController.signup));
// router.post(
//     "/signup",
//     upload.single("user[profilePhoto]"),
//     (req, res) => {
//         res.send(req.file);
//     }
// );
// router.post("/signup", (req, res) => {
//     upload.single("user[profilePhoto]")(req, res, (err) => {
//         if (err) {
//             console.error(err);
//             return res.send(err);
//         }

//         res.send(req.file);
//     });
// });
// router.post("/signup", (req, res) => {
//     upload.single("user[profilePhoto]")(req, res, (err) => {

//         console.log("FILE:", req.file);

//         if (err) {
//             console.log("FULL ERROR:");
//             console.dir(err, { depth: null });

//             return res.status(500).json(err);
//         }

//         res.json(req.file);
//     });
// });

//-------------Login----------------------------------------------
router.get("/login" , authController.renderLoginForm);
router.post('/login', authController.login);

//---------------Logout----------------------------------------
router.get("/logout" , authController.logout);

module.exports = router;