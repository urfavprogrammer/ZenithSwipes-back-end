export default function declineWithdrawalRequest({ Withdrawal, Asset }) {
  return async function (req, res) {
    try {
      const { id, withdrawid, username, amount } = req.body;
      console.log(withdrawid )
      // console.log("Request body:", req.body);
      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Withdrawal ID is required" });
      }
      // console.log("Approving deposit with ID:", id);
      if (!Withdrawal || typeof Withdrawal.findOne !== "function") {
        console.error("declineWithdrawal: Withdrawals model is not available");
        return res
          .status(500)
          .json({ success: false, message: "Withdrawals model not available" });
      }

      const withdrawal = await Withdrawal.findOne({
        where: { withdrawaltransactionid: withdrawid },
      }).catch(() => null);
      if (!withdrawal)
        return res
          .status(404)
          .json({ success: false, message: "Withdrawal not found" });

      // mark withdrawal declined
      try {
        if (typeof withdrawal.set === "function") {
          withdrawal.set("withdrawalstatus", "declined");
        } else {
          withdrawal.withdrawalstatus = "declined";
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
      //   if (req.xhr || (req.headers.accept || "").includes("application/json"))
      //     return res.status(201).json({ success: true, deposit: created });

      if (req.flash) req.flash("success", "Withdrawal declined");
      return res.redirect("/admin/pendingwithdrawals");

      //   res
      //     .status(200)
      //     .json({
      //       success: true,
      //       message: "Deposit Declined successfully",
      //       deposit,
      //     });
    } catch (error) {
      console.error("Error declining withdrawal:", error);
      return (
        req.flash("error", "error declining withdrawal"),
        res.redirect("/admin/pendingwithdrawals")
      );
    }
  };
}
