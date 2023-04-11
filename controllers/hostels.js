const Hostel = require('../models/hostel.js');
const { cloudinary } =require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async(req, res) => {
    const hostels = await Hostel.find({});
    res.render('hostels/index.ejs',{hostels});
}

module.exports.searchHostel = async(req, res) => {
    const { location } = req.body;
    const hostels = await Hostel.find({location: { $regex : `(?i)${location}`}});
    res.render('hostels/index.ejs', { hostels });
}

module.exports.renderNewForm = (req, res) => {
    res.render('hostels/new.ejs')
}

module.exports.createHostel = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.hostel.location ,
        limit: 1
    }).send()
    const hostel = new Hostel(req.body.hostel);
    hostel.geometry = geoData.body.features[0].geometry;
    hostel.images = req.files.map(f => ({ url: f.path, filename: f.filename}));
    hostel.author = req.user._id;
    await hostel.save();
    req.flash('success','Successfully created a new hostel');
    res.redirect(`/hostels/${hostel._id}`);
}

module.exports.showHostel = async(req, res) => {
    const {id} = req.params;
    const hostel = await Hostel.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if(!hostel){
        req.flash('error','Cannot find the hostel!');
        return res.redirect('/hostels');
    }
    res.render('hostels/show.ejs',{ hostel });
}

module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params;
    const hostel = await Hostel.findById(id);
    if(!hostel){
        req.flash('error','Cannot find the hostel!');
        return res.redirect('/hostels');
    }
    res.render('hostels/edit.ejs', {hostel});
}

module.exports.updateHostel = async(req, res) => {
    const {id} = req.params;
    const hostel = await Hostel.findByIdAndUpdate(id,{...req.body.hostel});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}));
    hostel.images.push(...imgs);
    await hostel.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await hostel.updateOne({$pull:{ images:{ filename:{ $in: req.body.deleteImages } } } });
    }
    req.flash('success','Successfully updated hostel')
    res.redirect(`/hostels/${hostel._id}`);
}

module.exports.deleteHostel = async(req, res) => {
    const {id} = req.params;
    await Hostel.findByIdAndDelete(id);
    req.flash('success','Successfully deleted hostel');
    res.redirect('/hostels');
}