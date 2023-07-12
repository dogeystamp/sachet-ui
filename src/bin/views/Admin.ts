import m, { Component } from "mithril"
import UserList from "../components/UserList"
import { PermissionID, PermissionWidget } from "../components/PermissionWidget"
import api from "../services/api"

export declare namespace ServerSettings {
	interface State {
		settings: {
			default_permissions: Set<PermissionID>,
			flag: {
				changed: boolean
			}
		}
		rawSettings: { default_permissions: PermissionID[] }
	}
	interface Attrs { }
}
const ServerSettings: Component<ServerSettings.Attrs, ServerSettings.State> = {
	oninit: async (vnode) => {
		vnode.state.rawSettings = await api.request({ url: "/admin/settings" })
		vnode.state.settings = {
			default_permissions: new Set<PermissionID>(vnode.state.rawSettings.default_permissions),
			flag: {
				changed: false
			},
		}
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
			m(PermissionWidget, {
				perms: vnode.state.settings.default_permissions,
				flag: vnode.state.settings.flag
			}),
			m("button.form-button", {
				onclick: () => {
				},
				disabled: !vnode.state.settings.flag.changed
			}, "Save settings")
		]
	}
}
const AdminView: Component = {
	view: function() {
		return m(".admin", m("h1", "Administration"),
			m("h2", "Users"), m(UserList),
			m("h3", "Create user"),
			m("t", "TODO"),
			//m(ServerSettings),
		)
	}
}

export default AdminView
