import api from "../services/api";
import { v4 as uuidv4 } from "uuid"

export const UploadSchema = (shareId?: string) => {
	return {
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

			let url = "/files/" + shareId

			const method = shareId === undefined ? "POST" : "PUT"

			if (shareId === undefined) {
				const share = await api.request<{ url: string }>({
					url: "/files",
					method: method,
					body: {
						"file_name": this.file_name
					}
				})
				url = share.url
			}

			const upload_id = uuidv4()

			const body = new FormData()
			body.append("upload", this.file)
			body.append("dzuuid", upload_id)
			body.append("dztotalchunks", "1")
			body.append("dzchunkindex", "0")

			await api.request({
				url: url + "/content",
				method: method,
				body: body
			})

			this.reset()
			this.error = "File uploaded."
		},
		reset: function() {
			this.file = null
			this.file_name = ""
			this.file_path = ""
			this.error = null
		}
	}
}
