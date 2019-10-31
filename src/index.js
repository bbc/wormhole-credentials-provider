const wormholeClient = require("@bbc/cps-wormhole");
const AWS = require("aws-sdk");
const axios = require("axios");

const isRunningOnAws = async () => {
  try {
    // todo - figure out how reasonable this is - feels bad. Really bad.
    await axios.get("http://169.254.169.254/latest/meta-data", {
      timeout: 1500
    });
    return true;
  } catch (error) {
    return false;
  }
};

const isRunningInDebugMode = () =>
  process.env.WCP_DEBUG && process.env.WCP_DEBUG === "true";

const getProviders = async () => {
  const refreshCredentials = async function(callback, credentials) {
    try {
      const wormholeResponse = await wormholeClient.getCredentials();
      credentials.expireTime = new Date(wormholeResponse.expiration);
      credentials.expired = false;
      credentials.accessKeyId = wormholeResponse.accessKeyId;
      credentials.secretAccessKey = wormholeResponse.secretAccessKey;
      credentials.sessionToken = wormholeResponse.sessionToken;
      credentials.haveBeenRefreshed = true;
    } catch (e) {
      callback(e.getMessage());
    }
    callback();
  };
  const wormholeCredentialsProvider = async () => {
    try {
      const wormholeResponse = await wormholeClient.getCredentials();
      const credentials = new AWS.Credentials(wormholeResponse);
      let expireDate = new Date(wormholeResponse.expiration);
      if (isRunningInDebugMode()) {
        expireDate.setMinutes(expireDate.getMinutes() - 59);
        console.log("RUNNING IN DEBUG. Expiry set to", expireDate);
      }
      credentials.expireTime = expireDate;
      credentials.refresh = callback =>
        refreshCredentials(callback, credentials);
      return credentials;
    } catch (error) {
      console.log(
        `failed to retrieve wormhole response with error ${error.message}`
      );
      return new AWS.Credentials();
    }
  };
  const sharedIniFileCredentials = () =>
    new AWS.SharedIniFileCredentials("AWS");
  const environmentCredentialsAWS = () => new AWS.EnvironmentCredentials("AWS");
  const environmentCredentialsAMAZON = () =>
    new AWS.EnvironmentCredentials("AMAZON");
  const ec2InstanceCredentials = () =>
    process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI
      ? new AWS.ECSCredentials()
      : new AWS.EC2MetadataCredentials();
  const credentialsProviders = [
    environmentCredentialsAWS,
    environmentCredentialsAMAZON,
    sharedIniFileCredentials
  ];

  if (await isRunningOnAws()) credentialsProviders.push(ec2InstanceCredentials);

  credentialsProviders.push(wormholeCredentialsProvider);

  return credentialsProviders;
};

const getCredentials = async () => {
  const chain = new AWS.CredentialProviderChain(await getProviders());
  const resolvedCredentials = await chain.resolvePromise();
  console.log("resolvedCredentials", resolvedCredentials);
  return resolvedCredentials;
};

module.exports = {
  getCredentials,
  getProviders
};
