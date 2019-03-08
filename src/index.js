const wormholeClient = require("@bbc/cps-wormhole");
const AWS = require("aws-sdk");

const configureCredentials = async () => {
  const wormholeCredentialsProvider = async () =>
    new AWS.Credentials(await wormholeClient.getCredentials());
  const sharedIniFileCredentials = () =>
    new AWS.SharedIniFileCredentials("AWS");
  const environmentCredentialsAWS = () => new AWS.EnvironmentCredentials("AWS");
  const environmentCredentialsAMAZON = () =>
    new AWS.EnvironmentCredentials("AMAZON");
  const chain = new AWS.CredentialProviderChain([
    environmentCredentialsAWS,
    environmentCredentialsAMAZON,
    sharedIniFileCredentials,
    wormholeCredentialsProvider
  ]);

  const resolvedCreds = await chain.resolvePromise();
  console.log("resolvedCreds", resolvedCreds);
};

configureCredentials();
