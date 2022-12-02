const userKey = (email, users) => {
  for (let key in users) {
    if (users[key].email === email) {
      return users[key].id;
    }
  }
};

const emailFind = (email, users) => {
  for (let key in users) {
    if (users[key].email === email) {
      return users[key].email;
    }
  }
};

const urlsForUser = (id, database) => {
  let userURL = {};
  for (let url in database) {
    if (id === database[url].userID) {
      userURL[url] = { longURL: database[url].longURL, userID: id };
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
};


//test code required by test file
const getUserByEmail = (email, database) => {
  for (let key in database){
    if (database[key].email === email){
      return database[key].id;
    }
  }
};

module.exports = {userKey, emailFind, urlsForUser, generateRandomString, getUserByEmail}