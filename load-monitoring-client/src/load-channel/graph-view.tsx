import React from 'react'

import { ViewComponent, ViewElement } from '../utils/model-view'
import { ViewProps } from './model-view'

function EventGraphPoint(props: any){
	return <div>
		timestamp: {props.timestamp}
		<br/>
		load: {props.load}
		<hr/>
	</div>
}

export function GraphView({
	events
}: ViewProps): ViewElement {
	return <div>
		{events.map((event, i) => <EventGraphPoint key={i} {...event}/>)}
	</div>
}