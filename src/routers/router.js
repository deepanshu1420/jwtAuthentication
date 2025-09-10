const express = require("express");
const jwt = require("jsonwebtoken");
const People = require("../models/peopleSchema");
const postPeople = require("../controllers/postPeople");
const loginPeople = require("../controllers/loginPeople");
const logoutPage = require("../controllers/logoutPage");
const auth = require("../middleware/auth");
const router = new express.Router();

const checkAuthStatus = async (req, res, next) => {
    try {
        const token = req.cookies.login_token;
        if (token) {
            const verify = jwt.verify(token, process.env.SECRET_KEY);
            const member = await People.findById(verify._id);
            
            if (member && member.tokens.some(tokenObj => tokenObj.token === token)) {
                res.locals.isLoggedIn = true;
            } else {
                res.locals.isLoggedIn = false;
            }
        } else {
            res.locals.isLoggedIn = false;
        }
    } catch (e) {
        res.locals.isLoggedIn = false;
    }
    next();
};

router.use(checkAuthStatus);

// Homepage Route - Handles login success message
router.get("/", (req, res) => {
    try {
        const successMessage = req.cookies.message || null;
        if (successMessage) {
            res.clearCookie("message");
        }
        res.render("index", { success: successMessage });
    } catch (error) {
        console.log("Template render error:", error);
        res.status(500).send("Error rendering homepage");
    }
});

router.get("/about", auth, (req, res) => {
    res.render("about", {
        name: req.member.name,
        phone: req.member.phone,
        email: req.member.email,
        password: req.member.password // ✨ This line is added
    });
});

router.get("/register", (req, res) => {
    res.render("register");
});

// UPDATED LOGIN ROUTE - Handles messages from registration and logout
router.get("/login", (req, res) => {
    // Check for the message cookie (from registration)
    const successMessage = req.cookies.message || null;
    
    // Clear the cookie so it's only shown once
    if (successMessage) {
        res.clearCookie("message");
    }
    
    // Render the login page, passing the message if it exists
    res.render("login", { success: successMessage });
});

router.post("/register", postPeople);
router.post("/login", loginPeople);
router.get("/logout", auth, logoutPage);

module.exports = router;