import m, { Component } from "mithril";
import { User, loadUser } from "../models/User"
import Auth from "../models/Auth";

export declare namespace UserView {
	interface State {
		userData: User
	}
	interface Attrs {
		username: string
	}
}

const UserView: Component<UserView.Attrs, UserView.State> = {
	oninit: async (vnode) => {
		vnode.state.userData = await loadUser(vnode.attrs.username)
	},
	view: (vnode) => {
		if (vnode.state.userData !== undefined) {
			return [
				m("h2", "User '" + vnode.state.userData.username + "'"),
				m("ul.fields",
					m("li.field",
						m("b.field-title", "Registration: "),
						m("t.field-content", vnode.state.userData.register_date.format("D MMM YYYY NN H:m:s (UTC Z)"))
					),
					// TODO: make a better widget for permissions
					m("li.field",
						m("b.field-title", "Permissions: "),
						m("t.field-content", vnode.state.userData.permissions.join(", "))
					),
				),
				Auth.username == vnode.state.userData.username && m("button", {
					onclick: () => {
						Auth.logout()
					}
				}, "Log out")
			]
		}
	}
}

export default UserView
