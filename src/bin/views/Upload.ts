import m, { Component } from "mithril";
import { UploadSchema } from "../components/Upload";

const uploadSchema = UploadSchema()

const UploadView: Component = {
	view: () => {
		return [
			m("h1", "Upload file"),
			m("label.form-label", "File name"),
			m("input.form-textbox#filename", {
				oninput: (e: Event) => {
					const { target } = e
					if (target) {
						uploadSchema.file_name = (target as HTMLInputElement).value
					}
				},
				value: uploadSchema.file_name
			}),
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
			}, "Upload"),
		]
	}
}

export default UploadView
