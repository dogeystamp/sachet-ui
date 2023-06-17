import m from "mithril"
import ShareList from "./views/ShareList"
import AdminView from "./views/Admin"
import Layout from "./views/Layout"
import UserView from "./views/UserView"

// TODO: actually move this into a login page
import Auth from "./models/Auth"
Auth.login({username: "user", password: "password123"}).then(() => {
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
			"/users/:username": {
				render: function(vnode) {
					return m(Layout, m(UserView, vnode.attrs))
				}
			},
		})
	})
})
