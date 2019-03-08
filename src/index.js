const wormholeClient = require("@bbc/cps-wormhole");
const AWS = require("aws-sdk");

const foundCredentials = async (error, credentials) => {
  if (error) return new Error(err);
  if (credentials.then) {
    credentials.then(resolvedCredentials => {
      return console.log(
        "the first valid credentials we found were",
        resolvedCredentials
      );
    });
  } else {
    console.log("the first valid credentials we found were", credentials);
  }
};

const configureCredentials = async () => {
  const awsCredentialsProvider = async () =>
    new AWS.Credentials(await wormholeClient.getCredentials());
  const environemtnCredentialsAWS = () => new AWS.EnvironmentCredentials("AWS");
  const environemtnCredentialsAMAZON = () =>
    new AWS.EnvironmentCredentials("AMAZON");
  console.log({
    awsCredentialsProvider
  });
  const chain = new AWS.CredentialProviderChain([
    environemtnCredentialsAWS,
    environemtnCredentialsAMAZON,
    awsCredentialsProvider
  ]);
  console.log(chain.providers);
  const resolvedCreds = await chain.resolvePromise(foundCredentials);
  console.log("resolvedCreds", resolvedCreds);
};

configureCredentials();
