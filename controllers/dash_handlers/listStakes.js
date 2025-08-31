export default function makeListStakes({ Stakes }, {}) {
  return async function listStakes(req, res) {
    try {
      let usernameValue = null;
      if (req.session && req.session.username)
        usernameValue = String(req.session.username).toLowerCase();
      else if (req.session && req.session.userId) {
        const sessionUser = await req.app
          .get("models")
          .User.findByPk(req.session.userId, { attributes: ["username"] })
          .catch(() => null);
        if (sessionUser && sessionUser.username)
          usernameValue = String(sessionUser.username).toLowerCase();
      }
      if (!usernameValue)
        return res
          .status(401)
          .json({ success: false, message: "Not authenticated" });
      const rows = await Stakes.findAll({
        where: { username: usernameValue },
        order: [["createdAt", "DESC"]],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      return res.json({ success: true, stakes: plain });
    } catch (err) {
      console.error("listStakes error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}
