import m, { Component } from "mithril";

const UserWidget: Component = {
	view: () => {
		return m("t.userwidget-login", m(m.route.Link, {href: "/login"}, "Log in"))
	}
}

export default UserWidget
