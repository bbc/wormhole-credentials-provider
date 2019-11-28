const wormholeClient = require("@bbc/cps-wormhole");
const AWS = require("aws-sdk");
const axios = require("axios");

jest.mock("axios");
jest.mock("@bbc/cps-wormhole");

describe("wormhole-credentials-procvider", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockWormholeResponse = {
    accessKeyId: "foo",
    secretAccessKey: "bar",
    expiration: "2019-11-28T11:53:18.000Z"
  };

  test("getCredentials returns EnvironmentCredentials where set", async () => {
    process.env.AWS_ACCESS_KEY_ID = "ABCDERGHIJKLMNO";
    process.env.AWS_SECRET_ACCESS_KEY =
      "ABCDERGHIJKLMNO89348593495y34985y398y593";
    const provider = require("./index");
    const credentials = await provider.getCredentials();
    expect(credentials).toBeInstanceOf(AWS.EnvironmentCredentials);
  });

  test("getCredentials resolves wormhole credentials provider in absence of any others", async () => {
    process.env = {};
    axios.get.mockRejectedValue({ foo: "bar" });
    wormholeClient.getCredentials.mockResolvedValue(mockWormholeResponse);
    const provider = require("./index");
    const credentials = await provider.getCredentials();
    expect(credentials instanceof AWS.Credentials).toBe(true);
  });

  test("getProviders does not include ec2 instance credentials when not running on AWS", async () => {
    const provider = require("./index");
    axios.get.mockRejectedValue({ foo: "bar" });
    const providers = await provider.getProviders();
    expect(providers.length).toBe(4);
    expect(
      !providers.some(
        provider => provider() instanceof AWS.EC2MetadataCredentials
      )
    ).toBe(true);
  });
  test("getProviders includes ec2 instance credentials when not running on AWS", async () => {
    const provider = require("./index");
    axios.get.mockResolvedValue({ foo: "bar" });
    const providers = await provider.getProviders();
    expect(providers.length).toBe(5);
    expect(
      providers.some(
        provider => provider() instanceof AWS.EC2MetadataCredentials
      )
    ).toBe(true);
  });

  test("refreshCredentials updates credentials obect with response from wormhole", async () => {
    const provider = require("./index");
    const callbackMock = jest.fn();
    const mockCredentials = {};
    wormholeClient.getCredentials.mockResolvedValue(mockWormholeResponse);
    await provider.refreshCredentials(callbackMock, mockCredentials);
    expect(mockCredentials.accessKeyId).toBe("foo");
  });
});
