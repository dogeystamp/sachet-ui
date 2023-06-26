import m, { Component } from "mithril"
import ShareList, { Share } from "../models/Share"
import PageList from "../components/PageList"
import { formatDate } from "../services/util"

const ShareListView: Component = {
	oninit: () => {
		if (ShareList.pager.page == null)
			ShareList.reload()
	},
	view: function() {
		return [
			m("h2", "Shares"),
			m(".entrylist",
				m("table.entrylist-table",
					m("tr.entrylist",
						m("th", "File name"),
						m("th", "Owner"),
						m("th", "Creation date"),
					),
					ShareList.list.map(share => {
						return m(m.route.Link,
							{
								href: "/files/" + share.share_id,
								selector: "tr.entrylist-row",
							},
							m("td", share.file_name),
							m("td", share.owner_name || "[Anonymous]"),
							m("td", formatDate({ date: share.create_date, relative: true })),
						)
					}),
				),
			),
			m(new PageList<Share>, { listModel: ShareList })
		]
	}
}

export default ShareListView
