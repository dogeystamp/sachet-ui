import m from "mithril"
import ShareList from "./views/ShareList"
import AdminView from "./views/Admin"
import Layout from "./views/Layout"

m.route(document.body, "/files", {
	"/admin": {
		render: function() {
			return m(Layout, m(AdminView))
		}
	},
	"/files": {
		render: function() {
			return m(Layout, m(ShareList))
		}
	},
})
