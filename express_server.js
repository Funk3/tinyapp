const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs")

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"]
}));
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: "123",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.post("/register", (req, res) => {
  let id = "";
  id += generateRandomString();
  req.session.user_id = id;
  let email = req.body.email;
  let password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password);
  if (email === "" || password === "") {
    res.sendStatus(400);
  }
  let foundEmail = emailFind(email);
  if (foundEmail === req.body.email) {
    res.sendStatus(400);
  }
  users[id] = {id, email, hashedPassword};
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  let userID = userKey(req.body.email);
  let email = req.body.email;
  let password = req.body.password;
  let userPassword = users[userID].hashedPassword 
  if (emailFind(email) !== email) {
    return res.sendStatus(403);
  }
  if (bcrypt.compareSync(password, userPassword) === false) {
    return res.sendStatus(403);
  }
  req.session.user_id = userID;
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.post("/urls/:id/delete", (req, res) => {
  const cookie = req.session.user_id;
  const id     = req.params.id;
  if (!cookie) {
    res.sendStatus(403)
  } 
  if (urlDatabase[id].userID !== cookie){
    res.sendStatus(403)
  }
  delete urlDatabase[id];
  res.redirect('/urls');
});

app.post("/urls/:id/submit", (req, res) => {
  const cookie = req.session.user_id;
  const id     = req.params.id;
  if (!cookie) {
    res.sendStatus(403)
  } 
  if (urlDatabase[id].userID !== cookie){
    res.sendStatus(403)
  }
  urlDatabase[id].longURL = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let user = req.session.user_id;
  if (!user) {
    res.send("You cannot make a longUrl unless you are logged in");
  }
  let shortURLstring = generateRandomString();
  urlDatabase[shortURLstring] = {longURL: req.body.longURL, userID: user};
  res.redirect(`/urls/${shortURLstring}`);
});

app.get("/", (req, res) => {
  let cookie = req.session.user_id;
  if (cookie === undefined) {
    res.redirect("/login")
  } else {
  res.redirect("/urls");
  }
});

app.get("/urls", (req, res) => {
  let id = req.session.user_id;
  const user = users[id];
  const templateVars = { user: user, urls: urlsForUser(id)};
  if (id === undefined) {
    res.sendStatus(403)
  } else {
    res.render("urls_index", templateVars)};
});

app.get("/urls/new", (req, res) => {
  let id = req.session.user_id;
  const user = users[id];
  const templateVars = {user: user};
  if (!id) {
    res.render("login", templateVars);
  }
  res.render("urls_new", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id
  const longURL = urlDatabase[id].longURL
  res.redirect(longURL)
})

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  let userID = req.session.user_id;
  const user = users[userID];
  const templateVars = {user: user,  id: id, urls: urlDatabase};
  if (userID === undefined){
    res.sendStatus(403)
  }
  if (!urlDatabase[id]) {
    res.send("That id does not exist");
  }
  if (urlDatabase[id]["userID"] !== userID){
    res.sendStatus(403)
  }
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const id = req.params.id;
  let userID = req.session.user_id;
  const user = users[userID];
  const templateVars = {user: user, id: id, url: urlDatabase};
  if (!userID) {
    res.render("urls_register", templateVars);
  } else {
    res.redirect('/urls');
  }

});

app.get("/login", (req, res) => {
  const id = req.params.id;
  let userID = req.session.user_id;
  const user = users[userID];
  const templateVars = {user: user, id: id, url: urlDatabase};
  res.render('login', templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString() {
  let result      = '';
  const char      = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwyxz1234567890";
  const length    = char.length;

  for (i = 0; i < 6; i++) {
    result += char.charAt(Math.floor(Math.random() * length));
  }
  
  return result;
}

const userKey = (email) => {
  for (let key in users) {
    if (users[key].email === email) {
      return users[key].id;
    }
  }
}


const emailFind = (email) => {
  for (let key in users) {
    if (users[key].email === email) {
      return users[key].email;
    }
  }
}

const urlsForUser = (id) => {
  let userURL = {};
  for (let url in urlDatabase) {
    if (id === urlDatabase[url].userID) {
      userURL[url] = { longURL: urlDatabase[url].longURL, userID: id };
    }
  }
  return userURL;
};

