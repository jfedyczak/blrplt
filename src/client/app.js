import Rx from 'rx'
import Cycle from '@cycle/core'
import { makeDOMDriver, div, h1, ul, li, a, button } from '@cycle/dom'
import { makeHistoryDriver } from '@cycle/history'
import { useQueries, createHistory } from 'history'

const main = (sources) => {
	const history$ = sources.history
	const aClick$ = sources.DOM.select('a')
		.events('click')
	const aClickHref$ = aClick$
		.map(ev => ev.target.pathname)
	const preventDefault$ = aClick$
	const buttonClick$ = sources.DOM.select('button').events('click')
		.startWith(0)
		.scan((x, y) => x + 1)

	// stan:
	const state$ = history$.combineLatest(
		buttonClick$,
		(h, b) => {
			return {
				gdziejestem: h.pathname,
				licznik: b
			}
		})

	// widok:
	const vtree$ = state$.
		map(stan => {
			return div([
				h1(`Jestem tu: ${stan.gdziejestem}`),
				ul([
					li([
						a({href:'/'}, 'główna')
					]),
					li([
						a({href:'/login'}, 'logowanie')
					]),
				]),
				button('.button', `${stan.licznik}`)
			])
		})
	return {
		DOM: vtree$,
		history: aClickHref$,
		preventDefault: aClick$
	}
}

const makePreventDefaultDriver = () => (preventDefault$) =>
	preventDefault$.subscribe(ev => ev.preventDefault())

Cycle.run(main, {
	DOM: makeDOMDriver("#app"),
	history: makeHistoryDriver(createHistory()),
	preventDefault: makePreventDefaultDriver()
})