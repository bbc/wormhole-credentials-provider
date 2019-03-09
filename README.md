# Wormhole Credentials Provider

this is a credenials provider for the AWD SDK to allows fallback to a call to the wormhole when no other credentials are supplied to the SDK.

## usage

add to project

```bash
npm i wormhole-credentials-provider
```

and then do stuff

```javascript
const credentialsProvider = require('./src/index');

credentialsProvider
    .getCredentials()
    .then(creds => {
        console.log('and the credentials are', creds);
    });
```

## todo

lots

1. handle wormhole errors in try / catch
1. map wormhole response to credentials (expiration => expireTime etc)
1. implement refresh method (that should be a call to wormhole with some error handling)
1. look at improving method to determine whether execution environment is AWS EC2
