var isLoggedIn = (req,res,next) =>{
    if(req.isAuthenticated())
	    return next();
	else
		req.session.redirectTo = req.originalUrl;	
		console.log("HEREE IS PATH:"+req.session.redirectTo);
		res.redirect('/user/login')
	}
module.exports = isLoggedIn;