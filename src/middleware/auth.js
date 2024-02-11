const jwt = require("jsonwebtoken");
const People = require("../models/peopleSchema");
async function auth(req,res , next){
    try{
        const token = req.cookies.login_token;
        const verify = await jwt.verify(token , process.env.SECRET_KEY);
        const member = await People.findById(verify._id);
        req.member = member;
        req.token = verify._id;
        next();
    }catch(e){
        res.status(402).render("login");
    }
}
module.exports = auth;