# Algodynamic Website

Source for my website at https://www.algodynamic.co.uk

### Status

![Generate and Deploy](https://github.com/planetmarshall/web-algodynamic/workflows/Generate%20and%20deploy%20website/badge.svg)

## Prerequisites

```
pip install -r requirements.txt --upgrade
pip install ./wasm_demo
```

Install [Emscripten](https://emscripten.org/docs/getting_started/downloads.html) to build the WASM Demos

For the C++ Dependencies

```
mkdir -p demos/build
cd demos/build
conan install .. --build outdated
```

## Build WASM Demos

```
mkdir demos/build
cd demos/build
cmake .. -DCMAKE_TOOLCHAIN_FILE=<EMSCRIPTEN>/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake \
         -DCMAKE_INSTALL_PREFIX=../../web/content
cmake --build . 
cmake --build . --target install

```

## Build

```
cd web
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

