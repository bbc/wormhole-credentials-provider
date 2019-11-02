const AWS = require("aws-sdk");
const axios = require("axios");

jest.mock("axios");

describe("wormhole-credentials-procvider", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("returns EnvironmentCredentials where set", async () => {
    process.env.AWS_ACCESS_KEY_ID = "ABCDERGHIJKLMNO";
    process.env.AWS_SECRET_ACCESS_KEY =
      "ABCDERGHIJKLMNO89348593495y34985y398y593";
    const provider = require("./index");
    const credentials = await provider.getCredentials();
    console.log("credentials", JSON.stringify(credentials, null, 2));
    expect(credentials).toBeInstanceOf(AWS.EnvironmentCredentials);
  });
  test("getProviders includes ec2 instance credentials when running on AWS", async () => {
    const provider = require("./index");
    const providers = await provider.getProviders();
    console.log("providers", providers);
    expect(providers.length).toBe(5);
  });
});
