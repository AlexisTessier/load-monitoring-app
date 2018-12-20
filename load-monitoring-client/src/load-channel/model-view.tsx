import React, { useState } from 'react'

import { ModelElement, ViewComponent } from '../utils/model-view'

import { LoadChannelEvent, LoadChannelService } from './service'

export interface ViewProps {
	events: LoadChannelEvent[]
}

export function LoadChannel({
	View,
	loadChannel
}: {
	View: ViewComponent<ViewProps>,
	loadChannel: LoadChannelService
}): ModelElement {
	const [ events, setEvents ] = useState(loadChannel.events)

	loadChannel.onNextUpdate(()=>{
		setEvents(loadChannel.events)
	})

	return <View {...{
		events
	}}/>
}