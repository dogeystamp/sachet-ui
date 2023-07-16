import m, { Component } from "mithril"
import UserWidget from "../components/UserWidget"
import Auth from "../models/Auth"

const Layout: Component = {
	view: function(vnode) {
		return m("main.layout", [
			m(".header", [
				m(m.route.Link, { href: "/", selector: "a.header-title-link" }, m("h2.header-title", "Sachet")),
				m("nav.menu", [
					m(m.route.Link, { href: "/" }, "Home"),
					Auth.checkPerm("LIST") && m(m.route.Link, { href: "/files" }, "Shares"),
					Auth.checkPerm("CREATE") && m(m.route.Link, { href: "/upload" }, "Upload"),
					Auth.checkPerm("ADMIN") && m(m.route.Link, { href: "/admin" }, "Admin"),
				]),
				m(UserWidget)
			]),
			m("section", vnode.children)
		])
	}
}

export default Layout
