import { Store, StoreUpdateHandler, waitForUpdate, updateStore } from '../../mvc'
import {
	UptimeChannel,
	UptimeChannelUpdateEvent,
	tryCreateUptimeChannelUpdateEvent
} from './uptime-channel.model'

import { minute } from '../../constants/durations'

export interface UptimeChannelStore extends Store<UptimeChannel> {}

export function createUptimeChannelStore({
	eventSource
}: {
	eventSource: EventSource
}): UptimeChannelStore {
	let updateHandlers: StoreUpdateHandler<UptimeChannel>[] = []
	let updateEvents: UptimeChannelUpdateEvent[] = []
	let model: UptimeChannel = { updateEvents }

	const updateMessagesQueue: MessageEvent[] = []
	eventSource.addEventListener('update', (evt: any) => {
		updateMessagesQueue.push(evt)
	})

	setInterval(()=>{
		const errors: Error[] = []
		const needUpdate = updateMessagesQueue.length > 0
		while(updateMessagesQueue.length > 0){
			const message = updateMessagesQueue.pop()
			if(message === undefined) continue

			try{
				updateEvents.push(
					tryCreateUptimeChannelUpdateEvent(JSON.parse(message.data))
				)
			}
			catch(err){
				errors.push(err)
			}
		}

		if(!needUpdate) return

		const error = errors.length > 0 ? new Error(
			`Errors happened while parsing uptime channel update messages:\n\t${errors.join('\n\t')}`
		) : undefined

		updateEvents = updateEvents.filter(_ => (
			Date.now() - _.utcTime < 10 * minute
		))
		updateEvents.sort(({utcTime: a}, {utcTime: b}) => a > b ? 1 : (a < b ? -1 : 0))

		model = { updateEvents }
		
		updateHandlers = updateStore({model, updateHandlers, error})
	}, 100)

	return {
		get model(){
			return model
		},
		waitForUpdate(){
			return waitForUpdate({updateHandlers})
		}
	}
}