import { Store, StoreUpdateHandler, waitForUpdate, updateStore } from '../../mvc'
import {
	NotificationChannel,
	NotificationChannelEvent,
	tryCreateNotificationChannelEvent
} from './notification-channel.model'

import { minute } from '../../constants/durations'

export interface NotificationChannelStore extends Store<NotificationChannel> {}

export function createNotificationChannelStore({
	eventSource
}: {
	eventSource: EventSource
}): NotificationChannelStore {
	let updateHandlers: StoreUpdateHandler<NotificationChannel>[] = []
	let notifyEvents: NotificationChannelEvent[] = []
	let model: NotificationChannel = { notifyEvents }

	const notifyMessagesQueue: MessageEvent[] = []
	eventSource.addEventListener('notify', (evt: any) => {
		notifyMessagesQueue.push(evt)
	})

	setInterval(()=>{
		const errors: Error[] = []
		const needUpdate = notifyMessagesQueue.length > 0
		while(notifyMessagesQueue.length > 0){
			const message = notifyMessagesQueue.pop()
			if(message === undefined) continue

			try{
				notifyEvents.push(
					tryCreateNotificationChannelEvent(JSON.parse(message.data))
				)
			}
			catch(err){
				errors.push(err)
			}
		}

		if(!needUpdate) return

		const error = errors.length > 0 ? new Error(
			`Errors happened while parsing notification channel notify messages:\n\t${errors.join('\n\t')}`
		) : undefined

		notifyEvents = notifyEvents.slice()
		notifyEvents.sort(({utcTime: a}, {utcTime: b}) => a > b ? 1 : (a < b ? -1 : 0))

		model = { notifyEvents }
		
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