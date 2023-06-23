import m, { Component } from "mithril"
import ShareList, { Share } from "../models/Share"
import PageList from "../components/PageList"

const ShareListView: Component = {
	oninit: () => { ShareList.loadList(1) },
	view: function() {
		return m(".share-list",
			ShareList.list.map((share) => {
				return m(".share-list-item", share.file_name + " ---------- " + share.create_date.toDate())
			}),
			m(new PageList<Share>, { listModel: ShareList })
		)
	}
}

export default ShareListView
