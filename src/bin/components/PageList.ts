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
			m("a.pagelist-number", pager.page.toString()),
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
