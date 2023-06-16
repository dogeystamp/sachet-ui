import api from "../services/api"

const Auth = {
	login: async ({ username, password }: { username: string, password: string }) => {
		interface LoginRes {
			auth_token: string
		}
		const loginRes: LoginRes = await api.request({
			url: "/users/login", method: "POST", body: {
				"username": username,
				"password": password
			}
		})

		api.token(loginRes.auth_token)

		Auth.username = username
		Auth.authenticated = true

		interface WhoamiRes {
			username: string
			permissions: string[]
		}
		const whoamiRes: WhoamiRes = await api.request({
			url: "/whoami", method: "get"
		})
		Auth.permissions = whoamiRes.permissions
	},
	authenticated: false,
	username: "",
	permissions: [] as string[]
}

export default Auth
