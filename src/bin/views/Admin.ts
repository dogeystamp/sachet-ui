import m, { Component } from "mithril"
import UserList from "../components/UserList"
import { PermissionID, PermissionWidget } from "../components/PermissionWidget"
import api from "../services/api"

interface SerializedSettings {
	default_permissions: PermissionID[]
}

const SettingsModel = {
	init: async function() {
		const serialized: SerializedSettings = await api.request({ url: "/admin/settings" })
		SettingsModel.default_permissions = new Set(serialized.default_permissions)
		SettingsModel.initialized = true
	},
	save: async function() {
		const serialized: SerializedSettings = {
			default_permissions: Array.from(SettingsModel.default_permissions.values())
		}
		await api.request({ url: "/admin/settings", method: "PATCH", body: serialized })
		SettingsModel.flag.changed = false
	},

	default_permissions: null as Set<PermissionID>,
	flag: {
		changed: false,
	},
	initialized: false,
}

const ServerSettings: Component = {
	oncreate: async (vnode) => {
		await SettingsModel.init()
	},
	view: (vnode) => {
		if (!SettingsModel.initialized) {
			return
		}

		return [
			m("h2", "Settings"),
			m("h3", "Anonymous permissions"),
			m("t", "Allow users that are not logged in to:"),
			m(PermissionWidget, {
				perms: SettingsModel.default_permissions,
				flag: SettingsModel.flag
			}),
			m("button.form-button", {
				onclick: async () => {
					await SettingsModel.save()
				},
				disabled: !SettingsModel.flag.changed
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
			m(ServerSettings),
		)
	}
}

export default AdminView
