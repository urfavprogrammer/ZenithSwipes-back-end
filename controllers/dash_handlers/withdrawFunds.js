export default function makeWithdrawFunds({ User, Asset, Withdrawal }, { generateTransactionId, useDate }) {
  return async function withdrawFunds(req, res) {
    try {
      const body = req.body || {};
      let usernameValue = body.username ? String(body.username).toLowerCase() : null;
      const currentTotalBalance = await Asset.findOne({ where: { username: usernameValue } }).then((user) => (user ? parseFloat(user.total_balance) : 0));
      if (!usernameValue && req.session && req.session.userId && User) {
        const u = await User.findByPk(req.session.userId, { attributes: ['username'] }).catch(() => null);
        if (u && u.username) usernameValue = String(u.username).toLowerCase();
      }
      if (!usernameValue) {
        if (req.xhr || (req.headers.accept || '').includes('application/json')) return res.status(401).json({ success: false, message: 'Not authenticated' });
        if (req.flash) req.flash('error', 'Please log in to submit a withdrawal request');
        return res.redirect('/withdraw');
      }
      const amount = Number(body.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        const msg = 'Invalid withdrawal amount. Enter a number greater than 0.';
        if (req.xhr || (req.headers.accept || '').includes('application/json')) return res.status(400).json({ success: false, message: msg });
        if (req.flash) req.flash('error', msg);
        return res.redirect('/withdraw');
      }
      if (amount > currentTotalBalance) {

        const msg = 'Insufficient balance for withdrawal.';
        if (req.xhr || (req.headers.accept || '').includes('application/json')) return res.status(400).json({ success: false, message: msg });
        if (req.flash) req.flash('error', msg);
        return res.redirect('/account/user/withdraw');
        
      }
      const method = body.method || body.withdrawalMethod || 'Unknown';
      const txId = generateTransactionId().toUpperCase();
      const payload = {
        username: usernameValue,
        amount,
        withdrawalmethod: method,
        withdrawaltype: body.wallet || '-',
        walletaddress: body.address || body.wallet || null,
        withdrawaldate: useDate,
        withdrawalstatus: 'pending',
        withdrawaltransactionid: txId,
        bankname: body.bank_name || null,
        accountname: body.acc_name || null,
        accountnumber: body.acc_no || null,
        swiftcode: body.swift_no || null,
        routingnumber: body.routing_no || null,
        paypaladdress: body.paypal_address || null,
        skrilladdress: body.skrill_address || null,
      };
      const WithdrawModel = Withdrawal || (req.app && req.app.get && req.app.get('models') && (req.app.get('models').Withdraw || req.app.get('models').Withdrawal));
      if (!WithdrawModel || typeof WithdrawModel.create !== 'function') {
        if (req.xhr || (req.headers.accept || '').includes('application/json')) return res.status(500).json({ success: false, message: 'Server misconfiguration' });
        if (req.flash) req.flash('error', 'Server error: withdrawal not saved');
        return res.redirect('/account/user/withdraw');
      }
      const created = await WithdrawModel.create(payload);
      if (req.xhr || (req.headers.accept || '').includes('application/json')) return res.status(201).json({ success: true, message: 'Withdrawal request submitted', withdrawal: created });
      if (req.flash) req.flash('success', 'Withdrawal request submitted and is pending approval.');
      return res.redirect('/account/user/withdraw');
    } catch (err) {
      console.error('withdrawFunds error:', err && err.stack ? err.stack : err);
      if (req.xhr || (req.headers.accept || '').includes('application/json')) return res.status(500).json({ success: false, message: 'Internal server error' });
      if (req.flash) req.flash('error', 'Failed to submit withdrawal request. Please try again.');
      return res.redirect('/account/user/withdraw');
    }
  };
}
