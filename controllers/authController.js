const { signupSchema } = require("../middleware/signupSchema") 
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')
require('dotenv').config()
const i18n = require('../i18n/i18n')

const hash = async (password) => {
    return await bcrypt.hash(password, 10)
}


exports.signUp = async(req,res) => {
    const formData = req.body

    const validationResult = signupSchema.validate(formData)

    if(validationResult.error){
        return res.status(400).json({msg:validationResult.error.details[0].message})
    }

    const user = await User.findOne({where:{username: formData.username}})
    if(user){
        return res.status(409).json({msg: i18n.__('signup409')})
    }
    
    try{
        const newUser = await User.create({
            fullName: formData.fullName,
            username: formData.username, 
            password: await hash(formData.password)
        });
      
        return res.status(201).json({msg: i18n.__('signup201'), data:{
            id: newUser.id,
            fullName: newUser.fullName,
            username: newUser.username
        }})
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: i18n.__('error') });
    }
}


exports.login = async(req,res) => {
    const formData = req.body
    try{
        const user = await User.findOne({where:{username: formData.username}})
        if(user){
            const passwordMatch = await bcrypt.compare(formData.password, user.password);
            if(passwordMatch){
                const token = await jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({msg: i18n.__('login200'), token: token})
            }else{
                return res.status(401).json({msg: i18n.__('login401')})
            }
        }else{
            return res.status(404).json({msg: i18n.__('login404')})
        }
    }catch(err){
        console.log(err.message)
        return res.status(500).json({ msg: i18n.__('error') });
    } 
}