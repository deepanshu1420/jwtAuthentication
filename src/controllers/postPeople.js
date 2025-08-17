const People = require("../models/peopleSchema");
async function postPeople(req,res){
    try{
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if(password === cpassword && password !== ""){
            const member = new People(req.body);
            await member.save();
            
            // Set a temporary cookie with the registration success message
            res.cookie("message", "Thanks! You have been successfully registered.", { 
                maxAge: 5000, // Cookie will expire in 5 seconds
                httpOnly: false 
            });

            res.status(201).redirect("/login"); // Redirect to the login page
        }else{
            res.status(400).send("<h1>Passwords did not match or were empty.</h1>")
        }
        
    }catch(e){
        // This provides a more user-friendly error for duplicate emails/phones
        if (e.code === 11000) {
            return res.status(409).send("<h1>An account with this email or phone number already exists.</h1>");
        }
        res.status(500).send(e);
    }
}

module.exports = postPeople;