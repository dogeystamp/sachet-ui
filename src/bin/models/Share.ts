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
	pager: new Pager<Share>({ per_page: 12, url: "/files" }),
	list: [] as Share[],
	loadList: async function(page: number = 1) {
		await ShareList.pager.loadPage(page)
		ShareList.list = ShareList.pager.data.map((share: Share) => {
			return validatedPlainToClass(Share, share)
		})
	},
	reload: async function() {
		if (ShareList.pager.loaded === false) {
			await ShareList.loadList(ShareList.pager.page || 1)
		}
		else {
			await ShareList.loadList(ShareList.pager.page)
		}
	},
	async reset() {
		ShareList.list = []
		ShareList.pager.reset()
	}
}

type ShareList = typeof ShareList

export default ShareList

export class ShareModel {
	constructor(shareId: string) {
		this.shareId = shareId
		this.loadMeta()
	}

	shareId: string

	async reset() {
		this.meta = null
		this.data = null
		this.shareId = null
	}
	async loadMeta() {
		try {
			const resp = await api.request<Share>({ url: "/files/" + this.shareId, method: "GET" })
			this.meta = validatedPlainToClass(Share, resp)
		} catch (e) {
			if (e.code == 404) {
				this.meta = null
			} else if (e.code == 403) {
				this.meta = null
			}
		}
		const {range, mime} = await api.request<{range: number, mime: string}>({
			url: "/files/" + this.meta.share_id + "/content",
			method: "HEAD",
			extract: xhr => {
				return {
					range: Number(xhr.getResponseHeader("content-length")),
					mime: xhr.getResponseHeader("content-type"),
				}
			}
		})
		this.size = range
		this.mimeType = mime
		if (this.size < 25e6) {
			await this.dl.start()
		}
		this.loaded = true
	}
	async setLock(state: boolean) {
		await api.request({ url: `/files/${this.shareId}/${state ? "lock" : "unlock"}`, method: "POST" })
		this.meta.locked = state
	}
	async rename(filename: string) {
		await api.request({ url: `/files/${this.shareId}`, method: "PATCH", body: { file_name: filename } })
		this.meta.file_name = filename
	}
	async transferOwner(ownerName: string) {
		await api.request({ url: `/files/${this.shareId}`, method: "PATCH", body: { owner_name: ownerName } })
		this.meta.owner_name = ownerName
	}
	meta: Share
	data: Blob
	size = 0
	mimeType: string
	loaded: boolean
	dl = {
		loaded: 0,
		total: 0,
		status: 0,
		blob: undefined as Blob,
		start: async () => {
			if (this.dl.status != 0) return

			this.dl.blob = await api.request({
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
		},
		open: async () => {
			const blobUrl = window.URL.createObjectURL(this.dl.blob)
			const anchor = document.createElement("a")
			anchor.href = blobUrl
			anchor.download = this.meta.file_name
			anchor.click()
		}
	}
	delete = async function() {
		await api.request({
			url: "/files/" + this.meta.share_id,
			method: "DELETE"
		})
	}
}
