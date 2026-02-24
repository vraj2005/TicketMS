const jwt = require("jsonwebtoken")

module.exports = (req,res,next)=>{
  const h = req.headers.authorization
  if(!h) return res.status(401).json({msg:"No token"})
  const token = h.split(" ")[1]
  try{
    const data = jwt.verify(token,process.env.JWT_SECRET)
    req.user = data
    next()
  }catch{
    res.status(401).json({msg:"Invalid token"})
  }
}