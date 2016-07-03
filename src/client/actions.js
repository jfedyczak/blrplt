export default {
	RESPONSE_ACTION: body => {
		return {
			state: state => state.set('result', body.test)
		}
	},
	FETCH: () => {
		return {
			state: state => state,
			HTTP: {
				url: "/api/test",
				action: "RESPONSE_ACTION"
			}
		}
	},
	CLEAR: () => state => state.set('result', '---')
}