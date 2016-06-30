import { div, img, span, button } from '@cycle/dom'

export default {
	main: (state, actions) => div('.view', [
		button({
			on: {
				click: ev => actions.BUTTON_CLICK.shamefullySendNext()
			}
		}, 'push me')
	]),
	second: (state, actions) => div('.view', [
		button({
			on: {
				click: ev => actions.BUTTON_CLICK2.shamefullySendNext()
			}
		}, 'push me 2')
	])
}
