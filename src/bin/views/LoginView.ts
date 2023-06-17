import m, { Component } from "mithril"
import Auth from "../models/Auth"

const LoginSchema = {
	username: "",
	password: "",
	error: null,
	login: async () => {
		try {
			await Auth.login({ username: LoginSchema.username, password: LoginSchema.password })
			LoginSchema.password = ""
			LoginSchema.username = ""
			LoginSchema.error = null
			m.route.set("/")
		} catch (error) {
			if (error.code == 401) {
				LoginSchema.error = "Invalid credentials."
				return
			}
			throw error
		}
	}
}

const LoginView: Component = {
	view: () => {
		if (Auth.authenticated) {
			m.route.set("/")
		}

		return m(".login-box",
			m(".login-form",
				m("h2", "Login"),
				m("label.form-label", "Username"),
				m("input.form-textbox#username", {
					oninput: (e: Event) => {
						const { target } = e
						if (target) LoginSchema.username = (target as HTMLInputElement).value
					},
					onkeypress: (e: KeyboardEvent) => {
						if (e.key == "Enter") {
							LoginSchema.login()
						}
					},
				}),
				m("label.form-label", "Password"),
				m("input.form-textbox#password[type=password]", {
					oninput: (e: Event) => {
						const { target } = e
						if (target) LoginSchema.password = (target as HTMLInputElement).value
					},
					onkeypress: (e: KeyboardEvent) => {
						if (e.key == "Enter") {
							LoginSchema.login()
						}
					},
				}),
				m("button.form-button", {
					onclick: async () => {
						LoginSchema.login()
					}
				}, "Log in"),
				m(".form-error", LoginSchema.error),
			)
		)
	}
}

export default LoginView
