import m from "mithril"
import Mithril from "mithril"

const api = {
	request: <T>(params: { url: string } & Mithril.RequestOptions<any> ): Promise<T> => {
		params.config = (xhr: XMLHttpRequest) => {
			//xhr.setRequestHeader("Authorization", "Bearer " + api.token())
		}

		try {
			return m.request(params)
		} catch (error) {
			if (error.code == 401)
				m.route.set("/login")

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
