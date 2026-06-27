const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const usersFile = path.join(__dirname, 'users.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false }
  })
);

function loadUsers() {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, '[]', 'utf8');
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch (error) {
    console.error('Could not read users file, resetting it.');
    fs.writeFileSync(usersFile, '[]', 'utf8');
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
}

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

function validateInput(username, email, password) {
  if (!username || !email || !password) {
    return 'All fields are required.';
  }

  if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username must be 3-20 characters and contain only letters, numbers, or underscores.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  return null;
}

app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const error = validateInput(username, email, password);

  if (error) {
    return res.render('register', { error });
  }

  const users = loadUsers();
  const existingUser = users.find((user) => user.username === username.trim() || user.email === email.trim().toLowerCase());
  if (existingUser) {
    return res.render('register', { error: 'Username or email already exists.' });
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  const newUser = {
    id: users.length + 1,
    username: username.trim(),
    email: email.trim().toLowerCase(),
    passwordHash
  };

  users.push(newUser);
  saveUsers(users);

  res.redirect('/login?registered=1');
});

app.get('/login', (req, res) => {
  const registered = req.query.registered === '1';
  res.render('login', { error: null, success: registered ? 'Registration successful. Please log in.' : null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('login', { error: 'Both username and password are required.', success: null });
  }

  const users = loadUsers();
  const user = users.find((entry) => entry.username === username.trim());
  if (!user) {
    return res.render('login', { error: 'Invalid username or password.', success: null });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.render('login', { error: 'Invalid username or password.', success: null });
  }

  req.session.userId = user.id;
  req.session.username = user.username;
  res.redirect('/dashboard');
});

app.get('/dashboard', requireAuth, (req, res) => {
  const users = loadUsers();
  const user = users.find((entry) => entry.id === req.session.userId);
  if (!user) {
    return res.redirect('/logout');
  }
  res.render('dashboard', { user: { id: user.id, username: user.username, email: user.email } });
});

app.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
});

app.listen(port, () => {
  console.log(`Secure login app running at http://localhost:${port}`);
});
