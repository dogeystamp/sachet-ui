import m, { Component } from "mithril"
import ShareList from "../models/Share"

const ShareListView: Component = {
	oninit: () => {ShareList.loadList(1)},
	view: function() {
		return m(".share-list", ShareList.list.map((share) => {
			return m(".share-list-item", share.file_name + " ---------- " + share.create_date.toDate())
		}))
	}
}

export default ShareListView
