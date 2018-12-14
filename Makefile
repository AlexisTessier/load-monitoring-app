SHELL=/bin/bash

DEV_DIRECTORY ?= $(shell pwd)

DEV_IMAGE_NAME = load-motinoring
DEV_IMAGE_VERSION = 0.0.1
DEV_IMAGE_TAG = ${DEV_IMAGE_NAME}:${DEV_IMAGE_VERSION}

build_dev_image::
	docker build --tag=${DEV_IMAGE_TAG} ./

dev::
	docker run -it --rm \
	-v ${DEV_DIRECTORY}:/root/dev \
	-w /root/dev \
	${DEV_IMAGE_TAG} ${SHELL}