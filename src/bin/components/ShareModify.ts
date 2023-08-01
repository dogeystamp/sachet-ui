import m, { Component } from "mithril";
import { Share, ShareModel } from "../models/Share";
import { UploadSchema } from "./Upload";

const ShareModifySchema = {
	filename: "",
	ownerName: undefined,
	flags: {
		changed: false
	},
	error: null,
	reset: () => {
		ShareModifySchema.flags.changed = false
		ShareModifySchema.filename = ""
		ShareModifySchema.ownerName = undefined
		ShareModifySchema.error = null
	},
}

export declare namespace ShareModify {
	interface Attrs {
		model: ShareModel
	}
	interface State {
		uploadSchema: ReturnType<typeof UploadSchema>
	}
}

const ShareModify: Component<ShareModify.Attrs, ShareModify.State> = {
	oninit(vnode) {
		const meta = vnode.attrs.model.meta
		ShareModifySchema.filename = meta.file_name
		ShareModifySchema.ownerName = meta.owner_name
		vnode.state.uploadSchema = UploadSchema(vnode.attrs.model.shareId)
	},
	onremove(vnode) {
		ShareModifySchema.reset()
		vnode.state.uploadSchema.reset()
	},
	view(vnode) {
		const meta = vnode.attrs.model.meta
		const uploadSchema = vnode.state.uploadSchema

		return [
			m("h3", "Modify share"),
			m("label.form-label", "File name"),
			m("input.form-textbox", {
				value: ShareModifySchema.filename,
				oninput(e: Event) {
					const target = e.target as HTMLInputElement
					ShareModifySchema.flags.changed = true
					if (target) {
						ShareModifySchema.filename = target.value
					}
				}
			}),
			m("label.form-label", "Owner user"),
			m("input.form-textbox", {
				value: ShareModifySchema.ownerName,
				oninput(e: Event) {
					const target = e.target as HTMLInputElement
					ShareModifySchema.flags.changed = true
					if (target) {
						ShareModifySchema.ownerName = target.value
					}
				}
			}),
			m("button.form-button", {
				onclick: async () => {
					if (ShareModifySchema.filename != meta.file_name) {
						await vnode.attrs.model.rename(ShareModifySchema.filename)
						ShareModifySchema.filename = meta.file_name
					}
					try {
						if (ShareModifySchema.ownerName != meta.owner_name) {
							await vnode.attrs.model.transferOwner(ShareModifySchema.ownerName)
							ShareModifySchema.ownerName = meta.owner_name
						}
						ShareModifySchema.error = ""
					} catch (e) {
						if (e.code == 400) {
							ShareModifySchema.error = `Could not transfer ownership to user '${ShareModifySchema.ownerName}'.`
							return
						}
						throw e
					}
					ShareModifySchema.flags.changed = false
				},
				disabled: !ShareModifySchema.flags.changed
			}, "Save changes"),
			m("t", ShareModifySchema.error),
			m("h4", "Upload new contents"),
			m("input.form-upload#upload[type=file]", {
				onchange: (e: Event) => {
					const target = e.target as HTMLInputElement
					uploadSchema.file = target.files[0]
					uploadSchema.file_path = target.value
				},
				value: uploadSchema.file_path
			}),
			m("button.form-button#upload-button", {
				onclick: () => {
					uploadSchema.upload()
				},
				disabled: uploadSchema.file_path == ""
			}, "Re-upload"),
		]
	}
}

export default ShareModify
