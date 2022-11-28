const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.post("/urls", (req, res) => {
  let longUrl = ""; 
  longUrl += generateRandomString()
  urlDatabase[longUrl] = req.body.longURL; // Log the POST request body to the console
  res.redirect(`/u/:${longUrl}`); // Respond with 'Ok' (we will replace this)
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new")
});

app.get("/u/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: href="#"}
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

