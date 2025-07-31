const express = require("express")
const productModel = require("../models/product.model")

const router = express.Router()



router.get("/", async(req, res)=>{
   const products = await productModel.find()

    res.status(200).json({message : "data found" , products})
})



module.exports = router