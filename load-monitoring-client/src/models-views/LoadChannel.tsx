import React from 'react'

export type ModelComponentProps<ModelComponentState, Props> = Props & {
	View: React.ComponentType<ModelComponentState>
}

export interface LoadChannelState {
	name: string
}

export type LoadChannelProps = ModelComponentProps<LoadChannelState, {
	nameSource: string
}>

export class LoadChannel extends React.Component<LoadChannelProps, LoadChannelState> {
	public render(): React.ReactElement<LoadChannelProps> {
		const View = this.props.View

		return <View name={this.props.nameSource} />
	}
}

export function TextView(props: LoadChannelState): React.ReactElement<LoadChannelState> {
	return <div>props.name</div>
}