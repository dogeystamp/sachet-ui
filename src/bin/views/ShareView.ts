import m, { Component } from "mithril";
import ShareList, { ShareModel } from "../models/Share";
import { formatBytes, formatDate } from "../services/util";
import Auth from "../models/Auth";

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
	view: (vnode) => {

		const meta = vnode.state.model.meta
		const dl = vnode.state.model.dl

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
			),
			m("button.form-button", {
				onclick: async () => {
					dl.start()
				}
			}, "Download"),
			dl.status != 0 && m("li.field", `Progress: ${formatBytes(dl.loaded)} / ${formatBytes(dl.total)}`),
			deleteButton,
		]
	}
}

export default ShareView
