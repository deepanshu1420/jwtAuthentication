async function logoutPage(req,res){
    try{  
        res.clearCookie("login_token");
        req.member.tokens = [];
        await req.member.save();
        res.render("login");
    }catch(e){
        res.status(500).send(e);
    }
}
module.exports = logoutPage;