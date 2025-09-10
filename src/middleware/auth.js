const jwt = require("jsonwebtoken");
const People = require("../models/peopleSchema");

async function auth(req, res, next) {
    try {
        const token = req.cookies.login_token;
        if (!token) {
            return res.status(401).render("login"); // no token present
        }

        const verify = await jwt.verify(token, process.env.SECRET_KEY);
        const member = await People.findById(verify._id);

        if (!member) {
            res.clearCookie("login_token");
            return res.status(401).render("login"); // user not found
        }

        // Check if the token exists in the user's tokens array
        const tokenExists = member.tokens.some(tokenObj => tokenObj.token === token);
        
        if (!tokenExists) {
            res.clearCookie("login_token");
            return res.status(401).render("login");
        }

        req.member = member;
        req.token = token;
        next();
    } catch (e) {
        res.clearCookie("login_token");
        res.status(401).render("login"); // invalid/expired token
    }
}

module.exports = auth;