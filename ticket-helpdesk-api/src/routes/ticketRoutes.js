const router = require("express").Router()
const auth = require("../middleware/authMiddleware")
const role = require("../middleware/roleMiddleware")
const c = require("../controllers/ticketController")

router.post("/",auth,role("USER","MANAGER"),c.createTicket)
router.get("/",auth,c.getTickets)
router.patch("/:id/assign",auth,role("MANAGER","SUPPORT"),c.assignTicket)
router.patch("/:id/status",auth,role("MANAGER","SUPPORT"),c.updateStatus)
router.delete("/:id",auth,role("MANAGER"),c.deleteTicket)

module.exports = router
