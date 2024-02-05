const express = require("express");
const People = require("../models/peopleSchema");
const postPeople = require("../controllers/postPeople");
const loginPeople = require("../controllers/loginPeople");
const logoutPage = require("../controllers/logoutPage");
const auth = require("../middleware/auth");
const router = new express.Router();


// to fetch all the pages 
router.get("/" , (req,res)=>{
    
    res.render("index");
})
router.get("/about" , auth , (req,res)=>{
    // console.log(req.member);
    res.render("about" , {
        name : req.member.name,
        phone : req.member.phone,
        email : req.member.email,
        password : req.member.password
    });
})
router.get("/register" , (req,res)=>{
    res.render("register");
})
router.get("/login" , (req,res)=>{
    res.render("login");
})


// to post the user in database
router.post("/register" , postPeople);

// to authenticate the User with its database

router.post("/login" , loginPeople);

// to throw user out of the website 
router.get("/logout" , auth , logoutPage);

module.exports = router;