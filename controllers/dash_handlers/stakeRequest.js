export default function makeStakeRequest(
  { User, Asset, Stakes },
  { generateTransactionId, useDate }
) {
  return async function stakeRequest(req, res) {
    try {

      const body = req.body || {};

      let usernameValue = body.username
        ? String(body.username).toLowerCase()
        : null;

      const userAssets = await Asset.findOne({
        where: { username: usernameValue }, order: [['id', 'DESC']]
      });
      const currentTotalBalance = userAssets.total_balance;

      // console.log(userAssets);
      // console.log(currentTotalBalance);

      if (!usernameValue && req.session && req.session.userId && User) {
        const u = await User.findByPk(req.session.userId, {
          attributes: ["username"],
        }).catch(() => null);
        if (u && u.username) usernameValue = String(u.username).toLowerCase();
      }

      if (!usernameValue) {
        if (req.xhr || (req.headers.accept || "").includes("application/json"))
          return res
            .status(401)
            .json({ success: false, message: "Not authenticated" });
        if (req.flash)
          req.flash("error", "Please log in to stake your asssets");
        return res.redirect("/account/user/stake");
      }
      //validate duration
      if (!body.duration || String(body.duration).trim() === "" || Number(body.duration) <= 0) {
        const msg = "Invalid staking duration. Enter a number greater than 0.";
        if (req.xhr || (req.headers.accept || "").includes("application/json"))
          return res.status(400).json({ success: false, message: msg });
        if (req.flash) req.flash("error", msg);
        return res.redirect("/account/user/stake");
      }
      const duration = Number(body.duration);

      //validate amount
      const amount = Number(body.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        const msg = "Invalid staking amount. Enter a number greater than 0.";
        if (req.xhr || (req.headers.accept || "").includes("application/json"))
          return res.status(400).json({ success: false, message: msg });
        if (req.flash) req.flash("error", msg);
        return res.redirect("/account/user/stake");
      }
      if (amount > currentTotalBalance) {
        const msg = "Insufficient balance for staking.";
        if (req.xhr || (req.headers.accept || "").includes("application/json"))
          return res.status(400).json({ success: false, message: msg });
        if (req.flash) req.flash("error", msg);
        return res.redirect("/account/user/stake");
      } else {
        const updatedTotalBalance = currentTotalBalance - amount;
        await Asset.update(
          {
            total_balance: updatedTotalBalance,
            username: usernameValue,
            investment_amount: body.amount,
            investment_plan: body.currency,
            countingDays: body.duration,
            investment_date: useDate,
            investment_status: "active"
          },
          { where: { username: usernameValue } }
        ).catch((err) => {
          console.error("Error updating asset balance:", err);
          if (
            req.xhr ||
            (req.headers.accept || "").includes("application/json")
          )
            return res
              .status(500)
              .json({ success: false, message: "Internal server error" });
          if (req.flash) req.flash("error", "Failed to update asset balance");
          return res.redirect("/account/user/stake");
        });
      }
      //create stake record
      const staked = await Stakes.create({
        username: usernameValue,
        amount: body.amount,
        est_apy: body.percent || 0,
        stakeduration: body.duration || 0,
        stakedate: useDate,
        staketoken: body.currency || "USDT",
        stakeid: generateTransactionId().toUpperCase(),
      });

      //update user assets
      // await Asset.update(
      //   { total_balance: currentTotalBalance - amount },
        
      //   { where: { username: usernameValue } }
      // );

      if (req.xhr || (req.headers.accept || "").includes("application/json"))
        return res
          .status(201)
          .json({
            success: true,
            message: "Staking request submitted",
            stake: staked,
          });
      if (req.flash)
        req.flash(
          "success",
          "Staking request submitted and is pending approval."
        );
      return res.redirect("/account/user/stake");
    } catch (err) {
      console.error("stakeRequest error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}
