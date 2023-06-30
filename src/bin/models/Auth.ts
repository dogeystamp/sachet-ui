import api from "../services/api"
import m from "mithril"

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

		Auth.getPerms()
	},
	logout: async () => {
		api.request({
			url: "/users/logout", method: "POST", body: {
				token: api.token()
			}
		})
		api.tokenRemove()
		Auth.username = ""
		Auth.permissions = []
		m.route.set("/login")
	},
	get authenticated() {
		return api.token() !== null
	},
	username: "",
	getPerms: async () => {
		interface WhoamiRes {
			username: string
			permissions: string[]
		}
		const whoamiRes: WhoamiRes = await api.request({
			url: "/whoami", method: "get"
		})
		Auth.username = whoamiRes.username
		Auth.permissions = whoamiRes.permissions
	},
	checkPerm: (perm: string, options: { redirect: boolean } = { redirect: false }) => {
		if (Auth.permissions.includes(perm)) {
			return true
		} else {
			if (options.redirect === true) {
				m.route.set("/login", { next: m.route.get() })
			}
			return false
		}
	},
	permissions: [] as string[]
}

export default Auth
