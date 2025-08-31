export default function makeCreateSignal({ Asset, Signals }, { generateTransactionId, useDate }) {
  return async function createSignal(req, res) {
    try {
      const body = req.body || {};
      let usernameValue = body.username;
      const signalPurchaseAmount = body.signalPurchaseAmount;
      const currentTotalBalance = await Asset.findOne({ where: { username: usernameValue } }).then((user) => (user ? parseFloat(user.total_balance) : 0));
      const amount = Number(body.paket);
      if (!Number.isFinite(amount) || amount <= 0) {
        const msg = 'Invalid signal amount. Enter a number greater than 0.';
        if (req.xhr || (req.headers.accept || '').includes('application/json')) return res.status(400).json({ success: false, message: msg });
        if (req.flash) req.flash('error', msg);
        return res.redirect('/account/user/signals');
      }
      if (amount != signalPurchaseAmount) {
        const msg = 'Please put in the exact amount to purchase';
        if (req.xhr || (req.headers.accept || '').includes('application/json')) return res.status(400).json({ success: false, message: msg });
        if (req.flash) req.flash('error', msg);
        return res.redirect('/account/user/signals');
      }
      if (amount > currentTotalBalance) {
        const msg = 'Insufficient balance! Please top up your account.';
        if (req.xhr || (req.headers.accept || '').includes('application/json')) return res.status(400).json({ success: false, message: msg });
        if (req.flash) req.flash('error', msg);
        return res.redirect('/account/user/signals');
      } else {
        const updatedTotalBalance = currentTotalBalance - amount;
        await Asset.update({ total_balance: updatedTotalBalance }, { where: { username: usernameValue } }).catch((err) => {
          console.error('Error updating asset balance:', err);
          if (req.xhr || (req.headers.accept || '').includes('application/json')) return res.status(500).json({ success: false, message: 'Internal server error' });
          if (req.flash) req.flash('error', 'Failed to update asset balance');
          return res.redirect('/account/user/stake');
        });
      }
      const signal = await Signals.create({ username: body.username, signaltype: body.signal_nam, signalamount: body.paket, signaltrxid: generateTransactionId().toUpperCase(), datebought: useDate, signalstatus: body.signalStatus || 'active' });
      return res.status(201).json({ success: true, message: 'Signal purchased successfully' });
    } catch (err) {
      console.error('createSignal error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}
