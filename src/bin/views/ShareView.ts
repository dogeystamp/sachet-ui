import m, { Component } from "mithril";
import { Share, loadShare } from "../models/Share";
import api from "../services/api";

export declare namespace ShareView {
	interface State {
		shareData: Share
		dl: {
			loaded: Number
			total: Number
			status: Number
		}
	}
	interface Attrs {
		fileId: string
	}
}

const ShareView: Component<ShareView.Attrs, ShareView.State> = {
	oninit: async (vnode) => {
		vnode.state.shareData = await loadShare(vnode.attrs.fileId)
		vnode.state.dl = { loaded: 0, total: 0, status: 0 }
	},
	view: (vnode) => {
		if (!vnode.state.shareData) return

		const data = vnode.state.shareData
		const dl = vnode.state.dl

		return [
			m("h2", "Share '" + data.file_name + "'"),
			m("ul.fields",
				m("li.field",
					m("b.field-title", "Creation date: "),
					m("t.field-content", data.create_date.format("MMMM Do YYYY, h:mm:ss a"))
				),
				m("li.field",
					m("b.field-title", "Owner: "),
					m("t.field-content", data.owner_name || "[Anonymous]")
				),
				m("li.field",
					m("b.field-title", "Locked: "),
					m("t.field-content", data.locked ? "Yes" : "No")
				),
			),
			m("button.form-button", {
				onclick: async () => {
					if (dl.status != 0) return

					const blob: Blob = await api.request({
						url: "/files/" + data.share_id + "/content",
						responseType: "blob",
						extract: xhr => xhr.response,
						config: xhr => {
							xhr.timeout = 20000
							xhr.onprogress = e => {
								dl.status = xhr.status
								dl.loaded = e.loaded
								dl.total = e.total
								console.log("AAHAAAH AH AH AH")
								m.redraw()
							}
						}
					})
					const blobUrl = window.URL.createObjectURL(
						new File([blob], data.file_name, { type: blob.type })
					)
					window.open(blobUrl, "_blank").focus()
				}
			}, "Download"),
			dl.status != 0 && m("li.field", `Progress: ${dl.loaded} / ${dl.total}`)
		]
	}
}

export default ShareView
