const express       = require("express");
const cookieSession = require('cookie-session');
const bcrypt        = require("bcryptjs");

const {userKey, emailFind, urlsForUser, generateRandomString} = require("./helpers");

const app   = express();
const PORT  = 8080; 

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"]
}));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  }
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: "123",
  }
};

//
//POST
//
app.post("/register", (req, res) => {
  let id = "";
  id += generateRandomString();
  req.session.user_id = id;

  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password);
  const foundEmail = emailFind(email, users);
  
  if (email === "" || password === "") {
    res.sendStatus(400);
  };
  if (foundEmail === email) {
    res.sendStatus(400);
  };
  
  users[id] = {id, email, hashedPassword};
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = userKey(req.body.email, users);
  const userPassword = users[userID].hashedPassword;
  const foundEmail = emailFind(email, users);

  if (foundEmail !== email) {
    return res.sendStatus(403);
  };
  if (bcrypt.compareSync(password, userPassword) === false) {
    return res.sendStatus(403);
  };

  req.session.user_id = userID;
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/urls/:id/delete", (req, res) => {
  const cookie = req.session.user_id;
  const id     = req.params.id;
  
  if (!cookie) {
    res.sendStatus(403);
  };
  if (urlDatabase[id].userID !== cookie){
    res.sendStatus(403);
  };

  delete urlDatabase[id];
  res.redirect('/urls');
});

app.post("/urls/:id/submit", (req, res) => {
  const cookie = req.session.user_id;
  const id     = req.params.id;

  if (!cookie) {
    res.sendStatus(403);
  };
  if (urlDatabase[id].userID !== cookie){
    res.sendStatus(403);
  };

  urlDatabase[id].longURL = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const user = req.session.user_id;
  let shortURL = generateRandomString();

  if (!user) {
    res.send("You cannot make a longUrl unless you are logged in");
  };

  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: user};
  res.redirect(`/urls/${shortURL}`);
});

//
//GET
//

app.get("/", (req, res) => {
  const cookie = req.session.user_id;

  if (cookie === undefined) {
    res.redirect("/login");
  } else {
  res.redirect("/urls");
  };
});

app.get("/urls", (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  const templateVars = { user: user, urls: urlsForUser(id, urlDatabase)};

  if (id === undefined) {
    res.sendStatus(403);
  } else {
    res.render("urls_index", templateVars)};
});

app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  const templateVars = {user: user};
  
  if (!id) {
    res.render("login", templateVars);
  };

  res.render("urls_new", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id
  const URL = urlDatabase[id].longURL

  res.redirect(`${URL}`)
})

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const userID = req.session.user_id;
  const user = users[userID];
  const templateVars = {user: user,  id: id, urls: urlDatabase};
  
  if (userID === undefined){
    res.sendStatus(403);
  };
  if (!urlDatabase[id]) {
    res.send("That id does not exist");
  };
  if (urlDatabase[id]["userID"] !== userID){
    res.sendStatus(403);
  };

  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const id = req.params.id;
  const userID = req.session.user_id;
  const user = users[userID];
  const templateVars = {user: user, id: id, url: urlDatabase};

  if (!userID) {
    res.render("urls_register", templateVars);
  } else {
    res.redirect('/urls');
  };
});

app.get("/login", (req, res) => {
  const id = req.params.id;
  const userID = req.session.user_id;
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


