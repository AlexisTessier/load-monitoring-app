import { FunctionComponent, ReactElement } from 'react'

export type ViewComponent<ModelComponentState> = FunctionComponent<ModelComponentState>
export type ViewElement = ReactElement<any>
export type ModelElement = ReactElement<any>
