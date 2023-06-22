import { f, validatedPlainToClass } from "@marcj/marshal"
import "reflect-metadata"
import "moment"
import Pager from "../services/pagination";
import api from "../services/api";
import m from "mithril"

export class Share {
	@f.primary().uuid()
	share_id: string;
	@f.moment()
	create_date: moment.Moment
	@f
	locked: boolean
	@f
	owner_name: string
	@f
	file_name: string
	@f
	initialized: boolean
}

const ShareList = {
	page: new Pager<Share>({ per_page: 3, url: "/files" }),
	list: [] as Share[],
	loadList: async function(page: number = 1) {
		await ShareList.page.loadPage(page)
		ShareList.list = ShareList.page.data.map((share: Share) => {
			return validatedPlainToClass(Share, share)
		})
	}
}

type ShareList = typeof ShareList

export default ShareList

export class ShareModel {
	constructor(shareId: string) {
		this.loadMeta(shareId)
	}
	loadMeta = async (shareId: string) => {
		const resp = await api.request<Share>({ url: "/files/" + shareId, method: "GET" })
		this.meta = validatedPlainToClass(Share, resp)
	}
	meta: Share
	data: Blob
	dl = {
		loaded: 0,
		total: 0,
		status: 0,
		start: async () => {
			if (this.dl.status != 0) return

			const blob: Blob = await api.request({
				url: "/files/" + this.meta.share_id + "/content",
				responseType: "blob",
				extract: xhr => xhr.response,
				config: xhr => {
					xhr.timeout = 0
					xhr.onprogress = e => {
						this.dl.status = xhr.status
						this.dl.loaded = e.loaded
						this.dl.total = e.total
						m.redraw()
					}
				}
			})
			const blobUrl = window.URL.createObjectURL(blob)
			const anchor = document.createElement("a")
			anchor.href = blobUrl
			anchor.download = this.meta.file_name
			anchor.click()
		}
	}
}
