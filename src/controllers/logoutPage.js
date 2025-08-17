async function logoutPage(req,res){
    try{  
        res.clearCookie("login_token");
        req.member.tokens = [];
        await req.member.save();
        // Render the login page with a success message
        res.render("login", { success: "You have been logged out successfully!" });
    }catch(e){
        res.status(500).send(e);
    }
}
module.exports = logoutPage;