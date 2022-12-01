const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
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
  let email = req.body.email;
  let password = req.body.password;
  if (email === "" || password === ""){
      res.sendStatus(400)
  }
  let foundEmail = emailFind(email)
  if(foundEmail === req.body.email){
    res.sendStatus(400)
  }
  res.cookie("user_id", id)
  users[id] = {id, email, password};
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  let userID = userKey(req.body.email);
  res.cookie("user_id", userID)
  res.redirect('/urls')
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls")
});

app.post("/urls/:id/delete", (req, res) => {
  const name = req.params.id;
  delete urlDatabase[name];
  res.redirect('/urls')
});

app.post("/urls/:id/submit", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect("/urls")
});

app.post("/urls", (req, res) => {
  let longUrl = ""; 
  longUrl += generateRandomString()
  urlDatabase[longUrl] = req.body.longURL; // Log the POST request body to the console
  res.redirect(`/u/${longUrl}`); 
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let id = req.cookies["user_id"]
  const user = users[id]
  const templateVars = { user: user, urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let id = req.cookies["user_id"]
  const user = users[id]
  const templateVars = {user: user}
  res.render("urls_new", templateVars)
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id
  let userID = req.cookies["user_id"]
  const user = users[userID]
  const templateVars = {user: user,  id: id, longURL: urlDatabase[id]}
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const id = req.params.id
  let userID = req.cookies["user_id"]
  const user = users[userID]
  const templateVars = {user: user,  id: id, longURL: urlDatabase[id]}
  res.render("urls_register", templateVars)
});

app.get("/urls.json", (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString() {
  let result      = '';
  const char      = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwyxz1234567890" 
  const length    = char.length

  for (i = 0; i < 6; i++) {
    result += char.charAt(Math.floor(Math.random() * length));
  }
  
  return result;
};

function userKey(email) {
  for (let key in users) {
    if (users[key].email === email) {
      return users[key].id
    }
  }
}

function emailFind(email) {
  for (let key in users) {
    if (users[key].email === email) {
      return users[key].email
    }
  }
}
