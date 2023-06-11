import m from "mithril";
import UserList from "./views/UserList"
import ShareList from "./views/ShareList"
import Layout from "./views/Layout";

m.route(document.body, "/files", {
	"/users": {
		render: function() {
			return m(Layout, m(UserList))
		}
	},
	"/files": {
		render: function() {
			return m(Layout, m(ShareList))
		}
	},
})
