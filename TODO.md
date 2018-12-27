#TO DO

+ improve the design of the server part
	+ add typescript to enable easy and safe refactoring
	+ add a test framework
	+ split the server.js in order to make it testable and readable

+ creating a core project with common logic like load alert thresholding...

+ while the front-end can be stopped without losing the history, it's not the back-end case. Because the "persistence" is handled by the SSE history (in memory), if the back-end is stopped, the history will be lost. This could be improved. Some hints:
	+ Maybe using a redis to persist the SSE
	+ Maybe the uptime logs could be stored directly in a file on the monitored host

+ Using PWA features like push notification to notify the user when an alert is sent

+ It seems that the uptime is about the server container and not the host machine
	+ I yet look on how to made the server container accessing to the host uptime but still not sure about that
	+ maybe just a watch directly on the host and then access a log file with the container... (this would avoid having to run node server on the monitored host)

+ using docker to build a all-in-one docker-compose file which would run all necessary services (front + server + redis ?). This docker-compose file could even be the released object

+ improve code coverage