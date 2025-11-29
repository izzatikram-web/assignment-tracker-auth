const express = require("express");
const passport = require("passport");

const router = express.Router();

// Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login-failed" }),
  (req, res) => {
    res.redirect("/assignments"); // after login go to dashboard
  }
);

// GitHub login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub callback
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login-failed" }),
  (req, res) => {
    res.redirect("/assignments");
  }
);

// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
