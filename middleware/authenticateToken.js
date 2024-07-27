const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticateToken = async(req,res,next) => {
    const header = req.headers['authorization']
    if(!header){
        return res.status(401).json({msg:'Unauthorized'})
    } 

    const token = header.split(' ')[1]

    try{
        const decodedInfo = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedInfo
        next()
    }catch(err){
        return res.status(403).json({msg:'Forbidden'})
    }
}

module.exports = authenticateToken