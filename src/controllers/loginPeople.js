const People = require("../models/peopleSchema");
const bcrypt = require("bcryptjs");

async function loginPeople(req,res){
    try{
        const {password , email} = req.body;
        const member = await People.findOne({email});
        if(member){
            const isValid = await bcrypt.compare(password , member.password);
            if(isValid){
                const token = await member.generateToken();
                res.cookie("login_token" , token);

                // Set a temporary cookie with the success message
                res.cookie("message", "You have been logged in successfully!", { 
                    maxAge: 5000, // The cookie will expire in 5 seconds
                    httpOnly: false 
                });

                res.redirect("/"); // Redirect to the homepage
            }else{
                res.status(400).render("login", { 
                    error: "Invalid email or password. Please try again." 
                });
            }
        }else{
            res.status(400).render("login", { 
                error: "Invalid email or password. Please try again." 
            });
        }
    }catch(e){
        res.status(500).send(e);
    }
}

module.exports = loginPeople;