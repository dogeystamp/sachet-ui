import m, { Component } from "mithril";
import api from "../services/api";
import { v4 as uuidv4 } from "uuid"

const UploadSchema = {
	file_name: "",

	error: null as string,

	_file: null as File,
	get file() {
		return this._file;
	},
	set file(value: File) {
		this._file = value;
		if (value) {
			this.file_name = value.name
		}
	},

	file_path: "",

	upload: async function() {
		if (this.file == null) {
			this.error = "No file selected."
			return
		}

		const share = await api.request<{ url: string }>({
			url: "/files",
			method: "POST",
			body: {
				"file_name": this.file_name
			}
		})

		const upload_id = uuidv4()

		const body = new FormData()
		body.append("upload", this.file)
		body.append("dzuuid", upload_id)
		body.append("dztotalchunks", "1")
		body.append("dzchunkindex", "0")

		await api.request({
			url: share.url + "/content",
			method: "POST",
			body: body
		})

		this.error = "File uploaded."
		this.file_name = ""
		this.file = null
		this.file_path = ""
	},
}

const UploadView: Component = {
	view: () => {
		return [
			m("h1", "Upload file"),
			m("label.form-label", "File name"),
			m("input.form-textbox#filename", {
				oninput: (e: Event) => {
					const { target } = e
					if (target) {
						UploadSchema.file_name = (target as HTMLInputElement).value
					}
				},
				value: UploadSchema.file_name
			}),
			m("input.form-upload#upload[type=file]", {
				onchange: (e: Event) => {
					const target = e.target as HTMLInputElement
					UploadSchema.file = target.files[0]
					UploadSchema.file_path = target.value
				},
				value: UploadSchema.file_path
			}),
			m("button.form-button#upload-button", {
				onclick: () => {
					UploadSchema.upload()
				}
			}, "Upload"),
		]
	}
}

export default UploadView
