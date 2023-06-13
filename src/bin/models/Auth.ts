import api from "../services/api"

const Auth = {
	login: async ({ username, password }: { username: string, password: string }) => {
		interface LoginRes {
			auth_token: string
		}
		const res: LoginRes = await api.request({
			url: "/users/login", method: "POST", body: {
				"username": username,
				"password": password
			}
		})

		api.token(res.auth_token)

		Auth.username = username
		Auth.authenticated = true
	},
	authenticated: false,
	username: ""
}

export default Auth
