import EventEmitter from 'events'

import React, { useState, useEffect } from 'react'

import {
	NotificationChannel,
	tryCreateNotificationChannelEvent
} from './notification-channel.model'

import { minute } from '../../constants/durations'

export interface NotificationChannelStore {
	model: NotificationChannel,
	source: EventEmitter
}

export function createNotificationChannelStore({
	eventSource
}: {
	eventSource: EventSource
}): NotificationChannelStore {
	const source = new EventEmitter()
	const model: NotificationChannel = {
		notifyEvents: []
	}

	eventSource.addEventListener('notify', (evt: any) => {
		const message = evt as MessageEvent

		try{
			model.notifyEvents.push(
				tryCreateNotificationChannelEvent(JSON.parse(message.data))
			)
		}
		catch(err){
			throw new Error(
				`Error happened while parsing notification channel notify message:\n\t${err}`
			)
		}

		model.notifyEvents = model.notifyEvents.slice()
		.sort(({utcTime: a}, {utcTime: b}) => a > b ? 1 : (a < b ? -1 : 0))

		source.emit('update')
	})

	return {
		model,
		source
	}
}