import express from 'express';
import {upload, profileUpload} from '../controllers/dash_handlers/middleware/upload.js';
// import { uploadAvatarHandler } from "../controllers/profileController.js";
import createAuthController from '../controllers/authController.js';
import createDashboardController from '../controllers/dashboardController.js';
import createDashPostController from '../controllers/dashPostController.js';
import createProfileController from '../controllers/profileController.js';
import createAdminController from '../controllers/admin_handlers/adminController.js';
import createAdminAuthController from '../controllers/admin_handlers/adminAuthController.js';
import createAdminPostController from '../controllers/admin_handlers/adminPostController.js';

export default function createRouter({ User, Asset, Deposits, Withdrawal, Stakes, Signals, Referral, Admin, Payment, Document }) {
  const router = express.Router();
  const auth = createAuthController({ User, Asset });
  const dashboard = createDashboardController({ User, Asset, Deposits, Payment });
  const profile = createProfileController({ User });
  const dashPost = createDashPostController({User, Asset, Deposits, Withdrawal, Stakes, Signals, Referral, Payment, Document });

  const adminPost = createAdminPostController({User, Deposits, Withdrawal, Asset, Payment });

  const adminAuth = createAdminAuthController({ Admin });

  const admin = createAdminController({ User, Admin, Asset, Deposit: Deposits,  Withdrawal: Withdrawal, Referral: Referral, Payment });

  // Public
  router.get("/login", auth.showLogin);
  router.get("/register", auth.showRegister);

  // Admin POSTS ROUTE
  router.post("/admin/deposit/approve", admin.requireAdmin, adminPost.approvedepositrequest);
  router.post("/admin/deposit/decline", admin.requireAdmin, adminPost.declinedepositrequest);
  router.post("/admin/deposit/delete", admin.requireAdmin, adminPost.deletedepositrequest);
  router.post(
    "/admin/withdraw/approve",
    admin.requireAdmin,
    adminPost.approvewithdrawrequest
  );
  router.post("/admin/withdraw/decline", admin.requireAdmin, adminPost.declinewithdrawrequest);
  router.post("/admin/withdraw/delete", admin.requireAdmin, adminPost.deletewithdrawrequest);
   router.post(
     "/admin/users/:userId/edit_account",
     admin.requireAdmin,
     adminPost.updateuser
   );
   router.post(
     "/admin/payment/update_paymentdetails",
     admin.requireAdmin,
     adminPost.updatepayment
   );
   router.post("/admin/changepassword", admin.requireAdmin, adminAuth.changeAdminPassword);
  // router.post("/admin/withdraw/decline", admin.requireAdmin, adminPost.declinewithdrawrequest);
  // router.post("/admin/withdraw/delete", admin.requireAdmin, adminPost.deletewithdrawrequest);

  //admin login and register routes
router.get("/admin/login", adminAuth.adminLogin);
router.get("/admin/register", adminAuth.adminRegister);

// Register and verifyLogin admin posts
router.post("/admin/register", adminAuth.adminRegisterPost);
router.post("/admin/login", adminAuth.adminLoginPost);


  // Auth
  router.post("/login", auth.login);
  router.post("/submit", auth.register);

  //change password
  router.post("/user/changepassword", auth.requireAuth, auth.changePassword);

  // Allow logout via GET or POST for convenience
  router.get("/logout", auth.logout);
  router.post("/logout", auth.logout);

  // Protected dashboard routes
  router.get("/account/user/dash_index", auth.requireAuth, dashboard.index);
  router.get("/account/user/deposits", auth.requireAuth, dashboard.deposits);
  router.get("/account/user/withdraw", auth.requireAuth, dashboard.withdraw);
  router.get("/account/user/trades", auth.requireAuth, dashboard.trades);
  router.get("/account/user/stake", auth.requireAuth, dashboard.stake);
  router.get("/account/user/copy_trade", auth.requireAuth, dashboard.copyTrade);
  router.get("/account/user/signals", auth.requireAuth, dashboard.signals);
  router.get("/account/user/buy_bot", auth.requireAuth, dashboard.buyBot);
  router.get("/account/user/connect_wallet", auth.requireAuth, dashboard.connectWallet);
  router.get("/account/user/buy_crypto", auth.requireAuth, dashboard.buyCrypto);
  router.get("/account/user/subscribe", auth.requireAuth, dashboard.subscribe);
  router.get("/account/user/referrals", auth.requireAuth, dashboard.referral);
  router.get("/proceedtodeposit", auth.requireAuth, dashboard.paymentPage);
  router.get("/account/user/profile", auth.requireAuth, profile.profile);
  router.get("/account/user/changeavatar", auth.requireAuth, profile.changeAvatar);
  router.get("/account/user/importwallet", auth.requireAuth, dashboard.importWallet);

  // Protected Admin GET routes
    router.get("/admin/dashboard", admin.requireAdmin, admin.index);
    router.get("/admin/users", admin.requireAdmin, admin.listUsers);
    router.get("/admin/pendingdeposits", admin.requireAdmin, admin.listPendingDeposits);
    router.get("/admin/approved_deposits", admin.requireAdmin, admin.listApprovedDeposits);
    router.get(
      "/admin/pendingwithdrawals",
      admin.requireAdmin,
      admin.listPendingWithdrawals
    );
    router.get("/admin/approved_withdrawals", admin.requireAdmin, admin.listApprovedWithdrawals);
    router.get("/admin/edit_account", admin.requireAdmin, admin.editAccount);
  router.get("/admin/users/:userId/edit_account", admin.requireAdmin, admin.updateAccount);
  router.get("/admin/payment", admin.requireAdmin, admin.paymentDetails);
  router.get("/admin/view_payment_details", admin.requireAdmin, admin.viewPaymentDetails);
  router.get("/admin/changepassword", admin.requireAdmin, admin.changeAdminPassword);
  
  
  // API: list deposits for logged-in user
  router.get("/api/deposits", auth.requireAuth, dashPost.listDeposits);
  router.get("/api/withdrawals", auth.requireAuth, dashPost.listWithdrawals);
  router.get("/api/stakes", auth.requireAuth, dashPost.listStakes);
  router.get("/api/referrals", auth.requireAuth, dashPost.listReferrals);
  router.get("/api/checkOtp", auth.requireAuth, dashPost.checkOtp);
  // Also allow POST from client-side OTP verification (withdraw page posts OTP)
  router.post("/api/checkOtp", auth.requireAuth, dashPost.checkOtp);


  // Dashboard Post
  router.post("/depositrequest", auth.requireAuth, dashPost.depositrequest);
  router.post("/withdrawalrequest", auth.requireAuth, dashPost.withdrawFunds);
  router.post("/stakerequest", auth.requireAuth, dashPost.stakeRequest);
  router.post("/signalrequest", auth.requireAuth, dashPost.createSignal);
  router.post("/upload_deposit_proof", auth.requireAuth, upload.single("document"), dashPost.uploadDocument);
  // router.post("/update_avatar", auth.requireAuth, upload.single("avatar"), profile.uploadAvatar);
  router.post("/account/user/changeavatar", profileUpload.single("avatar"), auth.requireAuth, profile.newAvatar);
  // router.post("/account/user/profile/edit", auth.requireAuth, profile.editProfile);

  // Profile
  router.get("/profile", auth.requireAuth, profile.profile);



  return router;
}
