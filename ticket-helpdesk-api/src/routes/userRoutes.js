const router = require("express").Router()
const auth = require("../middleware/authMiddleware")
const role = require("../middleware/roleMiddleware")
const {createUser,getUsers} = require("../controllers/userController")

router.post("/",auth,role("MANAGER"),createUser)
router.get("/",auth,role("MANAGER"),getUsers)

module.exports = router
