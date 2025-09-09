const People = require("../models/peopleSchema");

async function postPeople(req, res) {
    try {
        const { name, email, phone, password, cpassword } = req.body;
        const formData = req.body; // Store user input to pass back on error

        // --- VALIDATION ORDER UPDATED ---

        // 1. Check for specific field errors first
        if (email && (!email.includes('@') || !email.includes('.'))) {
            return res.status(400).render("register", {
                error: "Please enter a valid email address (must include '@' and '.com')",
                formData: formData
            });
        }
        
        if (phone && phone.length !== 10) {
            return res.status(400).render("register", {
                error: "Phone number must be exactly 10 digits.",
                formData: formData
            });
        }

        // 👇 NEW: Strong password validation check 👇
        if (password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).render("register", {
                    error: "Password must be 8+ chars with uppercase, lowercase, number & symbol.",
                    formData: formData
                });
            }
        }
        
        if (password && cpassword && password !== cpassword) {
            return res.status(400).render("register", {
                error: "Passwords did not match. Please try again!",
                formData: formData
            });
        }

        // 2. Then, check if any field was left blank
        if (!name || !email || !phone || !password || !cpassword) {
            return res.status(400).render("register", {
                error: "You have not filled the form completely or any blank is empty!",
                formData: formData
            });
        }

        // If all checks pass, proceed to save the user
        const member = new People(req.body);
        await member.save();
        
        res.cookie("message", "Thanks! You have been successfully registered.", { 
            maxAge: 5000,
            httpOnly: false 
        });

        res.status(201).redirect("/login");
        
    } catch (e) {
        if (e.code === 11000) {
            return res.status(409).render("register", {
                error: "An account with this email or phone number already exists.",
                formData: req.body
            });
        }
        
        res.status(500).render("register", {
             error: "An unexpected error occurred. Please try again!",
             formData: req.body
        });
    }
}

module.exports = postPeople;