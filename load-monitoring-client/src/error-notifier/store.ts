import { Store, StoreUpdateHandler, waitForUpdate, updateStore } from '../mvc'
import { ErrorNotifier } from './model'

export interface ErrorNotifierStore extends Store<ErrorNotifier> {
	notify(error: Error): void,
	removeNotification(error: Error): void
}

export function createErrorNotifierStore(): ErrorNotifierStore {
	let updateHandlers: StoreUpdateHandler<ErrorNotifier>[] = []
	let errors: Error[] = []
	let model: ErrorNotifier = { errors }
	const yetHandledErrors = new WeakSet<Error>();

	function updateModel(error?: Error){
		model = { errors }

		updateHandlers = updateStore(model, updateHandlers, error)
	}

	return {
		get model(){ return model },
		waitForUpdate(){ return waitForUpdate(updateHandlers) },
		notify(error: Error){
			if(!yetHandledErrors.has(error)){
				errors.push(error)
				yetHandledErrors.add(error)

				updateModel()
			}
		},
		removeNotification(error: Error){
			let updateError: Error | undefined
			if(!yetHandledErrors.has(error)){
				updateError = new Error(`Trying to remove an inexistent error notification ${error}`)
			}
			else{
				errors = errors.filter(_ => !Object.is(_, error))
			}

			updateModel(updateError)
		}
	}
}