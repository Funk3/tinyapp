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

app.post("/login", (req, res) => {
let name = req.body.username
res.cookie("username", `${name}`)
res.redirect('/urls')
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
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
  const templateVars = { username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"]}
  res.render("urls_new", templateVars)
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id
  const templateVars = {username: req.cookies["username"],  id: id, longURL: urlDatabase[id]}
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
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

