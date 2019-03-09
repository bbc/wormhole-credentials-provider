const credentialsProvider = require("./src/index");

credentialsProvider.getCredentials().then(creds => {
  console.log("and the credentials are", creds);
});
