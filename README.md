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

## running in debug

this will force a refresh once a minute

```bash
 WCP_DEBUG=true node src/example.js 
```

## todo

1. look at improving method to determine whether execution environment is AWS EC2
1. TESTS!
1. check how we determine whether we are running in a lambda
1. add a build script
1. remove example
1. move to the BBC organisation
1. publish
1. itegrate with one of our services which has a long-running process
1. can we return the credentials provider array and set that in AWS config?

[Here is the AWS doc stuff](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CredentialProviderChain.html)
