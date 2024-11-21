const mongoose=require('mongoose')

const bookSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:1
    },
    author:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true

    },
    stock:{
        type: Number,
        required:true,
        min:0

    }
})

const Book=mongoose.model('Book',bookSchema)
module.exports=Book