import joi from "joi";
import bcrypt from "bcrypt";
import wrapAsync from "../../utils/wrapAsync.js";




export default function createAdminAuthController({ Admin }) {
    

  //show admin Login
  function showAdminLogin(req, res) {
    return res.render("adminView/adminlogin.ejs");
  }

  //show admin register route
  // Remove route before uploading
  function showAdminRegister(req, res) {
     try {
       // rely on res.locals populated by session/flash middleware in index.js
       return res.render("adminView/adminregister.ejs");
     } catch (err) {
       console.error(
         "Auth showRegister error:",
         err && err.stack ? err.stack : err
       );
       return res
         .status(500)
         .json({ success: false, message: "Internal server error" });
     }
    
  }


  // Admin registration
  async function adminRegister (req, res) {
    // Validate the input
    const schema = joi.object({
      username: joi.string().min(3).max(30).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
    });

    try {
      const { username, email, password } = req.body;
      const { error, value } = schema.validate(req.body);
      if (error) {
        const mapped = error.details.map((d) => ({
          field: d.path[0],
          msg: d.message,
        }));
       if (
         req.xhr ||
         (req.headers.accept && req.headers.accept.includes("application/json"))
       ) {
         return res
           .status(400)
           .json({
             success: false,
             message: "Validation error",
             errors: mapped,
           });
       }

       // set flash and redirect back so the form can render errors
       if (req.flash) {
         req.flash("error", "Validation error");
         req.flash("errors", mapped);
         // preserve submitted fields so the form can be repopulated
         req.flash("old", req.body || {});
       }
       console.log(req.flash);
       return res.redirect("/admin/register");
     }

      if (!Admin || typeof Admin.findOne !== 'function') {
        console.error('Admin model not configured for admin registration');
        if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
          return res.status(500).json({ success: false, message: 'Server misconfiguration: Admin model not available' });
        }
        if (req.flash) req.flash('error', 'Server configuration error');
        return res.redirect('/admin/register');
      }

      const existingUser = await Admin.findOne({
        where: { admin_email: email.toLowerCase() },
      });

      if (existingUser) {
        if (
          req.xhr ||
          (req.headers.accept &&
            req.headers.accept.includes("application/json"))
        ) {
          return res
            .status(409)
            .json({
              success: false,
              message: "User with this email already exists, Please Login",
            });
        }
        if (req.flash) {
          req.flash("error", "A user with this email already exists");
          req.flash("old", req.body || {});
        }
        return res.redirect("/admin/register");
      }
      const existingUserName = await Admin.findOne({
        where: { admin_username: username.toLowerCase() },
      });

      if (existingUserName) {
        if (
          req.xhr ||
          (req.headers.accept &&
            req.headers.accept.includes("application/json"))
        ) {
          return res
            .status(409)
            .json({
              success: false,
              message: "User with this username already exists",
            });
        }
        if (req.flash) {
          req.flash("error", "A user with this Username already exists");
          // persist the username so the form can be repopulated after redirect
          if (req.flash) req.flash("old", { username: username || "", email: email || "" });
        }
        return res.redirect("/admin/register");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the admin user
      if (!Admin || typeof Admin.create !== "function") {
        console.error("Admin model is not configured for admin registration");
        return res.status(500).send("Admin model not configured");
      }

      const newAdmin = await Admin.create({
        admin_username: username.toLowerCase(),
        admin_email: email.toLowerCase(),
        admin_password: hashedPassword,
        admin_role: "admin",
      });

      if (
        req.xhr ||
        (req.headers.accept && req.headers.accept.includes("application/json"))
      ) {
        return res.status(201).json({
          success: true,
          message: "Admin registered successfully",
          user: newAdmin,
        });
      }
      if (req.flash) {
        req.flash("success", "Account created successfully. Please log in.");
      }
      // also add a query fallback so the message appears even if session flashes
      return res.redirect("/admin/login?registered=1");
    } catch (err) {
      try {
        // Mask sensitive fields before logging
        const safeBody = Object.assign({}, req.body || {});
        if (safeBody.password) safeBody.password = "[REDACTED]";
        if (safeBody.confirm_password) safeBody.confirm_password = "[REDACTED]";
        console.error(
          "Auth register error:",
          err && err.stack ? err.stack : err,
          "request body:",
          safeBody
        );
      } catch (logErr) {
        console.error("Error while logging register failure:", logErr);
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  // Admin login handler
  async function adminLogin(req, res) {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
          return res.status(400).json({ success: false, message: 'Username and password are required' });
        }

        if (!Admin || typeof Admin.findOne !== 'function') {
          console.error('Admin model not configured for admin login');
          if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
            return res.status(500).json({ success: false, message: 'Server misconfiguration: Admin model not available' });
          }
          if (req.flash) req.flash('error', 'Server configuration error');
          return res.redirect('/admin/login');
        }

        const user = await Admin.findOne({ where: { admin_username: username.toLowerCase() } });
      if (!user) {
          if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
          }
    // persist the username so the form can be repopulated after redirect
    if (req.flash) req.flash('old', { username: username || '' });
    req.flash('error', 'Invalid username or password');
    return res.redirect('/admin/login');
        }
  
        const isMatch = await bcrypt.compare(password, user.admin_password);
      if (!isMatch) {
          if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
          }
    // persist the email so the form can be repopulated after redirect
  if (req.flash) req.flash('old', { username: username || '' });
    req.flash('error', 'Invalid email or password');
    return res.redirect('/admin/login');
        }
        req.session.userId = user.id;
        req.session.username = user.username;
        return res.redirect("/admin/dashboard");
      } catch (err) {
    console.error('Auth login error:', err && err.stack ? err.stack : err);
    // DEV DEBUG: expose stack in response to assist debugging locally. Remove in production.
    return res.status(500).json({ success: false, message: 'Internal server error', error: err && err.stack ? err.stack : String(err) });
      }
    }

    // change admin password

    async function changeAdminPassword(req, res) {
      try {
        const { oldPassword, newPassword, confirm_password } = req.body;
        const userId = req.session.userId;
        console.log(userId);

        if (!oldPassword || !newPassword || !confirm_password) {
          return res.status(400).json({ success: false, message: 'Old password, new password, and confirm password are required' });
        }

        if (newPassword !== confirm_password) {
          return res.status(400).json({ success: false, message: 'New password and confirm password do not match' });
        }

        const user = await Admin.findByPk(userId);
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.admin_password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Invalid old password' });
        }

        user.admin_password = await bcrypt.hash(newPassword, 10);
        await user.save();
          if (req.flash) {
            req.flash('success', 'Password changed successfully');
          }
        return res.redirect('/admin/changepassword');
      } catch (err) {
        console.error('Auth change password error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err && err.stack ? err.stack : String(err) });
      }
    }

    
   const adminLoginHandler = wrapAsync(showAdminLogin);
   const adminRegisterHandler = wrapAsync(showAdminRegister);
   const adminRegisterPostHandler = wrapAsync(adminRegister);
   const adminLoginPostHandler = wrapAsync(adminLogin);

  return {
    adminLogin: adminLoginHandler,
    adminRegister: adminRegisterHandler,
    adminRegisterPost: adminRegisterPostHandler,
    adminLoginPost: adminLoginPostHandler,
    changeAdminPassword: changeAdminPassword
  };
}