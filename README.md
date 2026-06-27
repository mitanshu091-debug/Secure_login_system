# Secure Login System

A modern and secure authentication web app built with Node.js, Express, EJS, bcryptjs, and express-session.

## ✨ Overview
This project provides a simple but secure login system with:
- user registration
- secure password hashing with bcrypt
- input validation
- session-based authentication
- logout functionality
- a clean user interface

## 🛡️ Security Features
- Passwords are never stored in plain text
- Password hashing is handled with bcrypt
- Sessions are managed securely with express-session
- Basic validation protects against malformed input

## 📁 Project Structure
- [app.js](app.js) — main server logic and routes
- [package.json](package.json) — dependencies and scripts
- [views/login.ejs](views/login.ejs) — login page UI
- [views/register.ejs](views/register.ejs) — registration page UI
- [views/dashboard.ejs](views/dashboard.ejs) — protected dashboard UI
- [public/styles.css](public/styles.css) — styling for the app
- [users.json](users.json) — local user data storage

## 🧱 Build Order
1. Create the project files and package setup
2. Build the Express server in [app.js](app.js)
3. Create the EJS views in [views](views)
4. Add styling in [public/styles.css](public/styles.css)
5. Install dependencies with `npm install`
6. Start the app using `npm start`

## ▶️ Run Locally
1. Install Node.js and npm
2. Open the project folder
3. Run `npm install`
4. Run `npm start`
5. Open your browser at `http://localhost:3000`

## 🔒 Security Notes
- Use a strong `SESSION_SECRET` in production
- Deploy the app over HTTPS
- Consider adding 2FA in the future
- Keep your dependencies updated regularly

