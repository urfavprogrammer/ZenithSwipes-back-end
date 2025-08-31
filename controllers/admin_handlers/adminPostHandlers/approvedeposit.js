
export default function approveDepositRequest({ Deposits, Asset }) {
    return async function (req, res) {
        try {
            const { id, depositid, username, amount } = req.body;
            // console.log("Request body:", req.body);
            if (!id) {
                return res.status(400).json({ success: false, message: "Deposit ID is required" });
            }
            // console.log("Approving deposit with ID:", id);
            if (!Deposits || typeof Deposits.findOne !== 'function') {
                console.error('approveDeposit: Deposits model is not available');
                return res.status(500).json({ success: false, message: 'Deposits model not available' });
            }

            const deposit = await Deposits.findOne({ where: { deposittransactionid: depositid } }).catch(() => null);
            if (!deposit) return res.status(404).json({ success: false, message: 'Deposit not found' });

            // Update asset balance if Asset model exists
            const asset = await Asset.findOne({
              where: { username: username },
            }).catch(() => null);

            if (asset) {
                const current = Number(asset.total_balance);
                const add = Number(amount);
                const currentTotalDeposits = Number(asset.total_deposit || 0);
                //update columns based on actions taken
                asset.total_deposit = currentTotalDeposits + add;
                asset.total_balance = current + add;
               asset.total_pendingdeposit > 0 ? asset.total_pendingdeposit -= 1 : asset.total_pendingdeposit = 0;

                await asset.save().catch(err => console.error('Failed to save asset:', err && err.stack ? err.stack : err));
            }
            // mark deposit approved
            try {
                if (typeof deposit.set === 'function') {
                    deposit.set('depositstatus', 'approved');
                } else {
                    deposit.depositstatus = 'approved';
                }
                await deposit.save().catch(err => { console.error('Failed to save deposit:', err && err.stack ? err.stack : err); });
                if (req.flash) req.flash('success', 'Deposit approved');
                return res.redirect("/admin/pendingdeposits");
            } catch (e) {
                console.error('Error updating deposit status:', e && e.stack ? e.stack : e);
            }
            return res.status(200).json({ success: true, message: "Deposit approved successfully", deposit });
        } catch (error) {
            console.error("Error approving deposit:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };
}
