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
    const wormholeResponse = await wormholeClient.getCredentials();
    // debug left here for mapping todo
    console.log("wormholeResponse", wormholeResponse);
    return new AWS.Credentials(wormholeResponse);
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
