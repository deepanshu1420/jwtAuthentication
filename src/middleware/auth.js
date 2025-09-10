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
            return res.status(401).render("login"); // user not found
        }

        req.member = member;
        req.token = verify._id;
        next();
    } catch (e) {
        res.status(401).render("login"); // invalid/expired token
    }
}

module.exports = auth;
