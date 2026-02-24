const Ticket = require("../models/Ticket");
const User = require("../models/User");
const StatusLog = require("../models/TicketStatusLog");

exports.createTicket = async (req, res) => {
  const { title, description, priority } = req.body;
  const ticket = await Ticket.create({
    title,
    description,
    priority,
    created_by: req.user.id,
  });
  res.status(201).json(ticket);
};

exports.getTickets = async (req, res) => {
  let tickets;
  if (req.user.role === "MANAGER")
    tickets = await Ticket.find().populate("created_by assigned_to");
  else if (req.user.role === "SUPPORT")
    tickets = await Ticket.find({ assigned_to: req.user.id }).populate(
      "created_by assigned_to",
    );
  else
    tickets = await Ticket.find({ created_by: req.user.id }).populate(
      "created_by assigned_to",
    );
  res.json(tickets);
};

exports.assignTicket = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user || user.role === "USER")
    return res.status(400).json({ msg: "Invalid assignment" });
  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { assigned_to: userId },
    { new: true },
  );
  if (!ticket) return res.status(404).json({ msg: "Not found" });
  res.json(ticket);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ msg: "Not found" });
  const flow = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
  const current = flow.indexOf(ticket.status);
  const next = flow.indexOf(status);
  if (next !== current + 1)
    return res.status(400).json({ msg: "Invalid transition" });
  await StatusLog.create({
    ticket_id: ticket._id,
    old_status: ticket.status,
    new_status: status,
    changed_by: req.user.id,
  });
  ticket.status = status;
  await ticket.save();
  res.json(ticket);
};

exports.deleteTicket = async (req, res) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);
  if (!ticket) return res.status(404).json({ msg: "Not found" });
  res.status(204).send();
};
