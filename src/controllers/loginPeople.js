const People = require("../models/peopleSchema");
const bcrypt = require("bcryptjs");
async function loginPeople(req,res){
    try{
        const {password , email} = req.body;
        const member = await People.findOne({email});
        if(member){
            // console.log(member.password);
            let isValid = await bcrypt.compare(password , member.password);
            if(isValid){
                const token = await member.generateToken();
                res.cookie("login_token" , token);
                res.status(200).render("index");
            }else{
                res.status(404).send("<h1>Invalid details received or you have yet not registered in my databse .....</h1>")
            }
            
        }else{
            res.status(404).send("<h1>Invalid details received or you have yet not registered in my databse .....</h1>")
        }
    }catch(e){
        res.status(404).send(e);
    }
}

module.exports = loginPeople;