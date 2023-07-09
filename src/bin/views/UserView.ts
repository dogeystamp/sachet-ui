import m, { Component } from "mithril";
import { UserList, UserModel } from "../models/User"
import Auth from "../models/Auth";
import { formatDate } from "../services/util";
import api from "../services/api";

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

const PwChangeSchema = {
	oldPass: "",
	newPass: "",
	confirmPass: "",
	error: null,
	change: async () => {
		if (PwChangeSchema.newPass != PwChangeSchema.confirmPass) {
			PwChangeSchema.error = "Passwords do not match."
			return
		}
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
		PwChangeSchema.oldPass = ""
		PwChangeSchema.newPass = ""
		PwChangeSchema.confirmPass = ""
		PwChangeSchema.error = "Password changed."
	}
}

const PwChangeComp: Component = {
	view: () => {
		return m(".pwchange-form",
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
			),
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

const UserView: Component<UserView.Attrs, UserView.State> = {
	oninit: async (vnode) => {
		vnode.state.model = new UserModel(vnode.attrs.username)
		vnode.state.deleteState = ConfirmState.Normal
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
				// TODO: make a better widget for permissions
				m("li.field",
					m("b.field-title", "Permissions: "),
					m("t.field-content", meta.permissions.join(", "))
				),
			),
			Auth.username == meta.username && m("button.form-button", {
				onclick: () => {
					Auth.logout()
				}
			}, "Log out"),
			m("h3", "Change password"),
			Auth.username == meta.username ?
				m(PwChangeComp) :
				m("t", "Sorry, admins can't change passwords yet..."),
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
