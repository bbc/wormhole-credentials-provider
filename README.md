# Wormhole Credentials Provider

Credenials provider for the AWS SDK which will fallback to the wormhole where no other credentials are available.

## usage

add to project (not actually published yet!)

```bash
yarn i wormhole-credentials-provider
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
2. check how we determine whether we are running in a lambda
3. add a build script
4. remove example
5. move to the BBC organisation
6. publish
7. itegrate with one of our services which has a long-running process
8. can we return the credentials provider array and set that in AWS config?
9. proxy support
10. swap out axios for a BBC shaped http client

[Here is the AWS doc stuff](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CredentialProviderChain.html)
