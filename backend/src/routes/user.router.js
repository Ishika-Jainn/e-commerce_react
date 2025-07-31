const express = require("express")
const bcrypt = require("bcrypt")
const userModel = require("../models/user.model")

const router = express.Router()

router.post("/register",async (req, res)=>{

    const {username , email , password, role} = req.body

    try {
      
        if(!username){
            return res.status(400).json({message : "username is required"})
        }
        if(!email){
            return res.status(400).json({message : "email is required"})
        }
        if(!password){
            return res.status(400).json({message : "password is required"})
        }
       

        const hashedPass = await bcrypt.hash(password ,10)

        const user = new userModel({
            username : username,
            email : email ,
            password : hashedPass,
            role: role || 'user'
        })


        await user.save()
        
        res.send("register successfully....")

    } catch (error) {
        console.log(error);
        res.status(500).json({message : "internal server error", error : error.message})
    }

})


router.post("/login", async (req, res)=>{
    const {email , password} = req.body

    try {


        if(!email){
            return res.status(400).json({message : "email is required"})
        }
        if(!password){
            return res.status(400).json({message : "password is required"})
        }

        const user = await userModel.findOne({email : email})

        if(!user){
            return res.status(400).json({message : "user not exists"})
        }

        const isTrue = await bcrypt.compare(password ,user.password )


        if(!isTrue){
            return res.status(400).json({message : "email or password desnot match"})
        }

        res.status(200).json({message : "login successfully...", role: user.role, username: user.username, email: user.email})

    } catch (error) {
        console.log(error); 
        res.status(500).json({message : "internal server error", error : error.message})
    
    }
})


module.exports = router