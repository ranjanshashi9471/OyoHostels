require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGODB)
    .then(()=>{
        console.log("Mongodb Connection open");
    })
    .catch((err)=>{
        console.log("OH NO ERRORR");
        console.log(err);
    });

const Hostel = require('../models/hostel.js');
// const Cities = require('./cities.js');
const { newData } =require('./cities.js');
// const {places, descriptors} = require('./seedHelper.js');


// const sample = (array) => array[Math.floor(Math.random()*(array.length))];

//my code here
    const seedDB = async() => {
        await Hostel.deleteMany({});
        for(let data of newData){
            const camp = new Hostel({
                author: '6432683b32d1f0445515cecf',
                title: `${data.name}`,
                description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque explicabo, at esse ipsa possimus lorem Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque explicabo, at esse ipsa possimus",
                price: 20,
                location: `${data.location}`,
                geometry: { type: 'Point', coordinates: [data.longitude,data.latitude]},
                Images:[
                    {
                        url: 'https://images.pexels.com/photos/4217/hotel-bed-bedroom-room.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                        filename: 'YelpCamp/xzercjxekygjsbvtfcec',
                    }
                ]

            })
            await camp.save();
        }
    } 
// 

// const seedDB = async () => {

//     await Hostel.deleteMany({});
//     for(let i=0;i<300;i++){
//         const random1000 = Math.floor(Math.random()*1000);
//         const price = Math.floor(Math.random()*30) + 10;
//         const camp = new Hostel({
//             author: '6429bf38828adfa5b5d1d971',
//             location:`${Cities[random1000].city}, ${Cities[random1000].state}`,
//             title:`${sample(descriptors)}, ${sample(places)}`,
//             description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque explicabo, at esse ipsa possimus lorem Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque explicabo, at esse ipsa possimus",
//             geometry: { type: 'Point', coordinates: [Cities[random1000].longitude, Cities[random1000].latitude ] },
//             price: price,
//             images:[
//                 {
//                     url: 'https://images.pexels.com/photos/4217/hotel-bed-bedroom-room.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//                     filename: 'YelpCamp/xzercjxekygjsbvtfcec',        
//                   },
//                   {
//                     url: 'https://images.pexels.com/photos/4217/hotel-bed-bedroom-room.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//                     filename: 'YelpCamp/dpcwnpfboigxaivfeem4',    
//                   },
//                 {
//                     url: 'https://images.pexels.com/photos/4217/hotel-bed-bedroom-room.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//                     filename: 'YelpCamp/dpcwnpfboigxaivfeem4',
//                 },
//                 {
//                     url: 'https://images.pexels.com/photos/4217/hotel-bed-bedroom-room.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//                     filename: 'YelpCamp/dpcwnpfboigxaivfeem4',
//                 },
//                 {
//                     url: 'https://images.pexels.com/photos/4217/hotel-bed-bedroom-room.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//                     filename: 'YelpCamp/dpcwnpfboigxaivfeem4',
//                 }
//             ]
//         })
//         await camp.save();
//     }
// };

seedDB().then(()=>{
    mongoose.connection.close();
});