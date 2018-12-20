import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
	<App name='Load monitoring'/>,
	document.getElementById('root')
)

serviceWorker.register()
