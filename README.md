# Wormhole Credentials Provider

Credenials provider for the AWS SDK which will fallback to the wormhole where no other credentials are available.

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
1. check how we determine whether we are running in a lambda
1. add debug based on env var for local dev
1. add a build script
1. remove example
1. publish
1. itegrate with one our JS services


[Here is the AWS doc stuff](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CredentialProviderChain.html)
