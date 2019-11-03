const wormholeClient = require("@bbc/cps-wormhole");
const AWS = require("aws-sdk");
const axios = require("axios");

jest.mock("axios");
jest.mock("@bbc/cps-wormhole");

describe("wormhole-credentials-procvider", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  xtest("returns EnvironmentCredentials where set", async () => {
    process.env.AWS_ACCESS_KEY_ID = "ABCDERGHIJKLMNO";
    process.env.AWS_SECRET_ACCESS_KEY =
      "ABCDERGHIJKLMNO89348593495y34985y398y593";
    const provider = require("./index");
    const credentials = await provider.getCredentials();
    console.log("credentials", JSON.stringify(credentials, null, 2));
    expect(credentials).toBeInstanceOf(AWS.EnvironmentCredentials);
  });
  xtest("resolves wormhole credentials provider in absence of any others", async () => {
    process.env = {};
    axios.get.mockResolvedValue(Error("foo"));
    wormholeClient.getCredentials.mockResolvedValue({
      AWS_ACCESS_KEY_ID: "foo",
      AWS_SECRET_ACCESS_KEY: "bar"
    });
    const provider = require("./index");
    const credentials = await provider.getCredentials();
    console.log("providers", credentials);
  });

  xtest("getProviders includes ec2 instance credentials when running on AWS", async () => {
    const provider = require("./index");
    const providers = await provider.getProviders();
    console.log("providers", providers);
    expect(providers.length).toBe(5);
  });
  test("getProviders does not include ec2 instance credentials when not running on AWS", async () => {
    const provider = require("./index");
    axios.get = () => new Error("foo");
    const providers = await provider.getProviders();
    console.log("providers", providers);
    expect(providers.length).toBe(4);
  });
});
