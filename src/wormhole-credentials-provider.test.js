const AWS = require("aws-sdk");

describe("wormhole-credentials-procvider", () => {
  test("returns EnvironmentCredentials where set", async () => {
    process.env.AWS_ACCESS_KEY_ID = "ABCDERGHIJKLMNO";
    process.env.AWS_SECRET_ACCESS_KEY =
      "ABCDERGHIJKLMNO89348593495y34985y398y593";
    const provider = require("./index");
    const credentials = await provider.getCredentials();
    console.log("credentials", JSON.stringify(credentials, null, 2));
    expect(credentials).toBeInstanceOf(AWS.EnvironmentCredentials);
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
});
