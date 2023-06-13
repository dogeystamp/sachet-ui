import m, { Component } from "mithril"
import UserList from "../components/UserList"

const AdminView: Component = {
	view: function () {
		return m(".admin", m("h1", "Administration"), m("h2", "Users"), m(UserList))
	}
}

export default AdminView
