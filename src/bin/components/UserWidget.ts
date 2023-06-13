import m, { Component } from "mithril";
import Auth from "../models/Auth";

const UserWidget: Component = {
	view: () => {
		return Auth.authenticated ?
			m("t.userwidget-loggedin", "Logged in as ",
			  m(m.route.Link, { href: "/users/" + Auth.username }, Auth.username)) :
			m("t.userwidget-login", m(m.route.Link, { href: "/login" }, "Log in"))
	}
}

export default UserWidget
