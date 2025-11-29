// passport-config.js
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("./models/User");

function initialize(passport) {
  // Serialize user into session
  passport.serializeUser((user, done) => {
    done(null, user.id); // Mongo _id
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // ===== GOOGLE STRATEGY =====
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({
            provider: "google",
            providerId: profile.id,
          });

          if (existingUser) return done(null, existingUser);

          const newUser = await User.create({
            provider: "google",
            providerId: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value || "",
          });

          done(null, newUser);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  // ===== GITHUB STRATEGY =====
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({
            provider: "github",
            providerId: profile.id,
          });

          if (existingUser) return done(null, existingUser);

          const newUser = await User.create({
            provider: "github",
            providerId: profile.id,
            displayName: profile.username || profile.displayName,
            email: profile.emails?.[0]?.value || "",
          });

          done(null, newUser);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}

module.exports = initialize;
