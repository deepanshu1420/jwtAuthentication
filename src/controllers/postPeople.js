const People = require("../models/peopleSchema");
async function postPeople(req,res){
    try{
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if(password === cpassword && password !== null){
            const member = new People(req.body);
            const savedMember = await member.save();
            // const token = await savedMember.generateToken();
            // res.cookie("register_token" , token , {
            //     expires : new Date(Date.now() + 6000000)
            // })
            res.status(201).render("login");
        }else{
            res.status(404).send("<h1>Password Did not Match ....</h1>")
        }
        
    }catch(e){
        res.status(404).send(e);
    }
}

module.exports = postPeople;