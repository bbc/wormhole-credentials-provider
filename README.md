# Wormhole Credentials Provider

this is a credenials provider for the AWS SDK to allows fallback to a call to the wormhole where no other credentials are available.

## usage

add to project (not actually published yet!)

```bash
npm i wormhole-credentials-provider
```

and then do stuff

```javascript
const AWS = require("aws-sdk");
const credentialsProvider = require('./src/index');

credentialsProvider
    .getCredentials()
    .then(credentials => {
        AWS.config.update({ credentials });
        // some useful stuff
    });
```

## todo


1. look at improving method to determine whether execution environment is AWS EC2

[Here is the AWS doc stuff](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CredentialProviderChain.html)
