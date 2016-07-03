import { div, img, span, button } from '@cycle/dom'

export default {
	main: (state, actions) => div('.view', [
		button({
			on: {
				click: ev => actions.FETCH.shamefullySendNext()
			}
		}, 'fetch'),
		button({
			on: {
				click: ev => actions.CLEAR.shamefullySendNext()
			}
		}, 'clear'),
		div(state.get('result'))
	])
}
