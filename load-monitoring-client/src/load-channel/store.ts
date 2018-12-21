import { Store, StoreUpdateHandler, waitForUpdate, updateStore } from '../mvc'
import { LoadChannel, LoadChannelEvent, tryCreateLoadChannelEvent } from './model'

const second = 1000
const minute = 60 * second

export interface LoadChannelStore extends Store<LoadChannel> {}

export function createLoadChannelStore(eventSource: EventSource): LoadChannelStore {
	let updateHandlers: StoreUpdateHandler<LoadChannel>[] = []
	let events: LoadChannelEvent[] = []
	let model: LoadChannel = { events }

	const updateMessageQueue: MessageEvent[] = []
	eventSource.addEventListener('update', (evt: any) => {
		updateMessageQueue.push(evt)
	})

	setInterval(()=>{
		const errors: Error[] = []
		const needUpdate = updateMessageQueue.length > 0
		while(updateMessageQueue.length > 0){
			const message = updateMessageQueue.pop()
			if(message === undefined) continue

			try{
				events.push(tryCreateLoadChannelEvent(JSON.parse(message.data)))
			}
			catch(err){
				errors.push(err)
			}
		}

		if(!needUpdate) return

		const error = errors.length > 0 ? new Error(
			`Errors happened while parsing load channel update messages:\n\t${errors.join('\n\t')}`
		) : undefined

		events = events.filter(event => (
			Date.now() - event.timestamp < 10 * minute
		))
		events.sort(({timestamp: a}, {timestamp: b}) => a > b ? 1 : (a < b ? -1 : 0))

		model = { events }
		
		updateHandlers = updateStore(model, updateHandlers, error)
	}, 100)

	return {
		get model(){
			return model
		},
		waitForUpdate(){
			return waitForUpdate(updateHandlers)
		}
	}
}