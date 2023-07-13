import m, { Component } from "mithril"
import UserListComp from "../components/UserList"
import { PermissionWidget } from "../components/PermissionWidget"
import api from "../services/api"
import { UserList } from "../models/User"
import { PermissionID } from "../models/Auth"

const UserCreateSchema = {
	error: "",
	username: "",
	password: "",
	confirmPassword: "",
	permissions: [] as PermissionID[],
	create: async function() {
		if (this.confirmPassword != this.password) {
			this.error = "Passwords do not match."
			return
		}
		await api.request({
			url: "/users", method: "POST", body: {
				username: this.username,
				password: this.password,
				permissions: this.permissions
			}
		})
		this.username = ""
		this.password = ""
		this.confirmPassword = ""
		this.permissions = []
		this.error = "User created."
		UserList.reload()
		m.redraw()
	}
}

const UserCreate: Component = {
	view: () => {
		return m(".usercreate-form",
			m("label.form-label", "Username"),
			m("input.form-textbox#username", {
				oninput: (e: Event) => {
					const { target } = e
					if (target) UserCreateSchema.username = (target as HTMLInputElement).value
				},
				value: UserCreateSchema.username,
			}),
			m("label.form-label", "Password"),
			m("input.form-textbox[type=password]#password", {
				oninput: (e: Event) => {
					const { target } = e
					if (target) UserCreateSchema.password = (target as HTMLInputElement).value
				},
				value: UserCreateSchema.password,
			}),
			m("label.form-label", "Confirm password"),
			m("input.form-textbox[type=password]#password-confirm", {
				oninput: (e: Event) => {
					const { target } = e
					if (target) UserCreateSchema.confirmPassword = (target as HTMLInputElement).value
				},
				value: UserCreateSchema.confirmPassword,
			}),
			m("label.form-label", "Permissions"),
			m(PermissionWidget, {
				perms: UserCreateSchema.permissions,
			}),
			m("button.form-button", {
				onclick: async () => {
					await UserCreateSchema.create()
				},
			}, "Create user"),
			m(".form-error", UserCreateSchema.error)
		)
	}
}

interface SerializedSettings {
	default_permissions: PermissionID[]
}

const SettingsModel = {
	init: async function() {
		const serialized: SerializedSettings = await api.request({ url: "/admin/settings" })
		SettingsModel.default_permissions = serialized.default_permissions
		SettingsModel.initialized = true
	},
	save: async function() {
		const serialized: SerializedSettings = {
			default_permissions: SettingsModel.default_permissions
		}
		await api.request({ url: "/admin/settings", method: "PATCH", body: serialized })
		SettingsModel.flag.changed = false
	},

	default_permissions: null as PermissionID[],
	flag: {
		changed: false,
	},
	initialized: false,
}

const ServerSettings: Component = {
	oncreate: async () => {
		await SettingsModel.init()
	},
	view: () => {
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
			m("h2", "Users"), m(UserListComp),
			m("h3", "Create user"),
			m(UserCreate),
			m(ServerSettings),
		)
	}
}

export default AdminView
