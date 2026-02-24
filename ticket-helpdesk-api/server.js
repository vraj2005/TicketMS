require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("DB Connected"))
 .catch((err)=>{
	console.error("DB connection failed:", err.message)
	process.exit(1)
 })

app.use("/auth", require("./src/routes/authRoutes"))
app.use("/users", require("./src/routes/userRoutes"))
app.use("/tickets", require("./src/routes/ticketRoutes"))
app.use("/", require("./src/routes/commentRoutes"))

app.listen(process.env.PORT || 3000, ()=>{
	console.log(`Server running on port ${process.env.PORT || 3000}`)
})