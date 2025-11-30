// passport-config.js
const baseURL = process.env.BASE_URL || "http://localhost:3000";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("./models/User");

function initialize(passport) {
  // Serialize user into session (store Mongo _id)
  passport.serializeUser((user, done) => {
    done(null, user.id);
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
        // now we force it to use the URL from env
        callbackURL: BASE_URL=http://localhost:3000/auth/google/callback ,

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
       
        callbackURL: http://localhost:3000/auth/github/callback

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
