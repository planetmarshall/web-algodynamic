# Algodynamic Website

Source for my website at https://www.algodynamic.co.uk

## Prerequisites

```
pip install -r requirements.txt --upgrade
pip install ./wasm_demo
```

## Build

```
cd algodynamic
invoke build
```

## Local testing

```
cd algodynamic
invoke livereload
```

## Publish

```
cd algodynamic
invoke publish
```

Publishing happens automatically on pushes to the master branch. This requires AWS S3 credentials to be correctly
configured. See 
 * [Github Actions Encrypted Secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets)
 * [Boto3 Credentials](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html)

