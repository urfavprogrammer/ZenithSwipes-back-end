import { sendMail } from '../../utils/mailer.js';

export default function makeDepositRequest(models = {}, services = {}) {
  const { User, Asset, Deposits } = models;
  const { generateTransactionId, useDate } = services;

  return async function depositrequest(req, res) {
    const { paymentmethod, paket, username } = req.body || {};

    // basic validation
    if (!paymentmethod || !paket) {
      if (req.xhr || (req.headers.accept || '').includes('application/json'))
        return res.status(400).json({ success: false, message: 'Missing payment method or amount' });
      if (req.flash) req.flash('error', 'Missing payment method or amount');
      return res.redirect('/account/user/deposits');
    }

    // Resolve username: posted value or session
    let usernameValue = username ? String(username).toLowerCase() : null;
    if (!usernameValue && req.session && req.session.userId && User) {
      try {
        const u = await User.findByPk(req.session.userId, { attributes: ['username'] });
        if (u && u.username) usernameValue = String(u.username).toLowerCase();
      } catch (e) {
        console.error('Error resolving user for deposit:', e && e.stack ? e.stack : e);
      }
    }

    if (!usernameValue) {
      if (req.xhr || (req.headers.accept || '').includes('application/json'))
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      if (req.flash) req.flash('error', 'Please log in to deposit');
      return res.redirect('/account/user/deposits');
    }

    const amount = Number(paket);
    if (!Number.isFinite(amount) || amount <= 0) {
      if (req.xhr || (req.headers.accept || '').includes('application/json'))
        return res.status(400).json({ success: false, message: 'Invalid deposit amount' });
      if (req.flash) req.flash('error', 'Invalid deposit amount');
      return res.redirect('/account/user/deposits');
    }

    const txId = (typeof generateTransactionId === 'function') ? generateTransactionId().toUpperCase() : String(Date.now());

    try {
      const created = await Deposits.create({
        username: usernameValue,
        amount: paket,
        depositmethod: paymentmethod,
        depositdate: useDate || new Date().toISOString(),
        depositstatus: 'pending',
        deposittransactionid: txId,
      });
      // Store deposit info in session for later use
      req.session.deposit = created;

      // Fire-and-forget email notification to user (if email is available on session or DB)
    //   (async () => {
    //     try {
    //       let toEmail = null;
    //       if (req.session && req.session.userId && User && typeof User.findByPk === 'function') {
    //         const u = await User.findByPk(req.session.userId, { attributes: ['email','username'] }).catch(() => null);
    //         if (u && u.email) toEmail = u.email;
    //       }
    //       // Fallback: if username was posted, try to find email by username
    //       if (!toEmail && created && created.username && User && typeof User.findOne === 'function') {
    //         const u2 = await User.findOne({ where: { username: created.username }, attributes: ['email'] }).catch(() => null);
    //         if (u2 && u2.email) toEmail = u2.email;
    //       }
    //       if (toEmail) {
    //         const subject = 'Deposit request received';
    //         // Use the reusable 'transaction' EJS template (views/email_templates/transaction.ejs)
    //         const templateData = {
    //           title: 'Deposit request received',
    //           username: created.username || '',
    //           intro: 'We received your deposit request. Details are below:',
    //           amount: created.amount,
    //           transactionId: created.deposittransactionid,
    //           method: created.depositmethod,
    //           status: created.depositstatus,
    //           cta: { url: (process.env.SITE_URL || '') + '/account/user/deposits', label: 'View Deposits' },
    //           fromName: process.env.FROM_NAME || 'Support Team'
    //         };
    //         await sendMail({ to: toEmail, subject, text, template: 'transaction', templateData });
    //       } else {
    //         console.warn('No recipient email found for deposit notification; skipping mail');
    //       }
    //     } catch (mailErr) {
    //       console.warn('Error sending deposit notification:', mailErr && mailErr.stack ? mailErr.stack : mailErr);
    //     }
    //   })();

      if (req.xhr || (req.headers.accept || '').includes('application/json'))
        return res.status(201).json({ success: true, deposit: created });

      if (req.flash) req.flash('success', 'Deposit request submitted');
      return res.redirect('/proceedtodeposit');
    } catch (err) {
      console.error('depositrequest error:', err && err.stack ? err.stack : err);
      if (req.xhr || (req.headers.accept || '').includes('application/json'))
        return res.status(500).json({ success: false, message: 'Internal server error' });
      if (req.flash) req.flash('error', 'Failed to submit deposit');
      return res.redirect('/opps');
    }
  };
}
