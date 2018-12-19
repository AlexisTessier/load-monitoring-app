# Load Monitoring

## Development environment

### Requirements

+ docker
+ make (optional actually, because you can copy/paste the docker commands in the Makefile)
+ nothing more :)

## Start working

A docker image is available to develop. The following make goal will build that image:

```
make build_dev_image
```

To know what the image contains, look at the dev.Dockerfile (the dev image is built from it).

Then you can run dev containers using the image:

```
make dev_server
```

and

```
make dev_client
```

These will expose the ports (see which ones in top of the Makefile) for accessing the client or the server from your browser while developing.

Eventually, you can do a *make dev_shell* to also run a container based on the dev image but which will not expose the ports (useful if you want to run other yarn commands while yarn start is running yet for example)

## Build the project

```
make build
```

This will:

+ build the dist files in *load-monitoring-client/build* after passing all the tests, in CI environment compatible way.
+ build the whole project... TODO

## Server

The working directory of the *make dev_server* container is *load-monitoring-server*

## Client

The working directory of the *make dev_client* container is *load-monitoring-client*

### Stack

+ React using https://github.com/facebook/create-react-app
+ Typescript
+ Jest for testing

### Install dependencies

```
yarn install
```

### Run dev server

```
yarn start
```

### Run tests and linter

+ **yarn run test:watch** will run the tests in watch mode
+ **yarn run test:coverage** will run the tests and generate a coverage report
+ **yarn run lint** will run tslint on the files
+ **yarn run lint:fix** will fix lint errors when possible
+ **yarn test** will run the test, generate the coverage report and run the linter

### Build the statics

+ **yarn run bundle** will build the statics in *load-monitoring-client/build*
+ **yarn run build** will run the tests and then run the bundle script
+ **yarn run build:ci** same as **yarn run build** but for CI environments