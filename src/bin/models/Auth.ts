import api from "../services/api"

const Auth = {
	login: async (username: string, password: string) => {
		interface LoginRes {
			auth_token: string
		}
		const res: LoginRes = await api.request({url: "/login", method: "POST", body: {
			"username": username,
			"password": password
		}})

		api.token(res.auth_token)
	},
	authenticated: false
}
