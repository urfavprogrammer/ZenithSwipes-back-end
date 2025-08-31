export default function approveWithdrawRequest({ Withdrawal, Asset }) {
  return async function (req, res) {
    try {
      const { id, withdrawid, username, amount } = req.body;
      // console.log("Request body:", req.body);
      console.log(withdrawid)
      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Withdrawal ID is required" });
      }
      // console.log("Approving withdrawal with ID:", id);
      if (!Withdrawal || typeof Withdrawal.findOne !== "function") {
        console.error("approveWithdraw: Withdrawal model is not available");
        return res
          .status(500)
          .json({ success: false, message: "Withdrawal model not available" });
      }

      const withdrawal = await Withdrawal.findOne({
        where: { withdrawaltransactionid: withdrawid },
      }).catch(() => null);
      if (!withdrawal)
        return res
          .status(404)
          .json({ success: false, message: "Withdrawal not found" });

      // Update asset balance if Asset model exists
      const asset = await Asset.findOne({
        where: { username: username },
      }).catch(() => null);

      if (asset) {
        const current = Number(asset.total_balance);
        const add = Number(amount);
        const currentTotalWithdrawals = Number(asset.total_withdrawal);
        asset.total_balance = current - add;
        asset.total_withdrawal = currentTotalWithdrawals + add;

        asset.total_pendingwithdrawal > 0
          ? (asset.total_pendingwithdrawal -= 1)
          : (asset.total_pendingwithdrawal = 0);

        await asset
          .save()
          .catch((err) =>
            console.error(
              "Failed to save asset:",
              err && err.stack ? err.stack : err
            )
          );
      }
      // mark withdrawal approved
      try {
        if (typeof withdrawal.set === "function") {
          withdrawal.set("withdrawalstatus", "approved");
        } else {
          withdrawal.withdrawalstatus = "approved";
        }
        await withdrawal.save().catch((err) => {
          console.error(
            "Failed to save withdrawal:",
            err && err.stack ? err.stack : err
          );
        });
      } catch (e) {
        console.error(
          "Error updating withdrawal status:",
          e && e.stack ? e.stack : e
        );
      }
      return res
        .status(200)
        .json({
          success: true,
          message: "Withdrawal approved successfully",
          withdrawal,
        });
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}
