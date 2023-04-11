const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register.ejs');
}

module.exports.register = async(req, res, next) => {
    try{
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash('success','Welcome to OyoHostels');
            res.redirect('/hostels');
        })
    } catch(err) {
        req.flash('error',err.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login = async(req, res) => {
    req.flash('success','Welcome back');
    const redirectUrl = req.session.returnTo || '/hostels';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err)=>{
        if(err) return next(err);
        req.flash('success', 'Goodbye!');
        res.redirect('/hostels'); 
    });
}