SHELL=/bin/bash

DEV_DIRECTORY ?= $(shell pwd)

DEV_IMAGE_NAME = load-monitoring-dev
DEV_IMAGE_VERSION = 1.0.0
DEV_IMAGE_TAG = ${DEV_IMAGE_NAME}:${DEV_IMAGE_VERSION}

DEV_CLIENT_PORT ?= 3006

build_dev_image:
	docker build \
	-f ./dev.Dockerfile \
	--tag=${DEV_IMAGE_TAG} ./

dev:
	docker run -it --rm \
	-v ${DEV_DIRECTORY}:/root/dev \
	-w /root/dev \
	-e CLIENT_PORT=${DEV_CLIENT_PORT} \
	--expose ${DEV_CLIENT_PORT} \
	-p ${DEV_CLIENT_PORT}:${DEV_CLIENT_PORT} \
	${DEV_IMAGE_TAG} ${SHELL}

dev_shell:
	docker run -it --rm \
	-v ${DEV_DIRECTORY}:/root/dev \
	-w /root/dev \
	${DEV_IMAGE_TAG} ${SHELL}

build:
	docker run -it --rm \
	-v ${DEV_DIRECTORY}:/root/build \
	-w /root/build/load-monitoring-client \
	${DEV_IMAGE_TAG} ${SHELL} -c "yarn run build:ci"