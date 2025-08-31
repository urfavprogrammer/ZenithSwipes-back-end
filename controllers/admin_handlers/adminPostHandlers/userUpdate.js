
export default function updateUser({ User, Asset }) {

  return async (req, res) => {
    const userId = req.params.userId;
    const username = req.body.username;
    console.log(userId);
  const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    // Find asset by username
    let asset = null;
    if (Asset && typeof Asset.findOne === "function") {
      asset = await Asset.findOne({ where: { username: username } });
      console.log(asset);
    }

    // Track changes
    let userChanged = false;
    let assetChanged = false;

    // User fields
    const userFields = ["fullname", "username", "email", "country", "currency", "gender", "phone_number", "referer"];
    for (const field of userFields) {
      if (field in req.body && req.body[field] !== undefined && req.body[field] !== user[field]) {
        user[field] = req.body[field];
        userChanged = true;
      }
    }
    if (userChanged) await user.save();

    // Asset fields
    const assetFields = ["total_balance", "profit", "trade_bonus", "referal_bonus", "total_won", "total_loss", "total_deposit", "total_withdrawal", "total_pendingdeposit", "total_pendingwithdrawal"];
    if (asset) {
      for (const field of assetFields) {
        if (field in req.body && req.body[field] !== undefined && req.body[field] !== asset[field]) {
          asset[field] = req.body[field];
          assetChanged = true;
        }
      }
      if (assetChanged) await asset.save();
    }

    if (userChanged || assetChanged) {
      return res.status(200).json({ success: true, message: "User and/or asset updated successfully" });
    } else {
      return res.status(200).json({ success: true, message: "No changes detected" });
    }
  };
}