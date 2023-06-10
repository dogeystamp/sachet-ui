import api from "./api"

interface PagerArgs {
	per_page: number
	url: string
}

class Pager<T> {
	data: T[] = []
	per_page = 1
	pages: number
	private page: number = 1

	url: string

	constructor(opts: PagerArgs) {
		this.per_page = opts.per_page
		this.url = opts.url
	}

	async loadPage(page: number) {
		this.page = page

		const result = await api.request<{ data: T[], pages: number }>({
			method: "GET",
			url: "http://localhost:5000" + this.url,
			params: {
				"page": this.page,
				"per_page": this.per_page
			}
		})

		this.data = result.data
		this.pages = result.pages
	}
}

export default Pager
