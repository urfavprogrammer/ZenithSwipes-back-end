

export default function createAdminController(models = {}) {
  const { User, Deposit, Withdrawal, Asset, Referral, Admin, Payment } = models || {};

  // Middleware to require admin: prefer boolean flag on User (isAdmin), else fallback to username === ADMIN_USERNAME
  async function requireAdmin(req, res, next) {
    try {
      if (!req.session || !req.session.userId) {
        if (req.xhr || (req.headers.accept || "").includes("application/json"))
          return res
            .status(401)
            .json({ success: false, message: "Access denied" });
        return res.redirect("/admin/login");
      }

      if (!User)
        return res
          .status(403)
          .send("Admin guard not configured (no User model)");

      const isAdmin = await Admin.findOne({
        where: { admin_role: "admin" }
      }).catch(() => null);
      // const isAdmin = (user && (user.isAdmin === true || String(user.username).toLowerCase() === String(adminUsername).toLowerCase()));

      if (!isAdmin) {
        if (req.xhr || (req.headers.accept || "").includes("application/json"))
          return res
            .status(403)
            .json({ success: false, message: "Admin access required" });
        return res.status(403).send("Admin access required");
      }
      // attach admin user to req for handlers
      req.adminUser = isAdmin;
      return next();
    } catch (err) {
      console.error("requireAdmin error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  async function index(req, res) {
    try {
      // simple admin summary (counts)
      const summary = {};
      if (User) summary.users = await User.count().catch(() => 0);
      // Use simple counts instead of using `sequelize.fn` here — the `sequelize` instance
      // isn't available in this module, and the previous code caused a ReferenceError.
      // If you want filtered counts (e.g. only 'approved'), pass a where clause.
      if (Deposit)
        summary.approved_deposits = await Deposit.count({
          where: { depositstatus: "approved" },
        }).catch(() => 0);
      if (Withdrawal)
        summary.approved_withdrawals = await Withdrawal.count({
          where: { withdrawalstatus: "approved" },
        }).catch(() => 0);
      if (Deposit)
        summary.pending_deposits = await Deposit.count({
          where: { depositstatus: "pending" },
        }).catch(() => 0);
      if (Withdrawal)
        summary.pending_withdrawals = await Withdrawal.count({
          where: { withdrawalstatus: "pending" },
        }).catch(() => 0);
      if (Referral) summary.referrals = await Referral.count().catch(() => 0);
      if (Asset)
        summary.total_pendingdeposit = await Asset.count().catch(() => 0);

      // Render Users
      if (!User)
        return res
          .status(500)
          .json({ success: false, message: "User model not available" });
      const rows = await Deposit.findAll({
        limit: 5,
        where: { depositstatus: "pending" },
        order: [
          ["createdAt", "DESC"],
          ["deposittransactionid", "DESC"],
          ["username", "DESC"],
          ["amount", "DESC"],
          ["depositmethod", "DESC"],
          ["depositstatus", "DESC"],
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));

  
      // render a minimal admin index page if view exists, else return JSON
      if (res.render) {
        return res.render("adminView/index.ejs", { summary, pendingtrx: plain });
      }
      return res.json({ success: true, summary });
    } catch (err) {
      console.error("Admin index error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function listUsers(req, res) {
    try {
      if (!User)
        return res
          .status(500)
          .json({ success: false, message: "User model not available" });
      const rows = await User.findAll({
        attributes: [
          "id",
          "fullname",
          "username",
          "email",
          "country",
          "created_at",
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      if (res.render)
        return res.render("adminView/adminPages/investors.ejs", {
          users: plain,
        });
      return res.json({ success: true, users: plain });
    } catch (err) {
      console.error(
        "Admin listUsers error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async function listReferrals(req, res) {
    try {
      if (!Referral)
        return res
          .status(500)
          .json({ success: false, message: "Referral model not available" });
      const rows = await Referral.findAll();
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      if (res.render)
        return res.render("admin/referrals.ejs", { referrals: plain });
      return res.json({ success: true, referrals: plain });
    } catch (err) {
      console.error(
        "Admin listReferrals error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // List pending deposits
  async function listPendingDeposits(req, res) {
    try {
      if (!Deposit)
        return res
          .status(500)
          .json({ success: false, message: "Deposit model not available" });
      const rows = await Deposit.findAll({
        where: { depositstatus: "pending" },
        order: [
          ["createdAt", "DESC"],
          ["deposittransactionid", "DESC"],
          ["username", "DESC"],
          ["amount", "DESC"],
          ["depositmethod", "DESC"],
          ["depositstatus", "DESC"],
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      if (res.render)
        return res.render("adminView/adminPages/pendingDeposits.ejs", {
          deposits: plain,
          messages: req.flash(),
        });
      return res.json({ success: true, deposits: plain });
    } catch (err) {
      console.error(
        "Admin listDeposits error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // List approved deposits
  async function listApprovedDeposits(req, res) {
    try {
      if (!Deposit)
        return res
          .status(500)
          .json({ success: false, message: "Deposit model not available" });
      const rows = await Deposit.findAll({
        where: { depositstatus: "approved" },
        order: [
          ["createdAt", "DESC"],
          ["deposittransactionid", "DESC"],
          ["username", "DESC"],
          ["amount", "DESC"],
          ["depositmethod", "DESC"],
          ["depositstatus", "DESC"],
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      if (res.render)
        return res.render("adminView/adminPages/approvedDeposits.ejs", {
          deposits: plain, messages: req.flash()
        });
      return res.json({ success: true, deposits: plain });
    } catch (err) {
      console.error(
        "Admin listDeposits error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // List Pending Withdrawals
  async function listPendingWithdrawals(req, res) {
    try {
      if (!Withdrawal)
        return res
          .status(500)
          .json({ success: false, message: "Withdrawal model not available" });
      const rows = await Withdrawal.findAll({
        where: { withdrawalstatus: "pending" },
        order: [
          ["createdAt", "DESC"],
          ["withdrawaltransactionid", "DESC"],
          ["username", "DESC"],
          ["amount", "DESC"],
          ["withdrawalmethod", "DESC"],
          ["withdrawalstatus", "DESC"],
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));

      if (res.render)
        return res.render("adminView/adminPages/pendingWithdrawal.ejs", {
          withdrawals: plain,
        });
      return res.json({ success: true, withdrawals: plain });
    } catch (err) {
      console.error(
        "Admin listPendingWithdrawals error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  // list approved withdrawals
  async function listApprovedWithdrawals(req, res) {
    try {
      if (!Withdrawal)
        return res
          .status(500)
          .json({ success: false, message: "Withdrawal model not available" });
      const rows = await Withdrawal.findAll({
        where: { withdrawalstatus: "approved" },
        order: [
          ["createdAt", "DESC"],
          ["withdrawaltransactionid", "DESC"],
          ["username", "DESC"],
          ["amount", "DESC"],
          ["withdrawalmethod", "DESC"],
          ["withdrawalstatus", "DESC"],
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      if (res.render)
        return res.render("adminView/adminPages/approvedWithdrawals.ejs", {
          withdrawals: plain,
        });
      return res.json({ success: true, withdrawals: plain });
    } catch (err) {
      console.error(
        "Admin listWithdrawals error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  //Edit account
  async function editAccount(req, res) {
    try {
      // const { id, username, email } = req.body;
      const rows = await User.findAll({
        attributes: [
          "id",
          "fullname",
          "username",
          "email",
          "country",
          "created_at",
        ],
      });
      const plain = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
      res.render("adminView/adminPages/editAccount.ejs", { users: plain });

      // if (!id) {
      //   return res.status(400).json({ success: false, message: "User ID is required" });
      // }
      // const user = await User.findByPk(id);
      // if (!user) {
      //   return res.status(404).json({ success: false, message: "User not found" });
      // }
      // user.username = username || user.username;
      // user.email = email || user.email;
      // await user.save();
      // return res.json({ success: true, message: "Account updated successfully", user });
    
    } catch (err) {
      console.error(
        "Admin editAccount error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  async function viewPaymentDetails(req, res) {
      try {
        if (!Payment)
          return res
            .status(500)
            .json({ success: false, message: "Payment model not available" });
        const rows = await Payment.findAll();
        const details = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
        // console.log(details[0]);
        if (res.render)
          return res.render("adminView/adminPages/viewPaymentDetails.ejs", {
            payments: details[0],
          });
        return res.json({ success: true, message: "Payment details retrieved successfully"});
      } catch (err) {
        console.error(
          "Admin viewPaymentDetails error:",
          err && err.stack ? err.stack : err
        );
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
  }

   async function updateAccount(req, res) {

    const { userId } = req.params;
    const user = await User.findByPk(userId);
    const username = user["username"];
    // console.log(username);

      if (!Asset || typeof Asset.findOne !== "function") {
        console.error("updateUserAssets: Asset model is not available");
        return res
          .status(500)
          .json({ success: false, message: "Asset model not available" });

      }
    const rows = await Asset.findAll({ where: { username: String(username) } });
    const userAsset = rows.map((r) => (r.get ? r.get({ plain: true }) : r));
    // console.log(userAsset);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.render("adminView/adminPages/editForm.ejs", { user, userAsset: userAsset[0] });

   };

   async function paymentDetails(req, res) {
    try {
      
      if (res.render)
        return res.render("adminView/adminPages/updatePaymentDetails.ejs",);
      return res.json({ success: true, payment: plain });

    } catch (err) {
      console.error(
        "Admin paymentDetails error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
    };
    async function changeAdminPassword(req, res) {
      try {
        res.render("adminView/adminPages/changePassword.ejs");
      } catch (err) {
        console.error(
          "Admin changePassword error:",
          err && err.stack ? err.stack : err
        );
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    }


  return {
    requireAdmin,
    index,
    listUsers,
    listReferrals,
    listPendingDeposits,
    listApprovedDeposits,
    listPendingWithdrawals,
    listApprovedWithdrawals,
    editAccount,
    updateAccount,
    paymentDetails,
    viewPaymentDetails,
    changeAdminPassword
  };
}
