import Auth from "../models/Auth"
import api from "./api"
import m from "mithril"

interface PagerArgs {
	per_page: number
	url: string
}

class Pager<T> {
	data: T[] = []
	per_page = 1
	pages: number
	loaded = false

	private _page: number = null
	public get page() {
		return this._page
	}
	public async loadPage(page: number) {
		if (page < 1 || page > this.pages) {
			throw RangeError(`No such page '${page}'.`)
		}

		this._page = page

		const result = await api.request<{ data: T[], pages: number }>({
			method: "GET",
			url: this.url,
			params: {
				"page": this._page,
				"per_page": this.per_page
			}
		})

		this.data = result.data
		this.pages = result.pages
		this.loaded = true
		m.redraw()
	}

	url: string

	constructor(opts: PagerArgs) {
		this.per_page = opts.per_page
		this.url = opts.url
		this.pages = undefined
	}

	async reset() {
		this.loaded = false
		this.data = []
	}
}

export default Pager
