import m, { Component } from "mithril"
import ShareModel from "../models/Share"

const ShareList: Component = {
	oninit: () => {ShareModel.loadList(1)},
	view: function() {
		return m(".share-list", ShareModel.list.map((share) => {
			return m(".share-list-item", share.file_name + " ---------- " + share.create_date.toDate())
		}))
	}
}

export default ShareList
