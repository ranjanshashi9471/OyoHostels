const mongoose = require('mongoose');

mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1/yelp-camp')
    .then(()=>{
        console.log("Mongodb Connection open");
    })
    .catch((err)=>{
        console.log("OH NO ERRORR");
        console.log(err);
    });

const Campground = require('../models/campground.js');
const Cities = require('./cities.js');
const {places, descriptors} = require('./seedHelper.js');


const sample = (array) => array[Math.floor(Math.random()*(array.length))];
const seedDB = async () => {

    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*30) + 10;
        const camp = new Campground({
            author: '6429bf38828adfa5b5d1d971',
            location:`${Cities[random1000].city}, ${Cities[random1000].state}`,
            title:`${sample(descriptors)}, ${sample(places)}`,
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque explicabo, at esse ipsa possimus lorem Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque explicabo, at esse ipsa possimus",
            geometry: { type: 'Point', coordinates: [Cities[random1000].longitude, Cities[random1000].latitude ] },
            price: price,
            images:[
                {
                    url: 'https://images.pexels.com/photos/4217/hotel-bed-bedroom-room.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                    filename: 'YelpCamp/xzercjxekygjsbvtfcec',        
                  },
                  {
                    url: 'https://images.pexels.com/photos/4217/hotel-bed-bedroom-room.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                    filename: 'YelpCamp/dpcwnpfboigxaivfeem4',    
                  },
                {
                    url: 'https://images.pexels.com/photos/4217/hotel-bed-bedroom-room.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                    filename: 'YelpCamp/dpcwnpfboigxaivfeem4',
                },
                {
                    url: 'https://images.pexels.com/photos/4217/hotel-bed-bedroom-room.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                    filename: 'YelpCamp/dpcwnpfboigxaivfeem4',
                },
                {
                    url: 'https://images.pexels.com/photos/4217/hotel-bed-bedroom-room.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                    filename: 'YelpCamp/dpcwnpfboigxaivfeem4',
                }
            ]
        })
        await camp.save();
    }
};

seedDB().then(()=>{
    mongoose.connection.close();
});