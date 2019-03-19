const wormholeClient = require("@bbc/cps-wormhole");
const AWS = require("aws-sdk");
const axios = require("axios");

const isRunningOnAws = async () => {
  try {
    // todo - figure out how reasonable this is
    await axios.get("http://169.254.169.254/latest/meta-data", {
      timeout: 3000
    });
    return true;
  } catch (error) {
    return false;
  }
};

const getProviders = async () => {
  // this needs a try / catch to deal with the wormhole exploding
  const wormholeCredentialsProvider = async () => {
    try {
      const wormholeResponse = await wormholeClient.getCredentials();
      console.log("wormholeResponse", wormholeResponse);
      const wormholeCredentialsOptions = {
        expireTime: new Date(wormholeResponse.expiration),
        ...wormholeResponse
      };
      return new AWS.Credentials(wormholeCredentialsOptions);
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
