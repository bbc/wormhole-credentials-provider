const credentialsProvider = require("./index");

credentialsProvider.getCredentials().then(creds => {
  console.log("and the credentials are", creds);
});
