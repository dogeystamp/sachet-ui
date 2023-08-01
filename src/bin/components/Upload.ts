import api from "../services/api";
import { v4 as uuidv4 } from "uuid"

export const UploadSchema = () => {
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
}
