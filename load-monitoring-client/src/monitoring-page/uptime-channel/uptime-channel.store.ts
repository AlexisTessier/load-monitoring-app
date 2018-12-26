import EventEmitter from 'events'

import React, { useState, useEffect } from 'react'

import {
	UptimeChannel,
	tryCreateUptimeChannelUpdateEvent
} from './uptime-channel.model'

import { minute } from '../../constants/durations'

export interface UptimeChannelStore {
	model: UptimeChannel,
	source: EventEmitter
}

export function createUptimeChannelStore({
	eventSource
}: {
	eventSource: EventSource
}): UptimeChannelStore {
	const source = new EventEmitter()
	const model: UptimeChannel = {
		updateEvents: []
	}

	eventSource.addEventListener('update', (evt: any) => {
		const message = evt as MessageEvent

		try{
			model.updateEvents.push(
				tryCreateUptimeChannelUpdateEvent(JSON.parse(message.data))
			)
		}
		catch(err){
			throw new Error(
				`Error happened while parsing uptime channel update message:\n\t${err}`
			)
		}

		model.updateEvents = model.updateEvents.filter(_ => (
			Date.now() - _.utcTime < 10 * minute
		))
		.sort(({utcTime: a}, {utcTime: b}) => a > b ? 1 : (a < b ? -1 : 0))

		source.emit('update')
	})

	return {
		model,
		source
	}
}