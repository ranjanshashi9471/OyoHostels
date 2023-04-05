if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

console.log(process.env.SECRET);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const mongoSanitize = require('express-mongo-sanitize');

// ------------------------------------- CONNECTING TO THE DATABASE ------------------------------------------------
mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1/yelp-camp')
    .then(()=>{
        console.log("Mongodb Connection open");
    })
    .catch((err)=>{
        console.log("OH NO ERRORR");
        console.log(err);
    })

// ------------------------------------- DEFINING THE APP ----------------------------------------------------------- 
const app = express();

// ----------------------------------- SETTING THE VIEWS DIRECTORY --------------------------------------------------
app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize());

const sessionConfig = {
    secret: 'thishsouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes); 
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get("/",(req, res) =>{
    res.render('home.ejs');
})

app.all('*',(req, res, next) => {
    next(new ExpressError("page not found",404));
})

app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.messsge = "Oh No, something went wrong!!!"
    res.status(statusCode).render('error.ejs',{err});
})
 
app.listen(3000, function(){
    console.log("Server is started at the port 3000");
})