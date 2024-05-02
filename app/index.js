const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const router = require("./routers");

const app = express();
require("./helpers/apiDocs")(app);

app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
	bodyParser.urlencoded({
		limit: "50mb",
		extended: true,
		parameterLimit: 50000,
	})
);

// On active le middleware pour gérer les sessions
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

// Repertoire public pour la photo liee a un event
app.use("/pictures/", express.static("./public_pictures/"));

// Middleware Passport.

// On lève la restriction CORS pour nos amis Vue JS
app.use(cors(process.env.CORS_DOMAINS ?? "*"));

// ****************************************************************
// ************** PASSPORT JS CONGFIG *****************************
// ****************************************************************

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./models").User;

app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
			passReqToCallback: true,
			scope: ["profile", "email"],
		},
		async (request, accessToken, refreshToken, profile, done) => {
			try {
				let user = await User.findOne({
					where: { email: profile.emails[0].value },
				});

				if (!user) {
					let fullName = profile.displayName.split(" ");
					let firstName;
					let lastName;

					if (fullName.length > 1) {
						firstName = fullName[0];
						lastName = fullName[1];
					} else {
						firstName = fullName[0];
						lastName = "";
					}

					user = await User.create({
						email: profile.emails[0].value,
						firstname: firstName,
						lastname: lastName,
						provider: "google",
						gender: "nonbinary",
					});
				}

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}
	)
);

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		async (email, password, done) => {
			try {
				User.findOne({ where: { email } }).then((user) => {
					if (!user) {
						return done(null, false, { message: "Invalid Credentials." });
					}

					bcrypt.compare(password, user.password, (err, res) => {
						if (err) {
							return done(err);
						}
						if (res) {
							return done(null, user);
						} else {
							return done(null, false, { message: "Invalid Credentials." });
						}
					});
				});
			} catch (error) {
				return done(error);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findByPk(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});

// ****************************************************************
// ************** END PASSPORT JS CONGFIG *************************
// ****************************************************************

/**
 * Le coeur de l'application c'est la dispatching des requêtes
 */
app.use(router);

module.exports = app;
