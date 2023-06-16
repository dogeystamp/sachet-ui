import m from "mithril"
import Mithril from "mithril"

const api = {
	request: async <T>(params: { url: string } & Mithril.RequestOptions<any> ): Promise<T> => {
		params.config = (xhr: XMLHttpRequest) => {
			const tok = api.token();
			if (tok !== null) {
				xhr.setRequestHeader("Authorization", "Bearer " + api.token())
			}
		}

		params.url = "http://localhost:5000" + params.url

		try {
			let req: Promise<T> = m.request(params)
			return await req
		} catch (error) {
			if (error.code == 401) {
				m.route.set("/login")
			}

			throw error
		}
	},
	token: (value?: string) => {
		if (value)
			localStorage.setItem("token", value)

		return localStorage.getItem("token")
	},
	tokenRemove: () => localStorage.removeItem("token")
}

export default api
