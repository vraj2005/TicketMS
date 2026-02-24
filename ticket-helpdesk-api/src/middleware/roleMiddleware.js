module.exports = (...r) => {
  return (req, res, next) => {
    if (!r.includes(req.user.role))
      return res.status(403).json({ msg: "Forbidden" });
    next();
  };
};
