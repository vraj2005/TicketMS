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

app.use("/auth", require("./routes/auth"))
app.use("/users", require("./routes/users"))
app.use("/tickets", require("./routes/tickets"))
app.use("/", require("./routes/comments"))

app.listen(process.env.PORT)