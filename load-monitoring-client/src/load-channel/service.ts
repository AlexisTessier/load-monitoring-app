export interface LoadChannelEvent {
	timestamp: number,
	load: number
}

export type NextUpdateListener = () => void

export interface LoadChannelService {
	onNextUpdate(listener: NextUpdateListener): void,
	readonly events: LoadChannelEvent[]
}

const second = 1000
const minute = 60 * second

export function MakeLoadChannelService(eventSource: EventSource): LoadChannelService {
	const calledNextUpdateListeners = new WeakSet<NextUpdateListener>()
	let nextUpdateListeners: NextUpdateListener[] = []
	let events: LoadChannelEvent[] = []
	let needUpdate = true

	eventSource.addEventListener('update', (evt: any) => {
		const message: MessageEvent = evt

		try{
			const event = JSON.parse(message.data)
			events = [...events, event].filter(event => (
				Date.now() - event.timestamp < 10 * minute
			))
			needUpdate = true
		}
		catch{
			console.error('Error parsing message from load channel')
		}
	})

	setInterval(()=>{
		if(needUpdate){
			nextUpdateListeners = nextUpdateListeners.filter(listener => !calledNextUpdateListeners.has(listener))
			nextUpdateListeners.forEach(listener => {
				listener()
				calledNextUpdateListeners.add(listener)
			})
			needUpdate = false
		}
	}, 1000)

	return {
		onNextUpdate(listener: NextUpdateListener): void {
			nextUpdateListeners.push(listener)
		},
		get events(){ return events }
	}
}