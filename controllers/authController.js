// @ts-ignore
import joi from "joi";
import bcrypt from "bcrypt";
import wrapAsync from "../utils/wrapAsync.js";

export default function createAuthController({ User, Asset }) {
  // Validation schema for registration payloads
  const memberSchema = joi.object({
    fullname: joi.string().min(2).max(50).required().messages({
      "string.min": "Full name must be at least 2 characters long",
      "string.max": "Full name must be at most 50 characters long",
      "any.required": "Full name is required",
    }),
    email: joi.string().email().required().messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    username: joi.string().alphanum().min(3).max(30).required().messages({
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must be at most 30 characters long",
      "any.required": "Username is required",
    }),
    phone_number: joi
      .string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be a valid 10-digit number",
        "any.required": "Phone number is required",
      }),
    password: joi.string().min(8).max(30).required(),
    confirm_password: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({
        "any.only": "Confirm password must match password",
      }),
    country: joi.string().min(2).max(50).required(),
    // currency: joi.string().min(1).max(10).required(),
    // referer: joi.string().min(2).max(100).optional(),
    // gender: joi.string().valid('Male', 'Female').required(),
  });

  function showLogin(req, res) {
    try {
      if (req.session && req.session.userId)
        return res.redirect("/account/user/dash_index");
      // don't consume flash here; middleware in index.js populates res.locals
      return res.render("homeViews/login.ejs");
    } catch (err) {
      console.error(
        "Auth showLogin error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Renders the registration page, passing error and flash messages if available
  function showRegister(req, res) {
    try {
      function generateCaptcha() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let captcha = "";
        for (let i = 0; i < 6; i++) {
          captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return captcha;
      };
      const captcha = generateCaptcha();
      // rely on res.locals populated by session/flash middleware in index.js
      return res.render("homeViews/register.ejs", { captcha });
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

  async function login(req, res) {
    try {
      // Diagnostic guard: ensure User model is available
      if (typeof User === "undefined" || !User) {
        console.error(
          "Auth login error: User model is not available in controller closure"
        );
        return res
          .status(500)
          .json({
            success: false,
            message: "Server configuration error: User model missing",
          });
      }
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
      }

      let user;
      try {
        console.log(
          "Auth login: attempting User.findOne for",
          email && email.toLowerCase()
        );
        user = await User.findOne({ where: { email: email.toLowerCase() } });
      } catch (dbErr) {
        console.error(
          "Auth login DB error during User.findOne:",
          dbErr && dbErr.stack ? dbErr.stack : dbErr
        );
        return res
          .status(500)
          .json({ success: false, message: "Database error during login" });
      }
      if (!user) {
        if (
          req.xhr ||
          (req.headers.accept &&
            req.headers.accept.includes("application/json"))
        ) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid email or password" });
        }
        // persist the email so the form can be repopulated after redirect
        if (req.flash) req.flash("old", { email: email || "" });
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        if (
          req.xhr ||
          (req.headers.accept &&
            req.headers.accept.includes("application/json"))
        ) {
          return res
            .status(401)
            .json({ success: false, message: "Incorrect email or password" });
        }
        // persist the email so the form can be repopulated after redirect
        if (req.flash) req.flash("old", { email: email || "" });
        req.flash("error", "Incorrect  email or password");
        return res.redirect("/login");
      }

      req.session.userId = user.id;
      req.session.username = user.username;
      return res.redirect("/account/user/dash_index");
    } catch (err) {
      console.error("Auth login error:", err && err.stack ? err.stack : err);
      // DEV DEBUG: expose stack in response to assist debugging locally. Remove in production.
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          error: err && err.stack ? err.stack : String(err),
        });
    }
  }

  // Register a new user
  async function register(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Request body is empty" });
      }

      const { error, value } = memberSchema.validate(req.body);
      if (error) {
        const mapped = error.details.map((d) => ({
          field: d.path[0],
          msg: d.message,
        }));
        if (
          req.xhr ||
          (req.headers.accept &&
            req.headers.accept.includes("application/json"))
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
        return res.redirect("/register");
      }

      const {
        fullname,
        username,
        email,
        country,
        phone_number,
        password,
      } = value;
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() },
      });
        // const userCountry = req.body.country; 
        // const userCurrency = countryCurrencyMap.getCountryCurrencyCode(userCountry); // 
      // console.log("Detected currency for country", userCountry, "is", userCurrency);
      // console.log(countryCurrencyMap.getCountryCurrencyCode())
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
              message: "User with this email already exists",
            });
        }
        if (req.flash) {
          req.flash("error", "A user with this email already exists");
          req.flash("old", req.body || {});
        }
        return res.redirect("/register");
      }
      const existingUserName = await User.findOne({
        where: { username: username.toLowerCase() },
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
          req.flash("old", req.body || {});
        }
        return res.redirect("/register");
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = await User.create({
        fullname,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        country,
        currency: '$',
        gender:  "null",
        phone_number,
        referer: null,
        password: hashedPassword,
        userloginonce: false,
        withdrawalOtp: 1234,
        avatarUrl: "/uploads/avatars/default.png",
        isVerified: false
      });

      await Asset.create({
        username: username.toLowerCase(),
        total_balance: 0,
        profit: 0,
        trade_bonus: 0,
        referal_bonus: 0,
        total_won: 0,
        total_loss: 0,
        total_deposit: 0,
        total_withdrawal: 0,
        total_pendingdeposit: 0,
        total_pendingwithdrawal: 0,
        investment_amount: 0,
        investment_plan: null,
        countingDays: 0,
        investment_status: null,
        investment_date:null

      });

      if (
        req.xhr ||
        (req.headers.accept && req.headers.accept.includes("application/json"))
      ) {
        return res
          .status(201)
          .json({
            success: true,
            message: "User registered successfully",
            user: newUser,
          });
      }
      if (req.flash) {
        req.flash(
          "success",
          "Your account was created successfully. Please Log in."
        );
      }
      // also add a query fallback so the message appears even if session flashes
      return res.redirect("/login?registered=1");
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
          
        );
      } catch (logErr) {
        console.error("Error while logging register failure:", logErr);
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  function requireAuth(req, res, next) {
    try {
      if (!req.session || !req.session.userId) {
        if (
          req.xhr ||
          (req.headers.accept &&
            req.headers.accept.includes("application/json"))
        ) {
          return res
            .status(401)
            .json({ success: false, message: "Access denied. Please log in." });
        }
        return res.redirect("/login");
      }
      return next();
    } catch (err) {
      console.error(
        "Auth requireAuth error:",
        err && err.stack ? err.stack : err
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  async function changePassword(req, res) {
    try {
      const userId = req.session.userId;
      const username = req.body.username;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        req.flash("error", "User not authenticated");
        return res.redirect("/account/user/profile");
      }

      // Validate and change password logic here
      const user = await User.findOne({ where: { username: username } });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        req.flash("error", "Current password is incorrect");
        return res.redirect("/account/user/profile");
      }

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
      req.flash("success", "Password changed successfully");
      return res.redirect("/account/user/profile");
    } catch (err) {
      console.error(
        "Auth changePassword error:",
        err && err.stack ? err.stack : err
      );
      req.flash("error", "Internal server error");
      return res.redirect("/account/user/profile");
    }
  }

  function logout(req, res) {
    try {
      if (!req.session) {
        return res.redirect("/login");
      }
      req.session.destroy((err) => {
        if (err) {
          console.error(
            "Error destroying session during logout:",
            err && err.stack ? err.stack : err
          );
          return res
            .status(500)
            .json({ success: false, message: "Could not log out" });
        }
        res.clearCookie("connect.sid", { path: "/" });
        return res.redirect("/login");
      });
    } catch (err) {
      console.error("Auth logout error:", err && err.stack ? err.stack : err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  const loginHandler = wrapAsync(login);
  const registerHandler = wrapAsync(register);

  return {
    showLogin,
    showRegister,
    login: loginHandler,
    register: registerHandler,
    requireAuth,
    logout,
    changePassword
  };
}
