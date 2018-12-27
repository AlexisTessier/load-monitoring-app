# Load Monitoring

## What could be improved

See the TODO.md file

## Development environment requirements

+ docker
+ make

## Quick explanation

The project is splitted in 2 parts:

+ **load-monitoring-client** is the front-end web application, which display the monitoring information
+ **load-monitoring-server** is the back-end, which collects the uptime data and send SSE to expose these data to the front-end

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

## Run the app in development mode 

Once the dev image is built, you have to:

+ run the dev_server container 

```
make dev_server
```

+ then in that container, launch the server

```
yarn install (if necessary)
node server.js
```

+ then you have to run the dev_client container


```
make dev_client
```

+ and then in this container, launch the front-end dev server

```
yarn install (if necessary)
yarn start
```

### Stack

+ Front end:
	+ React using https://github.com/facebook/create-react-app
		+ React hooks are available and seem very powerful, so I spent time to figure how to use them in order to make a no class project (just functions components).
	+ Typescript
	+ Jest for testing
	+ Styled components
+ Back end:
	+ Just a dirty javascript

## Front-end scripts

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