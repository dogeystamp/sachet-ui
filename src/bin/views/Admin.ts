import m, { Component } from "mithril"
import UserList from "../components/UserList"
import { PermissionID, PermissionWidget } from "../components/PermissionWidget"
import api from "../services/api"

export declare namespace ServerSettings {
	interface State {
		settings: { default_permissions: PermissionID[] }
	}
	interface Attrs { }
}
const ServerSettings: Component<ServerSettings.Attrs, ServerSettings.State> = {
	oninit: async (vnode) => {
		vnode.state.settings = await api.request({ url: "/admin/settings" })
	},
	view: (vnode) => {
		const settings = vnode.state.settings
		if (settings == null) {
			return
		}

		return [
			m("h2", "Settings"),
			m("h3", "Anonymous permissions"),
			m("t", "Allow users that are not logged in to:"),
			m(PermissionWidget, { perms: settings.default_permissions })
		]
	}
}
const AdminView: Component = {
	view: function() {
		return m(".admin", m("h1", "Administration"),
			m("h2", "Users"), m(UserList),
			m("h3", "Create user"),
			m("t", "TODO"),
			// m(ServerSettings),
		)
	}
}

export default AdminView
