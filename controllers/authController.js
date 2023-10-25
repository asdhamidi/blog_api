const passport = require("passport");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findOne({ _id: jwtPayload.user._id });
      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "No such user found." });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

exports.login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(403).json({ message: "Login failed", info });
      }

      req.login(user, { session: false }, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        const tokenUser = {
          _id: user._id,
          username: user.username,
          admin: user.admin,
          member: user.member,
        };

        const token = jwt.sign({ user }, process.env.SECRET_KEY, {
          expiresIn: "1d",
        });

        return res.status(200).json({ tokenUser, token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

exports.register = [
  body("username")
    .trim()
    .isLength({ min: 4 })
    .escape()
    .withMessage("Username must be specified."),

  body("repassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  }),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(403).json({ errors: errors.array() });
    } else {
      try {
        const usernameExists = await User.findOne({
          username: req.body.username,
        });

        if (usernameExists) {
          const errorMessage =
            "Username already exists. Please choose a different username.";
          return res.status(403).json({ message: errorMessage });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          isAdmin: false,
          isMember: false,
          posts: [],
        });
        await user.save();
        return res.status(201).json({ message: "User Registered." });
      } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Error during registration" });
      }
    }
  },
];

exports.logout = (req, res, next) => {
  console.log("logged out");
};
