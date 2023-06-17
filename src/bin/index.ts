import m from "mithril"
import ShareList from "./views/ShareList"
import AdminView from "./views/Admin"
import Layout from "./views/Layout"
import UserView from "./views/UserView"

import Auth from "./models/Auth"
import LoginView from "./views/LoginView"
Auth.getPerms().then(() => {
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
		"/login": {
			render: function() {
				return m(Layout, m(LoginView))
			}
		},
		"/users/:username": {
			render: function(vnode) {
				return m(Layout, m(UserView, vnode.attrs))
			}
		},
	})
})
