const { hostelSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Hostel = require('./models/hostel');
const { reviewSchema} = require('./schemas.js');
const Review = require('./models/review.js');

module.exports.isLoggedIn = function(req, res, next){
    req.session.returnTo = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');  
    }
    next();
}

module.exports.validateHostel = (req, res, next) => {
    const {error} = hostelSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const hostel = await Hostel.findById(id);
    if(!hostel.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/hostels/${id}`);
    };
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/hostels/${id}`);
    };
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}