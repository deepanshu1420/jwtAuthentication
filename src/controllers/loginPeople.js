const People = require("../models/peopleSchema");
const bcrypt = require("bcryptjs");

async function loginPeople(req, res) {
    try {
        const { email, password } = req.body;

        // --- VALIDATION LOGIC AS REQUESTED ---

        // 1. Check if both fields are empty first
        if (!email && !password) {
            return res.status(400).render("login", {
                error: "All fields are required."
            });
        }

        // 2. Then, check the email field specifically
        if (!email) {
            return res.status(400).render("login", {
                error: "Email field is required."
            });
        }
        
        // 3. If email is present, validate its format
        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).render("login", {
                error: "Please enter a valid email address (must include '@' and '.com')",
                email: email
            });
        }

        // 4. Finally, check the password field
        if (!password) {
            return res.status(400).render("login", {
                error: "Password field is required.",
                email: email
            });
        }

        // If all checks pass, proceed with login
        const member = await People.findOne({ email });
        if (member) {
            const isValid = await bcrypt.compare(password, member.password);
            if (isValid) {
                const token = await member.generateToken();

                res.cookie("login_token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge: 24 * 60 * 60 * 1000
                });

                res.cookie("message", "You have been logged in successfully!", {
                    maxAge: 5000,
                    httpOnly: false
                });

                res.redirect("/");
            } else {
                res.status(400).render("login", {
                    error: "Invalid email or password. Please try again!",
                    email: email
                });
            }
        } else {
            res.status(400).render("login", {
                error: "Invalid email or password. Please try again!",
                email: email
            });
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = loginPeople;