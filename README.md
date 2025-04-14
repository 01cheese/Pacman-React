# onlinePacman

## backend

This repository contains the backend server for our application. The project is built with Node.js, Express, and MongoDB (using Mongoose) and implements user authentication with Passport strategies (Google and GitHub OAuth). The server manages user sessions, score tracking, a leaderboard, and user operations. This README covers everything from setup to running the server and modifying features.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Code Examples](#code-examples)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The backend server is designed to:
- Connect securely to a MongoDB database using Mongoose.
- Handle authentication using Passport with OAuth providers (Google and GitHub).
- Manage user sessions using `express-session` with secure cookie settings.
- Provide endpoints for saving user scores, updating usernames, and handling login/logout operations.
- Serve a leaderboard that displays top players based on their maximum scores.

---

## Features

- **User Authentication:**
  - Google OAuth (via Passport-OAuth2)
  - GitHub OAuth (via Passport-GitHub2)
- **Secure Session Management:**
  - Session creation and validation using `express-session`
  - Secure cookies with proper CORS settings for production
- **Score Tracking and Leaderboard:**
  - Endpoints to save new scores and update cumulative scores
  - Leaderboard endpoint to fetch top players ranked by highest scores
- **User Management:**
  - Get user details, update username, and delete accounts
- **MongoDB Integration:**
  - Database connection and schema definitions using Mongoose

---

## Technologies Used

- **[Node.js](https://nodejs.org/)**
- **[Express](https://expressjs.com/)**
- **[MongoDB](https://www.mongodb.com/)** and **[Mongoose](https://mongoosejs.com/)**
- **[Passport](http://www.passportjs.org/)** (with Google and GitHub strategies)
- **[express-session](https://www.npmjs.com/package/express-session)**
- **[CORS](https://www.npmjs.com/package/cors)**
- **[dotenv](https://www.npmjs.com/package/dotenv)**

---

## Installation

### 1. Clone the Repository

Clone this repository using Git:

```bash
git clone <repository_url>
cd <repository_folder>
```

### 2. Install Dependencies

Make sure you have Node.js and npm installed. Then install the project dependencies:

```bash
npm install
```

---

## Environment Configuration

The application uses environment variables to manage configuration details and sensitive credentials. Create a `.env` file in the root directory with the following content:

```env
PORT=6005
DATABASE=<your_mongodb_connection_string>
SESSION_SECRET=<your_session_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GITHUB_CLIENT_ID=<your_github_client_id>
GITHUB_CLIENT_SECRET=<your_github_client_secret>
```

Placeholders such as `<your_mongodb_connection_string>` must be replaced with the actual values.

The main configuration is loaded at the beginning of the entry script using:

```javascript
require("dotenv").config();
```

This ensures that all environment variables are accessible throughout the project.

---

## Usage

After setting up your environment variables and installing dependencies, start the server with the following command:

```bash
npm start
```

Your server will run on the port defined in your `.env` file (default is 6005). You can then access the API endpoints via:

```
http://localhost:6005
```

---

## API Endpoints

Below is a summary of the main API endpoints available in this backend server.

### Authentication

- **GitHub OAuth**
  - **Initiate:**  
    `GET /auth/github`  
    _Starts the GitHub OAuth process._
    
  - **Callback:**  
    `GET /auth/github/callback`  
    _Handles the callback from GitHub and redirects on successful login._

- **Google OAuth**
  - **Initiate:**  
    `GET /auth/google`  
    _Starts the Google OAuth process._
    
  - **Callback:**  
    `GET /auth/google/callback`  
    _Handles the callback from Google and redirects on successful login._

- **Login Success Endpoint**
  - **Endpoint:**  
    `GET /login/sucess`  
    _Returns a JSON object with the user details if logged in._

### User and Score Management

- **Get User Info**
  - **Endpoint:**  
    `GET /user/info`  
    _Returns detailed information about the authenticated user._

- **Save Score**
  - **Endpoint:**  
    `POST /save-score`  
    _Accepts a score value in the request body and updates the user's score information. Example request body:_
    
    ```json
    {
      "score": 150,
      "userId": "609e129e8673c2b1d8a4f123"
    }
    ```

- **Leaderboard**
  - **Endpoint:**  
    `GET /leaderboard`  
    _Retrieves and returns the top 10 players sorted by their maximum score._

- **Update Username**
  - **Endpoint:**  
    `PUT /update-username`  
    _Allows the user to update their username by sending the user ID and the new username. Example request body:_
    
    ```json
    {
      "userId": "609e129e8673c2b1d8a4f123",
      "newUsername": "CoolUser"
    }
    ```

- **User Logout**
  - **Endpoint:**  
    `GET /logout`  
    _Logs the user out and redirects them to the homepage._

- **Delete User**
  - **Endpoint:**  
    `DELETE /user/delete/:id`  
    _Deletes the user account corresponding to the given ID._

---

## Code Examples

Below are some code snippets demonstrating key parts of the backend functionality.

### Express Server Setup (app.js)

```javascript
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/conn");
const session = require("express-session");
const passport = require("passport");

app.use(cors({
    origin: ["https://yourclient.domain"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());
app.set('trust proxy', 1);

// Setup session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: "none"
    }
}));

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
```

### User Schema (userSchema.js)

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: String,
    githubId: String,
    displayName: String,
    email: String,
    image: String,
    maxScore: Number,
    totalScore: Number,
    username: { type: String, unique: true },
}, { timestamps: true });

const userdb = mongoose.model("users", userSchema);

module.exports = userdb;
```

### MongoDB Connection (conn.js)

```javascript
const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => {
    console.log("Database connected");
})
.catch(err => {
    console.log("Error connecting to database:", err);
});
```

### Authentication Strategy (Excerpt from app.js)

```javascript
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const userdb = require("./model/userSchema");

// Google OAuth strategy
passport.use(new OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    // Process user login and registration
    try {
        let user = await userdb.findOne({ googleId: profile.id });
        if (!user) {
            user = new userdb({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value,
                username: await generateUniqueUsername()
            });
            await user.save();
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
```

---

## File Structure

A quick glance at the main files in the repository:

```
/project-root
├── app.js                # Main server file that sets up Express, Passport, and all routes
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Dependency lock file
├── userSchema.js         # Mongoose schema for user data
├── conn.js               # MongoDB connection script
├── .env                  # Environment configuration file (not committed)
└── README.md             # This file
```

Each file plays a specific role in ensuring the application runs smoothly and maintains secure authentication and data management.
