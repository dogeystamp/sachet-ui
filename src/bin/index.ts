import m from "mithril"
import ShareListView from "./views/ShareList"
import AdminView from "./views/Admin"
import Layout from "./views/Layout"
import UserView from "./views/UserView"
import ShareView from "./views/ShareView"

import Auth from "./models/Auth"
import LoginView from "./views/LoginView"
import HomeView from "./views/Home"
import UploadView from "./views/Upload"
Auth.getPerms().then(() => {
	m.route(document.body, "/", {
		"/": {
			render: function() {
				return m(Layout, m(HomeView))
			}
		},
		"/admin": {
			render: function() {
				return m(Layout, m(AdminView))
			}
		},
		"/files": {
			render: function() {
				return m(Layout, m(ShareListView))
			}
		},
		"/files/:fileId": {
			render: function(vnode) {
				return m(Layout, m(ShareView, { key: m.route.param("fileId"), ...vnode.attrs }))
			}
		},
		"/login": {
			render: function() {
				return m(Layout, m(LoginView))
			}
		},
		"/users/:username": {
			render: function(vnode) {
				return m(Layout, [m(UserView, { key: m.route.param("username"), ...vnode.attrs })])
			}
		},
		"/upload": {
			render: function() {
				return m(Layout, m(UploadView))
			}
		}
	})
})
