import m, { Component } from "mithril";
import ShareList, { ShareModel } from "../models/Share";
import { formatBytes, formatDate } from "../services/util";
import Auth from "../models/Auth";
import ShareModify from "../components/ShareModify";

enum ConfirmState {
	Normal,
	AwaitConfirm,
}

export declare namespace ShareView {
	interface State {
		model: ShareModel
		delete: ConfirmState
	}
	interface Attrs {
		fileId: string
	}
}

const ShareView: Component<ShareView.Attrs, ShareView.State> = {
	oninit: async (vnode) => {
		vnode.state.model = new ShareModel(vnode.attrs.fileId)
		vnode.state.delete = ConfirmState.Normal
	},
	onremove: async (vnode) => {
		vnode.state.model.reset()
	},
	view: (vnode) => {
		const meta = vnode.state.model.meta
		const dl = vnode.state.model.dl

		if (!Auth.checkPerm("READ")) {
			return [
				m("h2", "Permission denied"),
				m("p", "You do not have the permission to read this share. Contact an administrator for more details.")
			]
		}

		if (meta === undefined) {
			return
		} else if (meta == null) {
			return [
				m("h2", "Invalid share"),
				m("t", "This share does not exist.")
			]
		}

		const deleteButton =
			Auth.permissions.includes("DELETE") &&
			!meta.locked &&
			m("button.form-button", {
				onclick: async () => {
					switch (vnode.state.delete) {
						case ConfirmState.Normal:
							vnode.state.delete = ConfirmState.AwaitConfirm
							break
						case ConfirmState.AwaitConfirm:
							await vnode.state.model.delete()
							await ShareList.reload()
							m.route.set("/files")
							break
					}
				}
			}, vnode.state.delete == ConfirmState.Normal ?
				"Delete share" : "Really delete?"
			)

		if (!vnode.state.model.meta.initialized) {
			return [
				m("h2", "Share '" + meta.file_name + "'"),
				m("t", "Share has not been uploaded yet. Return later once the upload is complete."),
				deleteButton
			]
		}

		return [
			m("h2", "Share '" + meta.file_name + "'"),
			m("ul.fields",
				m("li.field",
					m("b.field-title", "Creation date: "),
					m("t.field-content", formatDate({ date: meta.create_date }))
				),
				m("li.field",
					m("b.field-title", "Owner: "),
					m("t.field-content", meta.owner_name || "[Anonymous]")
				),
				m("li.field",
					m("b.field-title", "Locked: "),
					m("t.field-content", meta.locked ? "Yes" : "No")
				),
				m("li.field",
					m("b.field-title", "Size: "),
					m("t.field-content", formatBytes(vnode.state.model.size))
				),
			),
			m("button.form-button", {
				onclick: async () => {
					dl.start()
				}
			}, "Download"),
			dl.status != 0 && m("li.field", `Progress: ${formatBytes(dl.loaded)} / ${formatBytes(dl.total)}`),
			deleteButton,
			Auth.checkPerm("LOCK") &&
			m("button.form-button", {
				onclick: () => {
					vnode.state.model.setLock(!meta.locked)
				}
			}, meta.locked ? "Unlock" : "Lock"),
			Auth.checkPerm("MODIFY") && !meta.locked && Auth.username == meta.owner_name &&
			m(ShareModify, { model: vnode.state.model })
		]
	}
}

export default ShareView
