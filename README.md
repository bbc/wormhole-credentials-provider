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

## AWS Account number

export the account number for the your credendials

```bash
export AWS_ACCOUNT_NUMBER=1234567890
```


### Certificates

If you have a .pem

```bash
export CERT_LOCATION=/path/to/your/combined/dev/cert.pem
```

If you have a .p12

```bash
export CERT_LOCATION=/path/to/your/combined/dev/cert.p12
export CERT_PASSPHRASE=my_password
```

If you have an unencrypted .crt

```bash
export CERT_LOCATION=/path/to/your/dev/cert.crt
export CERT_KEY=/path/to/your/combined/dev/cert_key.key
```

If the none of the above are found, the [default service certificate](https://confluence.dev.bbc.co.uk/display/platform/SSL+Certificates) locations will be used. This is useful if you are using this on an Cosmos launched EC2.

These are:

```bash
/etc/pki/tls/certs/client.crt
/etc/pki/tls/private/client.key
```

## How do I change the AWS region ?

CPS Wormhole will look for the `AWS_REGION` environment variable. If it's not found, it will default to `eu-west-1`. Export the region you want if it differs from the default.

## What is Wormhole and how do I get access?

Wormhole provides temporary credentials that can be used with Amazon’s AWS SDKs and APIs. The In the absence of other credentials types, this credentials provider will attempt to retrieve credentials Wormhole which are then used SDK calls.

You can access the wormhole docs [here](https://wormhole.api.bbci.co.uk/docs/guides.getting_access_to_an_account.html).

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
