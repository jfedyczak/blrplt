import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import { makeDOMDriver } from '@cycle/dom'
import Immutable from 'immutable'
import views from './views'
import actionMaps from './actions'
import snabbdom from 'snabbdom'

const main = ({state, actions}) => {
	const stateChanges$ = xs.merge.apply(this, Object.keys(actionMaps).map(a => actions[a].map(actionMaps[a])))
	
	const view$ = state.map(state => views[state.get('view')](state, actions))

	return {
		state: stateChanges$,
		DOM: view$
	}
}

const makeStateDriver = (initialState = {}) => (input$) => {
	const immutableState = Immutable.fromJS(initialState)
	return input$
		.fold((state, changeState) => changeState(state), immutableState)
		.startWith(immutableState)
}

const makeActionsDriver = actions => {
	return () => {
		let a = actions.reduce((observables, key) => {
			observables[key] = xs.create()
			return observables
		}, {})
		return a
	}
}

run(main, {
	DOM: makeDOMDriver("#app", {
		modules: [
			require('snabbdom/modules/props'),
			require('snabbdom/modules/class'),
			require('snabbdom/modules/attributes'),
			require('snabbdom/modules/eventlisteners'),
			require('snabbdom/modules/style')
		]
	}),
	state: makeStateDriver({
		view: 'main',
		loading: false,
		napis: 'test'
	}),
	actions: makeActionsDriver(Object.keys(actionMaps))
})
