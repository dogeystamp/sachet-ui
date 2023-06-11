import m, { Component } from "mithril"

const Layout: Component = {
	view: function(vnode) {
		return m("main.layout", [
			m(".header", [
				m("h2.header-title", "Sachet"),
				m("nav.menu", [
					m(m.route.Link, {href: "/docs"}, "Help"),
					m(m.route.Link, {href: "/files"}, "Shares"),
					m(m.route.Link, {href: "/upload"}, "Upload"),
					m(m.route.Link, {href: "/admin"}, "Admin"),
				]),
				m("t.userwidget", ["Logged in as ", m("b", "dogeystamp")]),
			]),
			m("section", vnode.children)
		])
	}
}

export default Layout
