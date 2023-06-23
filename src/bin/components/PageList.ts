import m, { ClassComponent, Vnode } from "mithril"
import Pager from "../services/pagination"

interface PageListAttrs<T> {
	listModel: {
		pager: Pager<T>
		list: T[]
		loadList: (page: number) => void
	}
}

class PageList<T> implements ClassComponent<PageListAttrs<T>> {
	view = (vnode: Vnode<PageListAttrs<T>>) => {
		const model = vnode.attrs.listModel
		const pager = model.pager

		return m(".pagelist",
			pager.page > 1 && m("a.pagelist-prev", {
				href: "#", onclick: (e: Event) => {
					e.preventDefault()
					model.loadList(pager.page - 1)
				}
			}, "Prev"),
			Array.from({ length: pager.pages }, (v, i) => (i + 1)).map((page: number) => {
				if (page == pager.page)
					return m("a.pagelist-cur", {
						href: "#", onclick: (e: Event) => {
							e.preventDefault()
							model.loadList(page)
						}
					}, page.toString())
				else
					return m("a.pagelist-number", {
						href: "#", onclick: (e: Event) => {
							e.preventDefault()
							model.loadList(page)
						}
					}, page.toString())
			}),
			pager.page < pager.pages && m("a.pagelist-prev", {
				href: "#", onclick: (e: Event) => {
					e.preventDefault()
					model.loadList(pager.page + 1)
				}
			}, "Next"),
		)
	}
}

export default PageList
