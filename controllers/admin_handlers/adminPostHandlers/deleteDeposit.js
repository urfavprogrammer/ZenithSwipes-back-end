export default function deleteDepositRequest({ Deposits, Asset }) {
  return async function (req, res) {
    try {
      const { id, depositid, routingpage} = req.body;
      // console.log("Request body:", req.body);
      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Deposit ID is required" });
      }
      // console.log("Approving deposit with ID:", id);
      if (!Deposits || typeof Deposits.findOne !== "function") {
        console.error("deleteDeposit: Deposits model is not available");
        return res
          .status(500)
          .json({ success: false, message: "Deposits model not available" });
      }

      // Find the deposit to delete
      const deposit = await Deposits.findOne({
        where: { deposittransactionid: depositid },
      }).catch(() => null);
      if (!deposit)
        return res
          .status(404)
          .json({ success: false, message: "Deposit not found" });

        // Delete the deposit
      try {
        await deposit.destroy({force: true}).catch((err) => {
          console.error(
            "Failed to delete deposit:",
            err && err.stack ? err.stack : err
          );
        });
      } catch (e) {
        console.error(
          "Error updating deposit status:",
          e && e.stack ? e.stack : e
        );
      }
   

      if (req.flash) req.flash("success", "Deposit request Deleted");
      if (routingpage === "approved_deposits") {
        return res.redirect("/admin/approved_deposits");
      }
      return res.redirect("/admin/pendingdeposits");

    } catch (error) {
      console.error("Error deleting deposit:", error);
      return (
        req.flash("success", "Deposit Deleted successfully"),
        res.redirect("/admin/pendingdeposits")
      );
    }
  };
}
