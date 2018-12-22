import React, {
	FunctionComponent,
	ReactElement,
	Dispatch,
	SetStateAction,
	EffectCallback,
	useState,
	useEffect
} from 'react'

export type ViewComponent<Model> = FunctionComponent<Model>
export type ViewElement = ReactElement<any>

export interface Store<Model> {
	readonly model: Model,
	waitForUpdate(): Promise<Model>
}

export type StoreUpdateHandler<Model> = {
	resolve: (model: Model) => void,
	reject: (err: Error) => void
}

export function waitForUpdate<Model>({ updateHandlers }: {
	updateHandlers: StoreUpdateHandler<Model>[]
}): Promise<Model>{
	return new Promise((resolve, reject) => updateHandlers.push({
		resolve, reject
	}))
}

export function updateStore<Model>({
	model, updateHandlers, error
}: {
	model: Model,
	updateHandlers: StoreUpdateHandler<Model>[],
	error?: Error
}): StoreUpdateHandler<Model>[]  {

	updateHandlers.forEach(_ => error ? _.reject(error) : _.resolve(model))

	return []
}

export type ControllerComponent<Model> = FunctionComponent<{
	View: ViewComponent<Model>,
	store: Store<Model>
}>
export type ControllerElement = ReactElement<any>

export function createControllerEffect<Model>({
	store, setModel, errorHandler, ignoreErrorAfterCleanup
}:{
	store: Store<Model>,
	setModel: Dispatch<SetStateAction<Model>>,
	errorHandler?: (err: Error) => void,
	ignoreErrorAfterCleanup?: boolean
}): EffectCallback {
	return ()=>{
		let cleanedUp = false
		function updateModel(update: Model){
			if(cleanedUp) return;
			setModel(update)
		}

		store.waitForUpdate().then((update) => {
			updateModel(update)
		}).catch((err: Error) => {
			updateModel(store.model)
			if(errorHandler && !ignoreErrorAfterCleanup) {
				errorHandler(err)
			}
		})

		return ()=>{
			cleanedUp = true
		}
	}
}

export function createController<Model>(): ControllerComponent<Model> {
	return function Controller({
		View,
		store
	}: {
		View: ViewComponent<Model>,
		store: Store<Model>
	}): ControllerElement {
		const [model, setModel] = useState(store.model)

		useEffect(
			createControllerEffect({store, setModel})
		)

		return <View {...model}/>
	}
}