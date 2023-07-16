import m, { Component } from "mithril";
import { UserList, UserModel } from "../models/User"
import Auth from "../models/Auth";
import { formatDate } from "../services/util";
import api from "../services/api";
import { PermissionWidget } from "../components/PermissionWidget";

const PwChangeSchema = {
	oldPass: "",
	newPass: "",
	username: undefined,
	confirmPass: "",
	error: null,
	get adminChange() {
		if (PwChangeSchema.username === undefined) {
			return false
		}
		return PwChangeSchema.username != Auth.username
	},
	change: async () => {
		if (PwChangeSchema.newPass != PwChangeSchema.confirmPass) {
			PwChangeSchema.error = "Passwords do not match."
			return
		}
		if (PwChangeSchema.adminChange) {
			await api.request({
				url: "/users/" + PwChangeSchema.username, method: "PATCH", body: {
					password: PwChangeSchema.newPass,
				}
			})
		} else {
			try {
				await api.request({
					url: "/users/password", method: "POST", body: {
						old: PwChangeSchema.oldPass,
						new: PwChangeSchema.newPass,
					}
				})
			} catch (e) {
				if (e.code == 403) {
					PwChangeSchema.error = "Incorrect password."
				}
				return
			}
		}
		PwChangeSchema.reset()
		PwChangeSchema.error = "Password changed."
	},
	reset: () => {
		PwChangeSchema.oldPass = ""
		PwChangeSchema.newPass = ""
		PwChangeSchema.confirmPass = ""
	}
}

const PwChangeComp: Component<{ username: string }> = {
	oninit(vnode) {
		PwChangeSchema.username = vnode.attrs.username
	},
	onremove() {
		PwChangeSchema.reset()
		PwChangeSchema.username = undefined
	},
	view: () => {
		return m(".pwchange-form",
			!PwChangeSchema.adminChange && [
				m("label.form-label", "Current password"),
				m("input.form-textbox#curpw[type=password]",
					{
						oninput: (e: Event) => {
							const { target } = e
							if (target) PwChangeSchema.oldPass = (target as HTMLInputElement).value
						},
						onkeypress: async (e: KeyboardEvent) => {
							if (e.key == "Enter") {
								await PwChangeSchema.change()
							}
						},
						value: PwChangeSchema.oldPass
					},
				)],
			m("label.form-label", "New password"),
			m("input.form-textbox#newpw[type=password]",
				{
					oninput: (e: Event) => {
						const { target } = e
						if (target) PwChangeSchema.newPass = (target as HTMLInputElement).value
					},
					onkeypress: async (e: KeyboardEvent) => {
						if (e.key == "Enter") {
							await PwChangeSchema.change()
						}
					},
					value: PwChangeSchema.newPass
				},
			),
			m("label.form-label", "Confirm password"),
			m("input.form-textbox#confpw[type=password]",
				{
					oninput: (e: Event) => {
						const { target } = e
						if (target) PwChangeSchema.confirmPass = (target as HTMLInputElement).value
					},
					onkeypress: async (e: KeyboardEvent) => {
						if (e.key == "Enter") {
							await PwChangeSchema.change()
						}
					},
					value: PwChangeSchema.confirmPass
				},
			),
			m(".form-error", PwChangeSchema.error),
			m("button.form-button", {
				onclick: async () => {
					await PwChangeSchema.change()
				}
			}, "Change password"),
		)
	}
}

export declare namespace PermissionComp {
	interface State {
		flag: {
			changed: boolean
		}
	}
	interface Attrs {
		model: UserModel
	}
}
const PermissionComp: Component<PermissionComp.Attrs, PermissionComp.State> = {
	oninit: (vnode) => {
		vnode.state.flag = { changed: false }
	},
	view: (vnode) => {
		const meta = vnode.attrs.model.meta
		const readonly = !Auth.checkPerm("ADMIN")
		return [
			m("b.field-title", "Permissions: "),
			m(PermissionWidget, {
				perms: meta.permissions,
				readonly: readonly,
				flag: vnode.state.flag,
			}),
			!readonly && m("button.form-button", {
				onclick: async () => {
					await api.request({
						url: `/users/${meta.username}`, method: "PATCH", body: {
							permissions: meta.permissions
						}
					})
					vnode.state.flag.changed = false
					UserList.reload()
				},
				disabled: !vnode.state.flag.changed
			}, "Save permissions")
		]
	}
}

enum ConfirmState {
	Normal,
	AwaitConfirm,
}
export declare namespace UserView {
	interface State {
		model: UserModel
		deleteState: ConfirmState
	}
	interface Attrs {
		username: string
	}
}

const UserView: Component<UserView.Attrs, UserView.State> = {
	oninit: async (vnode) => {
		vnode.state.model = new UserModel(vnode.attrs.username)
		vnode.state.deleteState = ConfirmState.Normal
	},
	onremove: (vnode) => {
		vnode.state.model.reset()
	},
	view: (vnode) => {
		const meta = vnode.state.model.meta

		if (meta === undefined) {
			return
		} else if (meta == null) {
			return [
				m("h2", "Invalid user"),
				m("t", `The user '${vnode.attrs.username}' does not exist.`)
			]
		}

		return [
			m("h2", "User '" + meta.username + "'"),
			m("ul.fields",
				m("li.field",
					m("b.field-title", "Registration: "),
					m("t.field-content", formatDate({ date: meta.register_date }))
				),
				m("li.field",
					m(PermissionComp, { model: vnode.state.model, })
				),
			),
			Auth.username == meta.username && m("button.form-button", {
				onclick: () => {
					Auth.logout()
				}
			}, "Log out"),
			m("h3", "Change password"),
			m(PwChangeComp, { username: meta.username }),
			Auth.checkPerm("ADMIN") &&
			Auth.username != meta.username &&
			m("button.form-button", {
				onclick: async () => {
					switch (vnode.state.deleteState) {
						case ConfirmState.Normal:
							vnode.state.deleteState = ConfirmState.AwaitConfirm
							break
						case ConfirmState.AwaitConfirm:
							await vnode.state.model.delete()
							await UserList.reload()
							m.route.set("/admin")
							break
					}
				}
			}, vnode.state.deleteState == ConfirmState.Normal ?
				"Delete user" : "Really delete?"
			)
		]
	}
}

export default UserView
