async function logoutPage(req, res) {
    try {  
        res.clearCookie("login_token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/"
        });

        // Also clear without secure flag as fallback
        res.clearCookie("login_token", {
            httpOnly: true,
            path: "/"
        });

        // Clear the specific token from the database
        if (req.member && req.token) {
            req.member.tokens = req.member.tokens.filter(tokenObj => 
                tokenObj.token !== req.token
            );
            await req.member.save();
        }

        // Render the login page with a success message
        res.render("login", { success: "You have been logged out successfully!" });
    } catch (e) {
        res.clearCookie("login_token");
        res.status(500).send(e);
    }
}

module.exports = logoutPage;