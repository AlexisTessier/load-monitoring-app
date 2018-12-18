# Load Monitoring

## Development environment

### Requirements

+ make
+ docker
+ nothing more :)

## Start working

A docker image is available to develop. The following make goal will build that image:

```
make build_dev_image
```

To know what the image contains, look at the dev.Dockerfile (the dev image is built from it).

Then you can run a container using the image:

```
make dev
```

This will also expose a port (see which one in top of the Makefile) for accessing the app from your browser while developing.

Eventually, you can do a *make dev_shell* to also run a container based on the dev image but which will not expose the ports (useful if you want to run other yarn commands while yarn start is running yet)

## Build the project

```
make build
```

This will build the dist files in *load-monitoring-client/build* after passing all the tests, in CI environment compatible way.

## Client app

Once your are in the working directory of the dev container:

```
cd load-monitoring-client
```

And you can start to work !!!

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

+ **yarn run test:unit** will run the tests
+ **yarn run test:unit:coverage** will run the tests and generate a coverage report
+ **yarn run lint** will run tslint on the files
+ **yarn run lint:fix** will fix lint errors when possible
+ **yarn test** will run the test, generate the coverage report and run the linter

### Build the statics

+ **yarn run bundle** will build the statics in *load-monitoring-client/build*
+ **yarn run build** will run the tests and then run the bundle script
+ **yarn run build:ci** same as **yarn run build** but for CI environments