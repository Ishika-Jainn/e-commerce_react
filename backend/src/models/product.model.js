const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({
    title : {
        type : String
    },
    description : {
        type : String
    },
    category : {
        type : String
    },
    price : {
        type : String
    },
    image : {
        type : String
    }
})

const productModel = mongoose.model("product",productSchema)

module.exports = productModel