const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const  Review  = require('./review.js');

const ImageSchema = new Schema({
    url: String,
    filename: String
})

// https://res.cloudinary.com/dvcaz05sg/image/upload/v1678886260/YelpCamp/pttzxila9llxopgzsy1o.jpg

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_100')
})

const opts = { toJSON: {virtuals: true}}

const HostelSchema = new Schema({
    title: String,
    images:[ImageSchema],
    geometry:{
        type:{
            type: String,
            enum:['Point'],
            required: true
        },
        coordinates:[
            {
                type: Number,
                required: true
            }
        ]
    },
    price: Number,
    description: String,
    location: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

HostelSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/hostels/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0,20)}.....</p>`
})


// when delete route of hostel was hit the doc is sent to theis post function as -> doc
HostelSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        const review = await Review.deleteMany({_id:{$in:doc.reviews}})
    }
})

const Hostel = mongoose.model('Hostel', HostelSchema);
module.exports = Hostel;
