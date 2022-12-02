const getUserByEmail = (email, database) => {
for (let key in database){
  if (database[key].email === email){
    return database[key].id;
  }
  
}
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

function generateRandomString() {
  let result      = '';
  const char      = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwyxz1234567890";
  const length    = char.length;

  for (i = 0; i < 6; i++) {
    result += char.charAt(Math.floor(Math.random() * length));
  }
  
  return result;
}

module.exports = {userKey, emailFind, urlsForUser, generateRandomString, getUserByEmail}