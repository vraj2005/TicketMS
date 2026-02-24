const Comment = require("../models/TicketComment");
const Ticket = require("../models/Ticket");

exports.addComment = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ msg: "Not found" });
  if (req.user.role === "SUPPORT" && String(ticket.assigned_to) !== req.user.id)
    return res.status(403).json({ msg: "Forbidden" });
  if (req.user.role === "USER" && String(ticket.created_by) !== req.user.id)
    return res.status(403).json({ msg: "Forbidden" });
  const comment = await Comment.create({
    ticket_id: ticket._id,
    user_id: req.user.id,
    comment: req.body.comment,
  });
  res.status(201).json(comment);
};

exports.getComments = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ msg: "Not found" });
  if (req.user.role === "SUPPORT" && String(ticket.assigned_to) !== req.user.id)
    return res.status(403).json({ msg: "Forbidden" });
  if (req.user.role === "USER" && String(ticket.created_by) !== req.user.id)
    return res.status(403).json({ msg: "Forbidden" });
  const comments = await Comment.find({ ticket_id: ticket._id }).populate(
    "user_id",
  );
  res.json(comments);
};

exports.editComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ msg: "Not found" });
  if (req.user.role !== "MANAGER" && String(comment.user_id) !== req.user.id)
    return res.status(403).json({ msg: "Forbidden" });
  comment.comment = req.body.comment;
  await comment.save();
  res.json(comment);
};

exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ msg: "Not found" });
  if (req.user.role !== "MANAGER" && String(comment.user_id) !== req.user.id)
    return res.status(403).json({ msg: "Forbidden" });
  await comment.deleteOne();
  res.status(204).send();
};
