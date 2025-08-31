export default function createDashboardController(models = {}) {
  const { User, Asset, Deposits, Payment } = models;

  async function index(req, res) {
    try {
      // fetch logged-in user id from session
      const userId = req.session && req.session.userId;
      if (!userId) return res.redirect('/login');

      // fetch user and include associated asset (association configured in models/index.js)
      let user = null;
      if (User) {
        user = await User.findByPk(userId, {
          attributes: ['id', 'fullname', 'username', 'email', 'country', 'currency', 'gender', 'phone_number', 'referer'],
          include: Asset ? [{ model: Asset, as: 'asset' }] : []
        });
      }

      if (!user) {
        // invalid session user, clear session and redirect
        if (req.session) req.session.destroy?.(() => {});
        return res.redirect('/login');
      }

      // render the dashboard view and pass user + asset (available at user.asset)
      return res.render("dash_view/index.ejs",{ user, asset: user.asset || null, page_name: "dashboard" });
    } catch (err) {
      console.error('Dashboard index error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  // proceed to deposit
  async function paymentPage(req, res) {
    try {
      
      // Resolve username from session
      const username = req.session && req.session.username ? String(req.session.username).toLowerCase() : null;
      if (!username) return res.redirect('/login');
      const depositData = req.session.deposit || {};
            const payment = await Payment.findOne();
          // console.log(payment.dataValues);
      // Render the proceed to deposit view
      return res.render('dash_view/payment_page.ejs', { username, deposit: depositData, payment:payment.dataValues, page_name: "deposit" });
    } catch (err) {
      console.error('Dashboard proceedToDeposit error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // deposits controller function
  async function deposits(req, res) {
    try {
      // Resolve username from session
      let usernameValue = null;
      if (req.session && req.session.username) usernameValue = String(req.session.username).toLowerCase();
      else if (req.session && req.session.userId && User) {
        const sessionUser = await User.findByPk(req.session.userId, { attributes: ['username'] });
        if (sessionUser && sessionUser.username) usernameValue = String(sessionUser.username).toLowerCase();
      }

      if (!usernameValue) return res.redirect('/login');
      
      let deposits = [];
      if (Deposits) {
        const rows = await Deposits.findAll({ where: { username: usernameValue }, order: [['createdAt', 'ASC']] });
        deposits = rows.map(r => (r.get ? r.get({ plain: true }) : r));
      }
      
      return res.render("dash_view/deposits.ejs", {
        deposits,
        page_name: "deposits",
        // success: req.flash("success"),
        // error: req.flash("error"),
      });
    } catch (err) {
      console.error('Dashboard deposits error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // withdrawals controller function
  async function withdraw(req, res) {
    try {
      return res.render("dash_view/withdraw.ejs", { page_name: "withdraw" });
    } catch (err) {
      console.error('Dashboard withdraw error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  function trades(req, res) {
    try {
      return res.render('dash_view/trades.ejs', { page_name: "trades" });
    } catch (err) {
      console.error('Dashboard trades error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  function stake(req, res) {
    try {
      return res.render('dash_view/stake.ejs', { page_name: "stake" });
    } catch (err) {
      console.error('Dashboard stake error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  function copyTrade(req, res) {
    try {
      return res.render('dash_view/copy_trade.ejs', { page_name: "copy_trade" });
    } catch (err) {
      console.error('Dashboard copyTrade error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  function signals(req, res) {
    try {
      return res.render('dash_view/signals.ejs', { page_name: "signals" });
    } catch (err) {
      console.error('Dashboard signals error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  function buyBot(req, res) {
    try {
      return res.render('dash_view/buy_bot.ejs', { page_name: "buy_bot" });
    } catch (err) {
      console.error('Dashboard buyBot error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  function connectWallet(req, res) {
    try {
      return res.render('dash_view/connect_wallet.ejs', { page_name: "connect_wallet" || "import_wallet" });
    } catch (err) {
      console.error('Dashboard connectWallet error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  function importWallet(req, res){
    try {
      return res.render('dash_view/importWallet.ejs', { page_name: "import_wallet" });
    } catch (err) {
      console.error('Dashboard importWallet error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  function buyCrypto(req, res) {
    try {
      return res.render('dash_view/buy_crypto.ejs', { page_name: "buy_crypto" });
    } catch (err) {
      console.error('Dashboard buyCrypto error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  function subscribe(req, res) {
    try {
      return res.render('dash_view/subscribe.ejs', { page_name: "subscribe" });
    } catch (err) {
      console.error('Dashboard subscribe error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
    function referral(req, res) {
    try {
      return res.render('dash_view/referral.ejs', { page_name: "referrals" });
    } catch (err) {
      console.error('Dashboard referral error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  
  

  return {
    index,
    deposits,
    withdraw,
    trades,
    stake,
    copyTrade,
    signals,
    buyBot,
    connectWallet,
    buyCrypto,
    subscribe,
    paymentPage,
    referral, 
    importWallet
  };
}
