import most from 'most'
import { run } from '@motorcycle/core'
import { makeDOMDriver, h } from '@motorcycle/dom'
import { makeHistoryDriver } from '@motorcycle/history'
import { createHistory } from 'history'

const main = (sources) => {
	// intent
	const history$ = sources.history
	const aClick$ = sources.DOM.select('a').events('click')
	const aClickHref$ = aClick$.map(ev => ev.target.pathname)
	const preventDefault$ = aClick$
	const buttonClick$ = sources.DOM.select('button').events('click')
		.scan((x, y) => x + 1, 0)

	// model
	const state$ = most.combine(
		(h, b) => {
			return { location: h.pathname, counter: b }
		},
		history$,
		buttonClick$
	)

	// view
	const vtree$ = state$.
		map(state => {
			return h('div', [
				h('h1', `Location: ${state.location}`),
				h('ul', [
					h('li', [
						h('a', {attrs: {href:'/'}}, 'main')
					]),
					h('li', [
						h('a', {attrs: {href:'/login'}}, 'sing in')
					]),
				]),
				h('button', '.button', `${state.counter}`)
			])
		})
	return {
		DOM: vtree$,
		history: aClickHref$,
		preventDefault: aClick$
	}
}

const makePreventDefaultDriver = () => (preventDefault$) =>
	preventDefault$.observe(ev => ev.preventDefault())

run(main, {
	DOM: makeDOMDriver("#app"),
	history: makeHistoryDriver(createHistory()),
	preventDefault: makePreventDefaultDriver()
})