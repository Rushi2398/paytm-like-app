const { jwtSecret } = require("../config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next)=>{
    const headers = req.headers.authorization;
    if( !headers || !headers.startsWith("Bearer ")){
        return res.status(403).json({});
    }

    const token = headers.split(" ")[1];

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(err){
        return res.status(403).json({});
    }
}

module.exports = {
    authMiddleware
};