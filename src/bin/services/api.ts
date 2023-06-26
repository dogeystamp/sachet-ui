import m from "mithril"
import Mithril from "mithril"

const api = {
	baseUrl: "http://localhost:5000",
	request: async <T>(params: { url: string } & Mithril.RequestOptions<any>): Promise<T> => {
		const oldConfig = params.config
		params.config = (xhr: XMLHttpRequest) => {
			const tok = api.token();
			if (tok !== null) {
				xhr.setRequestHeader("Authorization", "Bearer " + api.token())
			}
			if (oldConfig) {
				oldConfig(xhr, params)
			}
		}

		params.url = api.baseUrl + params.url

		try {
			 return await m.request(params)
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
