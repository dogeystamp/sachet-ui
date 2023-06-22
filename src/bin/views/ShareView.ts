import m, { Component } from "mithril";
import { ShareModel } from "../models/Share";
import { formatBytes } from "../services/util";

export declare namespace ShareView {
	interface State {
		model: ShareModel
	}
	interface Attrs {
		fileId: string
	}
}

const ShareView: Component<ShareView.Attrs, ShareView.State> = {
	oninit: async (vnode) => {
		vnode.state.model = new ShareModel(vnode.attrs.fileId)
	},
	view: (vnode) => {
		if (vnode.state.model.meta === undefined) return

		const meta = vnode.state.model.meta
		const dl = vnode.state.model.dl

		if (!vnode.state.model.meta.initialized) {
			return [
				m("h2", "Share '" + meta.file_name + "'"),
				m("t", "Share has not been uploaded yet. Return later once the upload is complete.")
			]
		}

		return [
			m("h2", "Share '" + meta.file_name + "'"),
			m("ul.fields",
				m("li.field",
					m("b.field-title", "Creation date: "),
					m("t.field-content", meta.create_date.format("MMMM Do YYYY, h:mm:ss a"))
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
			dl.status != 0 && m("li.field", `Progress: ${formatBytes(dl.loaded)} / ${formatBytes(dl.total)}`)
		]
	}
}

export default ShareView
