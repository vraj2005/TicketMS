const router = require("express").Router()
const auth = require("../middleware/authMiddleware")
const c = require("../controllers/commentController")

router.post("/tickets/:id/comments",auth,c.addComment)
router.get("/tickets/:id/comments",auth,c.getComments)
router.patch("/comments/:id",auth,c.editComment)
router.delete("/comments/:id",auth,c.deleteComment)

module.exports = router
