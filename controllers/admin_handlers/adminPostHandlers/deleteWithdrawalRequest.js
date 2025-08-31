export default function deleteWithdrawalRequest({ Withdrawal, Asset }) {
  return async function (req, res) {
    try {
      const { id, withdrawid, routingpage } = req.body;
      // console.log("Request body:", req.body);
      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Deposit ID is required" });
      }
      // console.log("Approving deposit with ID:", id);
      if (!Withdrawal || typeof Withdrawal.findOne !== "function") {
        console.error("deletewithdrawals: Withdrawals model is not available");
        return res
          .status(500)
          .json({ success: false, message: "Withdrawals model not available" });
      }

      // Find the withdrawal to delete
      const withdrawal = await Withdrawal.findOne({
        where: { withdrawaltransactionid: withdrawid },
      }).catch(() => null);
      if (!withdrawal)
        return res
          .status(404)
          .json({ success: false, message: "Withdrawal not found" });

      // Delete the withdrawal
      try {
        await withdrawal.destroy({ force: true }).catch((err) => {
          console.error(
            "Failed to delete withdrawal:",
            err && err.stack ? err.stack : err
          );
        });
      } catch (e) {
        console.error(
          "Error updating withdrawal status:",
          e && e.stack ? e.stack : e
        );
      }

      if (req.flash) req.flash("success", "Withdrawal request Deleted");
      if (routingpage === "approved_withdrawals") {
        return res.redirect("/admin/approved_withdrawals");
      }
      return res.redirect("/admin/pendingwithdrawals");

    } catch (error) {
      console.error("Error deleting withdrawal:", error);
      return (
        req.flash("success", "Withdrawal Deleted successfully"),
        res.redirect("/admin/pendingwithdrawals")
      );
    }
  };
}
