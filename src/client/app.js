import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import { makeDOMDriver, div, button } from '@cycle/dom'
import { makeHTTPDriver } from '@cycle/http'
import Immutable from 'immutable'
import views from './views'
import actionMaps from './actions'
import snabbdom from 'snabbdom'

const main = ({DOM, state, actions, HTTP}) => {
	
	HTTP.response$$.flatten().addListener({
		next: r => {
			actions[r.request.action].shamefullySendNext(r.body)
		},
		error: (e) => {
			console.log(e)
		},
		complete: () => {}
	})
	
	const action$ = xs
		.merge.apply(this, Object.keys(actionMaps).map(a => actions[a].map(actionMaps[a])))
		.map(a => typeof a === 'object' ? a : { state: a })
	
	const stateChanges$ = action$
		.filter(a => 'state' in a)
		.map(a => a.state)
	
	const requests$ = action$
		.filter(a => 'HTTP' in a)
		.map(a => a.HTTP)

	const view$ = state.map(state => views[state.get('view')](state, actions))

	return {
		state: stateChanges$,
		DOM: view$,
		HTTP: requests$
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
	HTTP: makeHTTPDriver(),
	state: makeStateDriver({
		view: 'main',
		result: '---'
	}),
	actions: makeActionsDriver(Object.keys(actionMaps))
})
