const wormholeClient = require("@bbc/cps-wormhole");
const AWS = require("aws-sdk");
const axios = require("axios");

const isRunningOnAws = async () => {
  try {
    // todo - figure out how reasonable this is - feels bad. Really bad.
    await axios.get("http://169.254.169.254/latest/meta-data", {
      timeout: 3000
    });
    return true;
  } catch (error) {
    return false;
  }
};

const getProviders = async () => {
  const refreshCredentials = async function() {
    const wormholeResponse = await wormholeClient.getCredentials();
    console.log("wormholeresponse", JSON.stringify(wormholeResponse, null, 2));
    self.expireTime = new Date(wormholeResponse.expiration);
    self.expired = false;
    self.accessKeyId = wormholeResponse.accessKeyId;
    self.secretAccessKey = wormholeResponse.secretAccessKey;
    self.sessionToken = wormholeResponse.sessionToken;
  };
  const wormholeCredentialsProvider = async () => {
    try {
      const wormholeResponse = await wormholeClient.getCredentials();
      console.log("worholeresponse", JSON.stringify(wormholeResponse, null, 2));
      const wormholeCredentialsOptions = {
        ...wormholeResponse
      };
      const creds = new AWS.Credentials(wormholeCredentialsOptions);
      creds.expireTime = new Date(wormholeResponse.expiration);
      creds.refresh = refreshCredentials;
      return creds;
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
  return await chain.resolvePromise();
};

module.exports = {
  getCredentials
};
