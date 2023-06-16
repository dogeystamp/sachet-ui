import m, { Component } from "mithril"
import UserWidget from "../components/UserWidget"
import Auth from "../models/Auth"

const Layout: Component = {
	view: function(vnode) {
		return m("main.layout", [
			m(".header", [
				m("h2.header-title", "Sachet"),
				m("nav.menu", [
					m(m.route.Link, {href: "/docs"}, "Help"),
					Auth.permissions.includes("LIST") && m(m.route.Link, {href: "/files"}, "Shares"),
					Auth.permissions.includes("CREATE") && m(m.route.Link, {href: "/upload"}, "Upload"),
					Auth.permissions.includes("ADMIN") && m(m.route.Link, {href: "/admin"}, "Admin"),
				]),
				m(UserWidget)
			]),
			m("section", vnode.children)
		])
	}
}

export default Layout
