require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/conn")
const PORT = process.env.PORT || 6005;
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userSchema")

const clientid = process.env.GOOGLE_CLIENT_ID;
const clientsecret = process.env.GOOGLE_CLIENT_SECRET;

const GitHubStrategy = require("passport-github2").Strategy;


app.use(cors({
    origin: "https://pacman.vzbb.site",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(express.json());
app.set('trust proxy', 1);

// setup session
const MongoStore = require("connect-mongo");

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE,
        collectionName: "sessions",
    }),
cookie: {
    secure: true,
    sameSite: "none",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    // domain: ".vzbb.site"
}

}));


// setuppassport
app.use(passport.initialize());
app.use(passport.session());

function generateRandomUsername(prefix = "Dude") {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random}`;
}

async function generateUniqueUsername() {
    let username;
    let exists = true;

    while (exists) {
        username = generateRandomUsername();
        const user = await userdb.findOne({ username });
        if (!user) {
            exists = false;
        }
    }

    return username;
}

const githubClientID = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

passport.use(
    new GitHubStrategy(
        {
            clientID: githubClientID,
            clientSecret: githubClientSecret,
            callbackURL: "https://pacman-eql8.onrender.com/auth/github/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userdb.findOne({ githubId: profile.id });

                if (!user) {
                    const username = await generateUniqueUsername();
                    user = new userdb({
                        githubId: profile.id,
                        displayName: profile.displayName || profile.username,
                        email: profile.emails?.[0]?.value || "",
                        image: profile.photos?.[0]?.value || "",
                        username: username,
                    });
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);


app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get(
    "/auth/github/callback",
    passport.authenticate("github", {
        successRedirect: "https://pacman.vzbb.site/dashboard",
        failureRedirect: "https://pacman.vzbb.site/login"
    })
);


passport.use(
    new OAuth2Strategy({
            clientID: clientid,
            clientSecret: clientsecret,
            callbackURL: "https://pacman-eql8.onrender.com/auth/google/callback",
            scope: ["profile", "email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userdb.findOne({googleId: profile.id});

                if (!user) {
                    const username = await generateUniqueUsername();

                    user = new userdb({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value,
                        username: username,
                    });

                    await user.save();
                }

                return done(null, user)
            } catch (error) {
                return done(error, null)
            }
        }
    )
)

passport.serializeUser((user, done) => {
    console.log("serialize user id:", user._id);
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userdb.findById(id);
        console.log("deserialize user from DB:", user?.username);
        done(null, user);
    } catch (err) {
        console.error("deserialize error:", err);
        done(err, null);
    }
});



// initial google ouath login
app.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "https://pacman.vzbb.site/dashboard",
    failureRedirect: "https://pacman.vzbb.site/login"
}))

app.get("/login/sucess", async (req, res) => {

    if (req.user) {
        res.status(200).json({message: "user Login", user: req.user})
    } else {
        res.status(400).json({message: "Not Authorized"})
    }
})

app.get("/user/info", async (req, res) => {
    console.log("Session in /user/info:", req.session);
    console.log("req.user in /user/info:", req.user);
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const user = await userdb.findById(req.user._id);
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


app.post("/save-score", async (req, res) => {
    const { score, userId } = req.body;

    try {
        const user = await userdb.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.totalScore = (user.totalScore || 0) + score;
        user.maxScore = Math.max(user.maxScore || 0, score);
        // user.maxLevel = Math.max(user.maxLevel || 0, level);


        await user.save();

        const updatedUser = await userdb.findById(userId);

        res.status(200).json({ message: "Score updated", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/leaderboard", async (req, res) => {
    try {
        const topPlayers = await userdb
            .find({}, "username maxScore totalScore")
            .sort({ maxScore: -1 })
            .limit(10);

        res.status(200).json({ players: topPlayers });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
});


app.put("/update-username", async (req, res) => {
    const { userId, newUsername } = req.body;

    try {
        const cleanedUsername = newUsername.trim();

        if (!cleanedUsername) {
            return res.status(400).json({ message: "Username empty" });
        }
        if (cleanedUsername.length >= 9) {
            return res.status(400).json({ message: "Username > 8" });
        }

        const existingUser = await userdb.findOne({ username: cleanedUsername });

        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ message: "Username taken" });
        }

        const user = await userdb.findByIdAndUpdate(
            userId,
            { username: cleanedUsername },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Username update", user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect("https://pacman.vzbb.site");
    })
})

app.delete("/user/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await userdb.findByIdAndDelete(id);
        res.status(200).json({ message: "Account deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

const path = require('path');

app.listen(PORT, () => {
    console.log(`server start at port no ${PORT}`)
});

