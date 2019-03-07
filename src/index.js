const wormholeClient = require("@bbc/cps-wormhole");
const AWS = require("aws-sdk");

const configureCredentials = async () => {
  const awsCredentialsProvider = async () =>
    new AWS.Credentials(await wormholeClient.getCredentials());
  console.log({ awsCredentialsProvider });
  const chain = new AWS.CredentialProviderChain();
  chain.providers.push(awsCredentialsProvider);
  console.log(chain.providers);
  const credentials = await chain.resolvePromise();
  console.log("resolved credentials", credentials);
};

configureCredentials();
