import multer from 'multer';
import path from 'path';
import wrapAsync from '../utils/wrapAsync.js';

export default function createProfileController({ User }) {
  // if needed, fetch user data and pass to template
 


  async function profile(req, res) {

     const userId = req.session?.userId ?? null;
     let user = req.session.username;
    try {
      // let user = null;
      if (userId != null) {
        try {
          user = await User.findByPk(userId);
        } catch (err) {
          console.error(
            "Profile DB lookup error:",
            err && err.stack ? err.stack : err
          );
          // continue and render page without user data
          user = null;
        }
      }
      return res.render("dash_view/profile.ejs", {
        user,
        page_name: "dashboard",
      });
    } catch (err) {
      console.error(
        "Profile controller error:",
        err && err.stack ? err.stack : err
      );
      req.flash("error", "Internal server error");
      return res.redirect("/account/user/profile"); // or redirect to a specific page
    }
  }

  async function changeAvatar(req, res) {
    try {
      const userId = req.session?.userId ?? null;
      let user = req.session.username;

      if (userId != null) {
        try {
          user = await User.findByPk(userId);
        } catch (err) {
          console.error(
            "Change Avatar DB lookup error:",
            err && err.stack ? err.stack : err
          );
          user = null;
        }
      }

      return res.render("dash_view/change_avatar.ejs", {
        user,
        page_name: "dashboard",
      });
    } catch (err) {
      console.error(
        "Change Avatar controller error:",
        err && err.stack ? err.stack : err
      );
      req.flash("error", "Internal server error");
      return res.redirect("/account/user/profile"); // or redirect to a specific page
    }
  }

  // // POST handler to edit profile after password check
  // async function editProfile(req, res) {
  //   try {
  //     const userId = req.session?.userId;
  //     const username = req.session?.username;
  //     if (!userId) {
  //       req.flash('error', 'User not authenticated');
  //       return res.redirect('/account/user/profile');
  //     }
  //     const { fullname, email, country, currency, gender, phone_number, withdrawalOtp, password, newPassword } = req.body;
  //     const user = await User.findOne({ where: { username } });
  //     if (!user) {
  //       req.flash('error', 'User not found');
  //       return res.redirect('/account/user/profile');
  //     }
  //     // Check password
  //     const bcrypt = await import('bcryptjs');
  //     const match = await bcrypt.compare(password, user.password);
  //     if (!match) {
  //       req.flash('error', 'Incorrect password');
  //       return res.redirect('/account/user/profile');
  //     }
  //     // Prepare update fields
  //     const updateFields = { fullname, email, country, currency, gender, withdrawalOtp, phone_number };
  //     if (newPassword) {
  //       updateFields.password = await bcrypt.hash(newPassword, 12);
  //     }
  //     await User.update(updateFields, { where: { id: userId } });
  //     req.flash('success', 'Profile updated successfully');
  //     return res.redirect('/account/user/profile');
  //   } catch (err) {
  //     console.error('Edit profile error:', err);
  //     req.flash('error', 'Internal server error');
  //     return res.redirect('/account/user/profile');
  //   }
  // }

  // Controller to handle avatar upload with try/catch

  async function uploadAvatarHandler(req, res) {
    try {
      // const username = req.body.username;

      // const ext = req.file.originalname.slice(
      //   req.file.originalname.lastIndexOf(".")
      // );

      //create the uploads directory if it doesn't exist
      const fs = await import("fs");
      if (!fs.existsSync("./uploads/avatars")) {
        fs.mkdirSync("./uploads/avatars", { recursive: true });
      }

      if (!req.file) {
        req.flash("error", "No file uploaded");
        return res.redirect("/profile");
      }
      const newAvatarUrl = "/uploads/avatars/" + req.file.filename;
      // Ensure username is available
      const username =
        req.user?.username || req.session?.user?.username || req.body.username;
      if (!username) {
        req.flash("error", "User not found");
        return res.status(400).json({ error: "User not found" });
      }
      await User.update({ avatarUrl: newAvatarUrl }, { where: { username } });
      req.flash("success", "Avatar updated successfully");
      req.session.avatarUrl = newAvatarUrl;
      // Fetch updated user and pass to view so avatarUrl is always present
      let updatedUser;
      try {
        updatedUser = await User.findOne({ where: { username } });
      } catch (err) {
        console.error("Error fetching updated user after avatar upload:", err);
      }
      // Render change avatar view with updated user object
      return res.render("dash_view/account/user/dash_index.ejs", {
        user: updatedUser,
        page_name: "dashboard",
      });
    } catch (err) {
      console.error("Avatar upload error:", err && err.stack ? err.stack : err);
      req.flash("error", "Internal server error");
      res.redirect("/account/user/changeavatar");
    }
  }

  const profileHandler = wrapAsync(profile);
  // const handleUploadAvatar = wrapAsync(uploadAvatar);

  return {
    profile: profileHandler,
    changeAvatar,
    newAvatar: uploadAvatarHandler,
    // editProfile
  };
}
